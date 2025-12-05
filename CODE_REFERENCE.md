# Real-Time Sync - Complete Code Reference

## Backend Implementation

### 1. server.js (Updated)

```javascript
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
const server = http.createServer(app);

// Configure Socket.io with CORS
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
  }
});

app.use(cors());
app.use(express.json());

// Make io accessible to routes
app.set("io", io);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.get("/api/health", (req, res) => {
  res.json({ message: "Backend is running" });
});

// Socket.io Connection Handler
io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // User joins room based on role
  socket.on("user_role", (role, userId) => {
    socket.join(role); // admin or customer
    socket.join(`user_${userId}`); // personal room
    console.log(`User ${userId} (${role}) joined rooms`);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Backend started on http://localhost:${PORT}`);
});
```

### 2. services/socketService.js

```javascript
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

const broadcastOrderCreated = (io, order) => {
  try {
    io.to("admin").emit("order_created", {
      timestamp: new Date(),
      data: order
    });
    console.log(`[Socket] Broadcasted order_created:`, order._id);
  } catch (error) {
    console.error("[Socket] Error broadcasting order_created:", error);
  }
};

const broadcastOrderStatusUpdate = (io, order, userId) => {
  try {
    // Send to specific customer
    io.to(`user_${userId}`).emit("order_status_updated", {
      timestamp: new Date(),
      data: order
    });

    // Send to all admins
    io.to("admin").emit("order_status_updated", {
      timestamp: new Date(),
      data: order
    });

    console.log(`[Socket] Broadcasted order_status_updated:`, order._id);
  } catch (error) {
    console.error("[Socket] Error broadcasting order_status_updated:", error);
  }
};

const notifyAdmin = (io, message, type = "info", data = null) => {
  try {
    io.to("admin").emit("admin_notification", {
      timestamp: new Date(),
      message,
      type,
      data
    });
    console.log(`[Socket] Admin notification:`, message);
  } catch (error) {
    console.error("[Socket] Error sending admin notification:", error);
  }
};

const notifyCustomer = (io, userId, message, type = "info", data = null) => {
  try {
    io.to(`user_${userId}`).emit("customer_notification", {
      timestamp: new Date(),
      message,
      type,
      data
    });
    console.log(`[Socket] Customer notification to ${userId}:`, message);
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
```

### 3. controllers/productController.js (Updated)

```javascript
const Product = require("../models/Product");
const { broadcastProductUpdate } = require("../services/socketService");

exports.getAllProducts = async (req, res) => {
  try {
    const { category, subcategory, search } = req.query;
    let query = {};

    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (search) query.name = { $regex: search, $options: "i" };

    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).limit(8);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, category, subcategory, basePrice, image, flavors, sizes, eggOptions } = req.body;

    const product = new Product({
      name,
      description,
      category,
      subcategory,
      basePrice,
      image,
      flavors,
      sizes,
      eggOptions
    });

    const savedProduct = await product.save();

    // Emit socket event
    const io = req.app.get("io");
    broadcastProductUpdate(io, "product_created", savedProduct);

    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Emit socket event
    const io = req.app.get("io");
    broadcastProductUpdate(io, "product_updated", product);

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Emit socket event
    const io = req.app.get("io");
    broadcastProductUpdate(io, "product_deleted", product);

    res.json({ message: "Product deleted successfully", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
```

### 4. controllers/orderController.js (Updated)

```javascript
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const { broadcastOrderCreated, broadcastOrderStatusUpdate, notifyAdmin, notifyCustomer } = require("../services/socketService");

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

    // Populate user details
    const populatedOrder = await Order.findById(savedOrder._id).populate("userId", "name email phone");

    // Clear cart
    await Cart.findOneAndUpdate({ userId: req.user.id }, { items: [] });

    // Emit socket events
    const io = req.app.get("io");
    broadcastOrderCreated(io, populatedOrder);
    notifyAdmin(io, `New order from ${populatedOrder.userId.name}`, "success", { orderId: populatedOrder._id });
    notifyCustomer(io, req.user.id, "Your order has been received!", "success", { orderId: populatedOrder._id });

    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId", "name email phone").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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
```

---

## Frontend Implementation

### 1. hooks/useSocket.js

```javascript
import { useEffect, useState, useCallback } from "react";
import io from "socket.io-client";

const SOCKET_URL = "http://localhost:5001";

export const useSocket = (userId, userRole) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Create socket connection
    const socketInstance = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ["websocket", "polling"]
    });

    // Connection successful
    socketInstance.on("connect", () => {
      console.log("[Socket] Connected to server");
      setConnected(true);

      // Register user with their role and ID
      if (userId && userRole) {
        socketInstance.emit("user_role", userRole, userId);
      }
    });

    // Disconnected
    socketInstance.on("disconnect", () => {
      console.log("[Socket] Disconnected from server");
      setConnected(false);
    });

    // Connection error
    socketInstance.on("connect_error", (error) => {
      console.error("[Socket] Connection error:", error);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [userId, userRole]);

  // Listen to socket events
  const on = useCallback(
    (event, callback) => {
      if (socket) {
        socket.on(event, callback);
      }
    },
    [socket]
  );

  // Stop listening to socket events
  const off = useCallback(
    (event, callback) => {
      if (socket) {
        socket.off(event, callback);
      }
    },
    [socket]
  );

  // Emit socket events
  const emit = useCallback(
    (event, data) => {
      if (socket) {
        socket.emit(event, data);
      }
    },
    [socket]
  );

  return {
    socket,
    connected,
    on,
    off,
    emit
  };
};

export default useSocket;
```

### 2. context/SocketContext.jsx

```javascript
import React, { createContext, useState, useCallback, useEffect } from "react";
import useSocket from "../hooks/useSocket";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Load user from localStorage
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

  // Product created handler
  const handleProductCreated = useCallback((data) => {
    console.log("[Socket] Product created:", data.data);
    setProducts((prev) => [data.data, ...prev]);
  }, []);

  // Product updated handler
  const handleProductUpdated = useCallback((data) => {
    console.log("[Socket] Product updated:", data.data);
    setProducts((prev) =>
      prev.map((product) =>
        product._id === data.data._id ? data.data : product
      )
    );
  }, []);

  // Product deleted handler
  const handleProductDeleted = useCallback((data) => {
    console.log("[Socket] Product deleted:", data.data._id);
    setProducts((prev) => prev.filter((product) => product._id !== data.data._id));
  }, []);

  // Order created handler (admin only)
  const handleOrderCreated = useCallback((data) => {
    console.log("[Socket] Order created:", data.data);
    if (user?.role === "admin") {
      setOrders((prev) => [data.data, ...prev]);
    }
  }, [user?.role]);

  // Order status updated handler
  const handleOrderStatusUpdated = useCallback((data) => {
    console.log("[Socket] Order status updated:", data.data);
    setOrders((prev) =>
      prev.map((order) =>
        order._id === data.data._id ? data.data : order
      )
    );
  }, []);

  // Admin notification handler
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

      // Auto-remove after 5 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
      }, 5000);
    }
  }, [user?.role]);

  // Customer notification handler
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

      // Auto-remove after 5 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
      }, 5000);
    }
  }, [user?.role]);

  // Register all socket event listeners
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

      // Cleanup
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

  // Helper functions to update state manually
  const updateProducts = useCallback((newProducts) => {
    setProducts(newProducts);
  }, []);

  const updateOrders = useCallback((newOrders) => {
    setOrders(newOrders);
  }, []);

  const value = {
    socket,
    connected,
    user,
    products,
    orders,
    notifications,
    updateProducts,
    updateOrders
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
```

### 3. App.jsx (Updated)

```javascript
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import { Toaster } from 'sonner'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import CategoryPage from './pages/CategoryPage'
import AdminDashboard from './pages/AdminDashboard'
import CheckoutPage from './pages/CheckoutPage'

function App() {
  return (
    <SocketProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Toaster position="bottom-right" />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<AdminDashboard />} />

              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/category/:categoryId" element={<CategoryPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
              </Route>
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </SocketProvider>
  )
}

