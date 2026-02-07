const Order = require("../models/Order");
const Cart = require("../models/Cart");
const { broadcastOrderCreated, broadcastOrderStatusUpdate, notifyAdmin, notifyCustomer } = require("../services/socketService");

// Create order
exports.createOrder = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated", success: false });
    }

    const { items, totalPrice, shippingAddress, phone, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ 
        message: "Cart is empty",
        success: false 
      });
    }

    if (!totalPrice || !shippingAddress || !phone) {
      return res.status(400).json({ 
        message: "Missing required fields: totalPrice, shippingAddress, phone",
        success: false 
      });
    }

    const order = new Order({
      userId: req.user.id,
      items,
      totalPrice,
      shippingAddress,
      phone,
      notes
    });

    const savedOrder = await order.save();

    // Populate user details for notification
    const populatedOrder = await Order.findById(savedOrder._id).populate("userId", "name email phone");

    // Clear cart
    await Cart.findOneAndUpdate({ userId: req.user.id }, { items: [] });

    // Emit socket events
    const io = req.app.get("io");
    if (io) {
      broadcastOrderCreated(io, populatedOrder);
      notifyAdmin(io, `New order received from ${populatedOrder.userId.name}`, "success", { orderId: populatedOrder._id });
      notifyCustomer(io, req.user.id, "Your order has been received! Waiting for confirmation.", "success", { orderId: populatedOrder._id });
    }

    res.status(201).json({ success: true, message: "Order created successfully", data: savedOrder });
  } catch (err) {
    console.error("❌ Create order error:", err);
    res.status(500).json({ 
      message: "Failed to create order",
      error: err.message,
      success: false 
    });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated", success: false });
    }

    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders, count: orders.length });
  } catch (err) {
    console.error("❌ Get user orders error:", err);
    res.status(500).json({ 
      message: "Failed to fetch user orders",
      error: err.message,
      success: false 
    });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ 
        message: "Order not found",
        success: false 
      });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    console.error("❌ Get order error:", err);
    res.status(500).json({ 
      message: "Failed to fetch order",
      error: err.message,
      success: false 
    });
  }
};

// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId", "name email phone").sort({ createdAt: -1 });
    res.json({ success: true, data: orders, count: orders.length });
  } catch (err) {
    console.error("❌ Get all orders error:", err);
    res.status(500).json({ 
      message: "Failed to fetch orders",
      error: err.message,
      success: false 
    });
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required", success: false });
    }

    const validStatuses = ["pending", "confirmed", "preparing", "ready", "delivering", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Invalid status. Valid statuses: ${validStatuses.join(", ")}`,
        success: false 
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id, 
      { status, updatedAt: new Date() }, 
      { new: true }
    ).populate("userId", "name email phone");

    if (!order) {
      return res.status(404).json({ 
        message: "Order not found",
        success: false 
      });
    }
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Emit socket events
    const io = req.app.get("io");
    broadcastOrderStatusUpdate(io, order, order.userId.toString());
    notifyCustomer(io, order.userId.toString(), `Order status updated to: ${status}`, "info", { orderId: order._id, status });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
