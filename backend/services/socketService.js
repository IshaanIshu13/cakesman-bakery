/**
 * Socket.io Service
 * Handles real-time event broadcasting for products and orders
 */

/**
 * Broadcast product updates to all connected clients
 * @param {Object} io - Socket.io instance
 * @param {String} event - Event name (product_created, product_updated, product_deleted)
 * @param {Object} product - Product data
 */
const broadcastProductUpdate = (io, event, product) => {
  try {
    io.emit(event, {
      timestamp: new Date(),
      data: product
    });
    console.log(`[Socket] Broadcasted ${event}:`, product._id);
  } catch (error) {
    console.error(`[Socket] Error broadcasting ${event}:`, error);
  }
};

/**
 * Broadcast order creation to admin dashboard
 * @param {Object} io - Socket.io instance
 * @param {Object} order - Order data with populated user and products
 */
const broadcastOrderCreated = (io, order) => {
  try {
    io.to("admin").emit("order_created", {
      timestamp: new Date(),
      data: order
    });
    console.log(`[Socket] Broadcasted order_created to admins:`, order._id);
  } catch (error) {
    console.error("[Socket] Error broadcasting order_created:", error);
  }
};

/**
 * Broadcast order status update to customers
 * @param {Object} io - Socket.io instance
 * @param {Object} order - Updated order data
 * @param {String} userId - Customer user ID
 */
const broadcastOrderStatusUpdate = (io, order, userId) => {
  try {
    // Emit to specific user's room and to all admins
    io.to(`user_${userId}`).emit("order_status_updated", {
      timestamp: new Date(),
      data: order
    });

    io.to("admin").emit("order_status_updated", {
      timestamp: new Date(),
      data: order
    });

    console.log(`[Socket] Broadcasted order_status_updated to user ${userId}:`, order._id);
  } catch (error) {
    console.error("[Socket] Error broadcasting order_status_updated:", error);
  }
};

/**
 * Send notification to admin
 * @param {Object} io - Socket.io instance
 * @param {String} message - Notification message
 * @param {String} type - Notification type (success, info, warning, error)
 * @param {Object} data - Optional additional data
 */
const notifyAdmin = (io, message, type = "info", data = null) => {
  try {
    io.to("admin").emit("admin_notification", {
      timestamp: new Date(),
      message,
      type,
      data
    });
    console.log(`[Socket] Admin notification sent:`, message);
  } catch (error) {
    console.error("[Socket] Error sending admin notification:", error);
  }
};

/**
 * Notify specific customer
 * @param {Object} io - Socket.io instance
 * @param {String} userId - Customer user ID
 * @param {String} message - Notification message
 * @param {String} type - Notification type
 * @param {Object} data - Optional additional data
 */
const notifyCustomer = (io, userId, message, type = "info", data = null) => {
  try {
    io.to(`user_${userId}`).emit("customer_notification", {
      timestamp: new Date(),
      message,
      type,
      data
    });
    console.log(`[Socket] Customer notification sent to ${userId}:`, message);
  } catch (error) {
    console.error("[Socket] Error sending customer notification:", error);
  }
};

module.exports = {
  broadcastProductUpdate,
  broadcastOrderCreated,
  broadcastOrderStatusUpdate,
  notifyAdmin,
  notifyCustomer
};
