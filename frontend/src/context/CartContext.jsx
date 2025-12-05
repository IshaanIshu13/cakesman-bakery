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
    const newCart = [...existingCart, item];
    localStorage.setItem('cart', JSON.stringify(newCart));
    setCartItems(newCart);
    setCartCount(newCart.reduce((total, item) => total + (item.quantity || 1), 0));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeFromCart = (cartId) => {
    const newCart = cartItems.filter(item => item.cartId !== cartId);
    localStorage.setItem('cart', JSON.stringify(newCart));
    setCartItems(newCart);
    setCartCount(newCart.reduce((total, item) => total + (item.quantity || 1), 0));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const updateQuantity = (cartId, newQuantity) => {
    const newCart = cartItems.map(item =>
      item.cartId === cartId ? { ...item, quantity: newQuantity } : item
    );
    localStorage.setItem('cart', JSON.stringify(newCart));
    setCartItems(newCart);
    setCartCount(newCart.reduce((total, item) => total + (item.quantity || 1), 0));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const clearCart = () => {
    localStorage.removeItem('cart');
    setCartItems([]);
    setCartCount(0);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <CartContext.Provider 
      value={{
        cartItems,
        cartCount,
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