export default App
```

---

## Usage Examples in Components

### Example 1: ProductGallery with Real-Time Updates

```javascript
import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";

const ProductGallery = () => {
  const { products, connected } = useContext(SocketContext);

  return (
    <div className="product-gallery">
      {!connected && <div className="connection-warning">⚠️ Connection lost</div>}
      
      <div className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p className="price">₹{product.basePrice}</p>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
```

### Example 2: OrderTracker with Status Updates

```javascript
import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";

const OrderTracker = ({ orderId }) => {
  const { orders } = useContext(SocketContext);
  
  const order = orders.find((o) => o._id === orderId);
  
  if (!order) return <p>Loading...</p>;

  const statusSteps = ["pending", "processing", "shipped", "delivered"];
  const currentStep = statusSteps.indexOf(order.status);

  return (
    <div className="order-tracker">
      <h2>Order #{orderId.slice(-6)}</h2>
      
      <div className="status-timeline">
        {statusSteps.map((step, index) => (
          <div
            key={step}
            className={`step ${index <= currentStep ? "completed" : ""}`}
          >
            <div className="step-circle">{index + 1}</div>
            <p className="step-label">{step}</p>
          </div>
        ))}
      </div>

      <p className="current-status">
        Current Status: <strong>{order.status}</strong>
      </p>
      
      {/* Updates automatically when admin changes status */}
    </div>
  );
};

export default OrderTracker;
```

---

## Database Schema

### Product Model
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: String,
  subcategory: String,
  basePrice: Number,
  image: String,
  flavors: [{name: String, priceMultiplier: Number}],
  sizes: [{name: String, servings: String, priceMultiplier: Number}],
  eggOptions: [{name: String, priceMultiplier: Number}],
  rating: Number,
  reviews: [{user: String, rating: Number, comment: String, date: Date}],
  available: Boolean,
  featured: Boolean,
  stock: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  items: [{
    productId: ObjectId (ref: Product),
    name: String,
    quantity: Number,
    price: Number,
    flavor: String,
    size: String,
    eggOption: String,
    subtotal: Number
  }],
  totalPrice: Number,
  shippingAddress: String,
  phone: String,
  status: String (enum: pending, processing, shipped, delivered, cancelled),
  paymentMethod: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Common Errors & Solutions

**Error:** "Cannot read property 'io' of undefined"  
**Solution:** Ensure `server.js` is using `http.createServer(app)` instead of `app.listen()`

**Error:** "Product updates not syncing"  
**Solution:** Verify `broadcastProductUpdate` is being called in controller

**Error:** "Socket disconnecting immediately"  
**Solution:** Check CORS configuration in Socket.io setup

**Error:** "SocketContext is undefined"  
**Solution:** Ensure `<SocketProvider>` wraps your entire app in `App.jsx`

---

**For more information, see `REALTIME_SYNC_GUIDE.md` and `REALTIME_QUICKSTART.md`**
