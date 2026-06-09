/* eslint-disable unicode-bom */
import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    loadCartItems();
    window.addEventListener('cartUpdated', loadCartItems);
    return () => window.removeEventListener('cartUpdated', loadCartItems);
  }, []);

  const loadCartItems = () => {
    const items = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(items);
    setCartCount(items.reduce((total, item) => total + (item.quantity || 1), 0));
  };

  const addToCart = (item) => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    // Ensure quantity defaults to 1 if not provided
    const itemToAdd = {
      ...item,
      quantity: item.quantity || 1
    };
    const newCart = [...existingCart, itemToAdd];
    localStorage.setItem('cart', JSON.stringify(newCart));
    setCartItems(newCart);
    setCartCount(newCart.reduce((total, cartItem) => total + (cartItem.quantity || 1), 0));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeFromCart = (cartId) => {
    // Remove item by unique cartId (each item gets a unique ID when added)
    const newCart = cartItems.filter(item => item.cartId !== cartId);
    localStorage.setItem('cart', JSON.stringify(newCart));
    setCartItems(newCart);
    setCartCount(newCart.reduce((total, cartItem) => total + (cartItem.quantity || 1), 0));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const updateQuantity = (cartId, newQuantity) => {
    // Ensure newQuantity is at least 1
    const validQuantity = Math.max(1, parseInt(newQuantity) || 1);
    const newCart = cartItems.map(item =>
      item.cartId === cartId ? { ...item, quantity: validQuantity } : item
    );
    localStorage.setItem('cart', JSON.stringify(newCart));
    setCartItems(newCart);
    setCartCount(newCart.reduce((total, cartItem) => total + (cartItem.quantity || 1), 0));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const clearCart = () => {
    localStorage.removeItem('cart');
    setCartItems([]);
    setCartCount(0);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Add getCartCount function for direct access
  const getCartCount = () => cartCount;

  return (
    <CartContext.Provider 
      value={{
        cartItems,
        cartCount,
        getCartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;