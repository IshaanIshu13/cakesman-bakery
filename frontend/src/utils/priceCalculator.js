/**
 * Price Calculation Utilities
 * Handles all price-related calculations for the cart and checkout
 */

import { calculateCakePrice, WEIGHT_MULTIPLIERS } from '../data/cakePrices';

/**
 * Calculate item price for a cart item
 * @param {Object} cartItem - Cart item object with category, flavor, size, quantity
 * @returns {number} Total price for the item (price × quantity)
 */
export const calculateItemPrice = (cartItem) => {
  if (!cartItem) return 0;

  const { category, flavor, size, quantity = 1, price } = cartItem;

  // If price is already calculated and stored, use it
  // (This is for backward compatibility and cached prices)
  if (price && typeof price === 'number') {
    return Math.round(price * quantity);
  }

  // Otherwise, calculate from category and flavor
  if (category && flavor) {
    const unitPrice = calculateCakePrice(category, flavor, size || '1 kg');
    if (unitPrice !== null) {
      return Math.round(unitPrice * quantity);
    }
  }

  return 0;
};

/**
 * Calculate unit price (price for single quantity)
 * @param {Object} cartItem - Cart item
 * @returns {number} Unit price
 */
export const calculateUnitPrice = (cartItem) => {
  if (!cartItem) return 0;

  const { category, flavor, size, price } = cartItem;

  if (price && typeof price === 'number') {
    return price;
  }

  if (category && flavor) {
    const unitPrice = calculateCakePrice(category, flavor, size || '1 kg');
    return unitPrice !== null ? unitPrice : 0;
  }

  return 0;
};

/**
 * Calculate cart total
 * @param {Array} cartItems - Array of cart items
 * @returns {Object} Total price breakdown
 */
export const calculateCartTotal = (cartItems = []) => {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return {
      subtotal: 0,
      tax: 0,
      total: 0,
      itemCount: 0
    };
  }

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + calculateItemPrice(item);
  }, 0);

  // Tax calculation (assuming 18% GST for India)
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  // Count total items (by quantity, not by unique items)
  const itemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return {
    subtotal: Math.round(subtotal),
    tax: Math.round(tax),
    total: Math.round(total),
    itemCount
  };
};

/**
 * Calculate price when weight changes
 * @param {number} basePrice - Base price for 1 kg
 * @param {string} newWeight - New weight selection
 * @returns {number} New calculated price
 */
export const recalculatePriceForWeight = (basePrice, newWeight) => {
  if (!basePrice || !newWeight) return basePrice;

  const multiplier = WEIGHT_MULTIPLIERS[newWeight];
  if (multiplier === undefined) return basePrice;

  return Math.round(basePrice * multiplier);
};

/**
 * Calculate price when quantity changes
 * @param {number} unitPrice - Price per unit
 * @param {number} newQuantity - New quantity
 * @returns {number} New total price
 */
export const recalculatePriceForQuantity = (unitPrice, newQuantity) => {
  if (!unitPrice || !newQuantity) return 0;
  return Math.round(unitPrice * newQuantity);
};

/**
 * Format price for display with currency
 * @param {number} price - Price in base currency units
 * @param {string} currency - Currency symbol (default: ₹)
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, currency = '₹') => {
  if (typeof price !== 'number' || isNaN(price)) return `${currency}0`;
  return `${currency}${price.toLocaleString('en-IN')}`;
};

/**
 * Format price without symbol for calculations
 * @param {number} price - Price value
 * @returns {number} Numeric price
 */
export const parsePrice = (price) => {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') {
    const cleaned = price.replace(/[₹,]/g, '');
    return parseInt(cleaned) || 0;
  }
  return 0;
};

/**
 * Validate price integrity
 * Checks if calculated price matches expected range
 * @param {number} calculatedPrice - Calculated price
 * @param {number} basePrice - Base price reference
 * @returns {boolean} True if price is reasonable
 */
export const validatePrice = (calculatedPrice, basePrice) => {
  if (!calculatedPrice || !basePrice) return false;

  // Price should be between 25% and 400% of base price (0.25x to 4x)
  const minExpected = basePrice * 0.25;
  const maxExpected = basePrice * 4;

  return calculatedPrice >= minExpected && calculatedPrice <= maxExpected;
};

/**
 * Get price comparison for different weights
 * Useful for showing price tiers to customers
 * @param {number} basePrice - Base price for 1 kg
 * @returns {Array} Array of weight options with prices
 */
export const getPriceTiers = (basePrice) => {
  if (!basePrice) return [];

  return Object.entries(WEIGHT_MULTIPLIERS).map(([weight, multiplier]) => ({
    weight,
    price: Math.round(basePrice * multiplier),
    multiplier,
    savings: multiplier < 1 ? `₹${Math.round(basePrice * (1 - multiplier))}` : null
  }));
};

/**
 * Calculate discount value if applicable
 * @param {number} originalPrice - Original price
 * @param {number} discountedPrice - Discounted price
 * @returns {Object} Discount breakdown
 */
export const calculateDiscount = (originalPrice, discountedPrice) => {
  if (originalPrice <= discountedPrice) {
    return {
      hasDiscount: false,
      amount: 0,
      percentage: 0
    };
  }

  const discountAmount = originalPrice - discountedPrice;
  const discountPercentage = Math.round((discountAmount / originalPrice) * 100);

  return {
    hasDiscount: true,
    amount: Math.round(discountAmount),
    percentage: discountPercentage
  };
};

/**
 * Calculate delivery charges based on order total
 * Free delivery above ₹500, otherwise ₹50
 * @param {number} orderTotal - Order total
 * @returns {number} Delivery charges
 */
export const calculateDeliveryCharges = (orderTotal) => {
  if (orderTotal >= 500) return 0;
  return 50;
};

/**
 * Calculate final order total with all charges
 * @param {number} subtotal - Subtotal before tax
 * @param {number} tax - Tax amount
 * @param {number} deliveryCharges - Delivery charges
 * @returns {Object} Final breakdown
 */
export const calculateFinalTotal = (subtotal, tax, deliveryCharges = 0) => {
  const total = subtotal + tax + deliveryCharges;

  return {
    subtotal: Math.round(subtotal),
    tax: Math.round(tax),
    deliveryCharges: Math.round(deliveryCharges),
    total: Math.round(total)
  };
};
