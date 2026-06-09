/**
 * Cake Pricing Database
 * Single source of truth for all cake prices
 * Structured by category and flavor
 * All prices are for 1 kg base weight
 */

export const CAKE_PRICES = {
  // CHOCOLATE CAKES
  'chocolate-cakes': {
    chocochip: {
      name: 'Chocochip Cake',
      basePrice: 650, // 1 kg price
      description: 'Delicious chocolate cake with chocolate chips'
    },
    brownie: {
      name: 'Brownie Cake',
      basePrice: 640,
      description: 'Rich fudgy brownie with dense chocolate layers'
    },
    'choco-coffee': {
      name: 'Choco Coffee Cake',
      basePrice: 700,
      description: 'Smooth chocolate with aromatic coffee notes'
    },
    'choco-truffle': {
      name: 'Choco Truffle Cake',
      basePrice: 850,
      description: 'Premium chocolate truffle with ganache'
    },
    'devils-fav': {
      name: "Devil's Favourite",
      basePrice: 800,
      description: 'Ultra-dark chocolate fudge cake'
    }
  },

  // FRUIT CAKES
  'fruit-cakes': {
    'mix-fruit': {
      name: 'Mix Fruit Cake',
      basePrice: 650,
      description: 'Assorted fresh fruits with cream'
    },
    'fresh-fruit': {
      name: 'Fresh Fruit Cake',
      basePrice: 700,
      description: 'Premium fresh seasonal fruits'
    },
    pineapple: {
      name: 'Pineapple Cake',
      basePrice: 550,
      description: 'Classic pineapple upside-down'
    }
  },

  // SPECIAL CAKES
  'special-cakes': {
    'kit-kat': {
      name: 'Kit Kat Cake',
      basePrice: 850,
      description: 'Delightful Kit Kat chocolate cake'
    },
    'red-velvet': {
      name: 'Red Velvet Cake',
      basePrice: 800,
      description: 'Elegant red velvet with cream cheese'
    }
  },

  // CLASSIC FLAVOURS
  'classic-flavours': {
    vanilla: {
      name: 'Vanilla Cake',
      basePrice: 500,
      description: 'Timeless vanilla sponge with buttercream'
    },
    pineapple: {
      name: 'Pineapple Cake',
      basePrice: 550,
      description: 'Tropical pineapple flavor cake'
    },
    'black-currant': {
      name: 'Black Currant Cake',
      basePrice: 650,
      description: 'Tangy black currant delights'
    },
    'black-forest': {
      name: 'Black Forest Cake',
      basePrice: 570,
      description: 'German Black Forest with cherries'
    },
    'white-forest': {
      name: 'White Forest Cake',
      basePrice: 570,
      description: 'White chocolate with fruits and cream'
    }
  }
};

/**
 * Weight multipliers for price calculation
 * All weights are calculated as multiples of the 1 kg base price
 */
export const WEIGHT_MULTIPLIERS = {
  '0.5 kg': 0.5,
  '1 kg': 1,
  '1.5 kg': 1.5,
  '2 kg': 2,
  '2.5 kg': 2.5,
  '3 kg': 3
};

/**
 * Get all flavor options for a specific category
 * @param {string} category - Category ID (e.g., 'chocolate-cakes')
 * @returns {Array} Array of flavor objects with id, name, and basePrice
 */
export const getFlavorsByCategory = (category) => {
  if (!CAKE_PRICES[category]) return [];
  
  return Object.entries(CAKE_PRICES[category]).map(([id, flavor]) => ({
    id,
    ...flavor
  }));
};

/**
 * Get all available weights with their multipliers
 * @returns {Array} Array of weight objects
 */
export const getAvailableWeights = () => {
  return Object.entries(WEIGHT_MULTIPLIERS).map(([label, multiplier]) => ({
    label,
    value: label,
    multiplier
  }));
};

/**
 * Calculate price for a specific cake
 * @param {string} category - Category ID
 * @param {string} flavorId - Flavor ID within category
 * @param {string} weight - Weight (e.g., '1 kg', '2 kg')
 * @returns {number|null} Calculated price or null if not found
 */
export const calculateCakePrice = (category, flavorId, weight) => {
  // Validate inputs
  if (!category || !flavorId || !weight) {
    console.warn('Invalid inputs for price calculation:', { category, flavorId, weight });
    return null;
  }

  // Get flavor details
  const flavor = CAKE_PRICES[category]?.[flavorId];
  if (!flavor) {
    console.warn(`Flavor not found: ${category}/${flavorId}`);
    return null;
  }

  // Get weight multiplier
  const multiplier = WEIGHT_MULTIPLIERS[weight];
  if (multiplier === undefined) {
    console.warn(`Invalid weight: ${weight}`);
    return null;
  }

  // Calculate final price
  const finalPrice = Math.round(flavor.basePrice * multiplier);
  return finalPrice;
};

/**
 * Get price breakdown for display
 * Shows base price and weight information
 * @param {string} category - Category ID
 * @param {string} flavorId - Flavor ID
 * @param {string} weight - Weight
 * @returns {Object} Price breakdown with base, multiplier, and final price
 */
export const getPriceBreakdown = (category, flavorId, weight) => {
  const flavor = CAKE_PRICES[category]?.[flavorId];
  const multiplier = WEIGHT_MULTIPLIERS[weight];

  if (!flavor || multiplier === undefined) {
    return null;
  }

  const basePrice = flavor.basePrice;
  const finalPrice = Math.round(basePrice * multiplier);

  return {
    flavorName: flavor.name,
    weight,
    basePrice,
    multiplier,
    finalPrice
  };
};

/**
 * Get suggested price for a product (for non-standard products)
 * Falls back to a base calculation if no exact match
 * @param {number} basePrice - Base price for 1 kg
 * @param {string} weight - Weight
 * @returns {number} Calculated price
 */
export const calculatePriceFromBase = (basePrice, weight) => {
  if (!basePrice || !weight) return null;
  
  const multiplier = WEIGHT_MULTIPLIERS[weight];
  if (multiplier === undefined) return null;

  return Math.round(basePrice * multiplier);
};

/**
 * Validate price exists for a product
 * @param {string} category - Category ID
 * @param {string} flavorId - Flavor ID
 * @returns {boolean} True if price data exists
 */
export const priceExists = (category, flavorId) => {
  return !!(CAKE_PRICES[category]?.[flavorId]);
};

/**
 * Get all categories with their flavors and prices
 * Useful for admin/inventory management
 * @returns {Object} Complete pricing structure
 */
export const getAllCakePrices = () => {
  return CAKE_PRICES;
};

/**
 * Search for a flavor across all categories
 * @param {string} searchTerm - Flavor name or ID to search
 * @returns {Array} Array of matching flavors with category info
 */
export const searchFlavor = (searchTerm) => {
  const results = [];
  const term = searchTerm.toLowerCase();

  Object.entries(CAKE_PRICES).forEach(([category, flavors]) => {
    Object.entries(flavors).forEach(([flavorId, flavor]) => {
      if (
        flavorId.toLowerCase().includes(term) ||
        flavor.name.toLowerCase().includes(term)
      ) {
        results.push({
          category,
          flavorId,
          ...flavor
        });
      }
    });
  });

  return results;
};
