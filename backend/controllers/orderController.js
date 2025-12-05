const Order = require("../models/Order");
const Cart = require("../models/Cart");
const { broadcastOrderCreated, broadcastOrderStatusUpdate, notifyAdmin, notifyCustomer } = require("../services/socketService");

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { items, totalPrice, shippingAddress, phone, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
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
    broadcastOrderCreated(io, populatedOrder);
    notifyAdmin(io, `New order received from ${populatedOrder.userId.name}`, "success", { orderId: populatedOrder._id });
    notifyCustomer(io, req.user.id, "Your order has been received! Waiting for confirmation.", "success", { orderId: populatedOrder._id });

    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId", "name email phone").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status, updatedAt: new Date() }, { new: true });
    
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
