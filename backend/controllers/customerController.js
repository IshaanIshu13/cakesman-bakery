const User = require("../models/User");
const Order = require("../models/Order");

// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ isAdmin: false }).select("-password").sort({ createdAt: -1 });
    
    // Enrich customer data with order statistics
    const enrichedCustomers = await Promise.all(
      customers.map(async (customer) => {
        const orders = await Order.find({ userId: customer._id });
        const totalSpent = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
        const totalOrders = orders.length;
        
        return {
          ...customer.toObject(),
          totalSpent,
          totalOrders
        };
      })
    );

    res.json(enrichedCustomers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get customer by ID with full details
exports.getCustomerDetails = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id).select("-password");
    
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Get customer's orders
    const orders = await Order.find({ userId: customer._id }).sort({ createdAt: -1 });
    
    // Calculate statistics
    const totalSpent = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const ordersByStatus = {};
    const statuses = ["pending", "accepted", "baking", "out_for_delivery", "completed", "cancelled"];
    
    statuses.forEach(status => {
      ordersByStatus[status] = orders.filter(o => o.status === status).length;
    });

    res.json({
      customer: customer.toObject(),
      orders,
      statistics: {
        totalSpent,
        totalOrders: orders.length,
        ordersByStatus
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Search customers
exports.searchCustomers = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: "Search query required" });
    }

    const customers = await User.find({
      isAdmin: false,
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { phone: { $regex: query, $options: "i" } }
      ]
    }).select("-password").limit(10);

    // Enrich with order data
    const enrichedCustomers = await Promise.all(
      customers.map(async (customer) => {
        const orders = await Order.find({ userId: customer._id });
        const totalSpent = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
        
        return {
          ...customer.toObject(),
          totalSpent,
          totalOrders: orders.length
        };
      })
    );

    res.json(enrichedCustomers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get customer order history
exports.getCustomerOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update customer info
exports.updateCustomerInfo = async (req, res) => {
  try {
    const { name, phone, address, city } = req.body;
    
    const updatedCustomer = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone, address, city },
      { new: true }
    ).select("-password");

    res.json(updatedCustomer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
