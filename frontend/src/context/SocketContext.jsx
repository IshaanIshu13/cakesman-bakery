/**
 * SocketContext - Manages real-time updates across the application
 * Handles products, orders, and notifications
 */

import React, { createContext, useState, useCallback, useEffect } from "react";
import useSocket from "../hooks/useSocket";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Get user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // Initialize socket connection
  const { socket, connected, on, off } = useSocket(user?._id, user?.role);

  /**
   * Handle product created event
   */
  const handleProductCreated = useCallback((data) => {
    console.log("[Socket] Product created:", data.data);
    setProducts((prev) => [data.data, ...prev]);
  }, []);

  /**
   * Handle product updated event
   */
  const handleProductUpdated = useCallback((data) => {
    console.log("[Socket] Product updated:", data.data);
    setProducts((prev) =>
      prev.map((product) =>
        product._id === data.data._id ? data.data : product
      )
    );
  }, []);

  /**
   * Handle product deleted event
   */
  const handleProductDeleted = useCallback((data) => {
    console.log("[Socket] Product deleted:", data.data._id);
    setProducts((prev) => prev.filter((product) => product._id !== data.data._id));
  }, []);

  /**
   * Handle order created event (for admin)
   */
  const handleOrderCreated = useCallback((data) => {
    console.log("[Socket] Order created:", data.data);
    if (user?.role === "admin") {
      setOrders((prev) => [data.data, ...prev]);
    }
  }, [user?.role]);

  /**
   * Handle order status updated event
   */
  const handleOrderStatusUpdated = useCallback((data) => {
    console.log("[Socket] Order status updated:", data.data);
    setOrders((prev) =>
      prev.map((order) =>
        order._id === data.data._id ? data.data : order
      )
    );
  }, []);

  /**
   * Handle admin notifications
   */
  const handleAdminNotification = useCallback((data) => {
    console.log("[Socket] Admin notification:", data);
    if (user?.role === "admin") {
      const notification = {
        id: Date.now(),
        timestamp: data.timestamp,
        message: data.message,
        type: data.type,
        data: data.data,
        read: false
      };
      setNotifications((prev) => [notification, ...prev]);

      // Auto-remove notification after 5 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
      }, 5000);
    }
  }, [user?.role]);

  /**
   * Handle customer notifications
   */
  const handleCustomerNotification = useCallback((data) => {
    console.log("[Socket] Customer notification:", data);
    if (user?.role === "customer") {
      const notification = {
        id: Date.now(),
        timestamp: data.timestamp,
        message: data.message,
        type: data.type,
        data: data.data,
        read: false
      };
      setNotifications((prev) => [notification, ...prev]);

      // Auto-remove notification after 5 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
      }, 5000);
    }
  }, [user?.role]);

  /**
   * Register all socket event listeners
   */
  useEffect(() => {
    if (connected && socket) {
      // Product events
      on("product_created", handleProductCreated);
      on("product_updated", handleProductUpdated);
      on("product_deleted", handleProductDeleted);

      // Order events
      on("order_created", handleOrderCreated);
      on("order_status_updated", handleOrderStatusUpdated);

      // Notification events
      on("admin_notification", handleAdminNotification);
      on("customer_notification", handleCustomerNotification);

      // Cleanup listeners
      return () => {
        off("product_created", handleProductCreated);
        off("product_updated", handleProductUpdated);
        off("product_deleted", handleProductDeleted);
        off("order_created", handleOrderCreated);
        off("order_status_updated", handleOrderStatusUpdated);
        off("admin_notification", handleAdminNotification);
        off("customer_notification", handleCustomerNotification);
      };
    }
  }, [
    connected,
    socket,
    on,
    off,
    handleProductCreated,
    handleProductUpdated,
    handleProductDeleted,
    handleOrderCreated,
    handleOrderStatusUpdated,
    handleAdminNotification,
    handleCustomerNotification
  ]);

  /**
   * Update products in context
   */
  const updateProducts = useCallback((newProducts) => {
    setProducts(newProducts);
  }, []);

  /**
   * Update orders in context
   */
  const updateOrders = useCallback((newOrders) => {
    setOrders(newOrders);
  }, []);

  /**
   * Add notification manually
   */
  const addNotification = useCallback((message, type = "info") => {
    const notification = {
      id: Date.now(),
      timestamp: new Date(),
      message,
      type,
      read: false
    };
    setNotifications((prev) => [notification, ...prev]);
  }, []);

  /**
   * Clear all notifications
   */
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
    socket,
    connected,
    user,
    products,
    orders,
    notifications,
    updateProducts,
    updateOrders,
    addNotification,
    clearNotifications
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
