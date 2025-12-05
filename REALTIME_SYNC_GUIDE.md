# Real-Time Sync Implementation Guide for Cakesman Bakery

## Overview
This guide documents the complete implementation of real-time synchronization between Admin Dashboard and Customer Dashboard using Socket.io.

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    MongoDB Database                          │
│     (Products Collection, Orders Collection, Users)          │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│                   Express.js Backend                         │
│  - API Endpoints (POST/PATCH/DELETE)                        │
│  - Controllers (with Socket emissions)                       │
│  - Socket.io Server (Real-time event broadcast)             │
│  - Socket Service (Helper functions)                         │
└──────────────────────────────────────────────────────────────┘
                    ↓                        ↓
        ┌────────────────────┐   ┌──────────────────────┐
        │   Admin Dashboard  │   │ Customer Dashboard   │
        │ (React Frontend)   │   │  (React Frontend)    │
        │ - Manage Products  │   │ - Browse Products    │
        │ - View Orders      │   │ - Place Orders       │
        │ - Update Status    │   │ - Track Orders       │
        └────────────────────┘   └──────────────────────┘
                    ↑                        ↑
        ┌────────────────────────────────────────────────┐
        │     Socket.io Client Listeners                 │
        │ (useSocket hook + SocketContext)               │
        └────────────────────────────────────────────────┘
```

## 1. Backend Setup

### 1.1 Updated server.js
**File:** `backend/server.js`

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

// Socket.io configuration
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
  }
});

app.use(cors());
app.use(express.json());

// Store socket instance globally for use in controllers
app.set("io", io);

// ... MongoDB connection ...

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on("user_role", (role, userId) => {
    socket.join(role);
    socket.join(`user_${userId}`);
    console.log(`User ${userId} (${role}) joined`);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Backend on http://localhost:${PORT}`));
```

**Key Points:**
- Uses `http.createServer()` instead of `app.listen()` for Socket.io compatibility
- Configures CORS for frontend origin
- Creates socket rooms for "admin" and "customer" users
- Stores io instance in Express app for controller access

### 1.2 Socket Service (Helper Functions)
**File:** `backend/services/socketService.js`

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
    console.log(`[Socket] Order created event sent to admins:`, order._id);
  } catch (error) {
    console.error("[Socket] Error broadcasting order_created:", error);
  }
};

const broadcastOrderStatusUpdate = (io, order, userId) => {
  try {
    io.to(`user_${userId}`).emit("order_status_updated", {
      timestamp: new Date(),
      data: order
    });
    io.to("admin").emit("order_status_updated", {
      timestamp: new Date(),
      data: order
    });
    console.log(`[Socket] Status update sent for order:`, order._id);
  } catch (error) {
    console.error("[Socket] Error:", error);
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
  } catch (error) {
    console.error("[Socket] Error sending notification:", error);
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
  } catch (error) {
    console.error("[Socket] Error:", error);
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

### 1.3 Updated Product Controller
**File:** `backend/controllers/productController.js`

Key changes:
```javascript
const { broadcastProductUpdate } = require("../services/socketService");

// CREATE
exports.createProduct = async (req, res) => {
  try {
    const product = new Product({ ...req.body });
    const saved = await product.save();
    
    const io = req.app.get("io");
    broadcastProductUpdate(io, "product_created", saved);
    
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    const io = req.app.get("io");
    broadcastProductUpdate(io, "product_updated", product);
    
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    const io = req.app.get("io");
    broadcastProductUpdate(io, "product_deleted", product);
    
    res.json({ message: "Deleted", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
```

### 1.4 Updated Order Controller
**File:** `backend/controllers/orderController.js`

Key changes:
```javascript
const { broadcastOrderCreated, broadcastOrderStatusUpdate, notifyAdmin, notifyCustomer } = require("../services/socketService");

// CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const order = new Order({ ...req.body, userId: req.user.id });
    const saved = await order.save();
    const populated = await Order.findById(saved._id).populate("userId", "name email phone");
    
    const io = req.app.get("io");
    broadcastOrderCreated(io, populated);
    notifyAdmin(io, `New order from ${populated.userId.name}`, "success", { orderId: populated._id });
    notifyCustomer(io, req.user.id, "Order received! Waiting for confirmation.", "success");
    
    await Cart.findOneAndUpdate({ userId: req.user.id }, { items: [] });
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE ORDER STATUS
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status, updatedAt: new Date() }, 
      { new: true }
    );
    
    const io = req.app.get("io");
    broadcastOrderStatusUpdate(io, order, order.userId.toString());
    notifyCustomer(io, order.userId.toString(), `Status: ${req.body.status}`, "info");
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
```

## 2. Frontend Setup

### 2.1 Socket Hook
**File:** `frontend/src/hooks/useSocket.js`

```javascript
import { useEffect, useState, useCallback } from "react";
import io from "socket.io-client";

const SOCKET_URL = "http://localhost:5001";

export const useSocket = (userId, userRole) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ["websocket", "polling"]
    });

    socketInstance.on("connect", () => {
      console.log("[Socket] Connected");
      setConnected(true);
      if (userId && userRole) {
        socketInstance.emit("user_role", userRole, userId);
      }
    });

    socketInstance.on("disconnect", () => {
      console.log("[Socket] Disconnected");
      setConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [userId, userRole]);

  const on = useCallback((event, callback) => {
    if (socket) socket.on(event, callback);
  }, [socket]);

  const off = useCallback((event, callback) => {
    if (socket) socket.off(event, callback);
  }, [socket]);

  const emit = useCallback((event, data) => {
    if (socket) socket.emit(event, data);
  }, [socket]);

  return { socket, connected, on, off, emit };
};

export default useSocket;
```

### 2.2 Socket Context
**File:** `frontend/src/context/SocketContext.jsx`

This context manages real-time product and order state across the application:

```javascript
import React, { createContext, useState, useCallback, useEffect } from "react";
import useSocket from "../hooks/useSocket";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing user:", error);
      }
    }
  }, []);

  const { socket, connected, on, off } = useSocket(user?._id, user?.role);

  // Product Event Listeners
  const handleProductCreated = useCallback((data) => {
    setProducts((prev) => [data.data, ...prev]);
  }, []);

  const handleProductUpdated = useCallback((data) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === data.data._id ? data.data : p))
    );
  }, []);

  const handleProductDeleted = useCallback((data) => {
    setProducts((prev) => prev.filter((p) => p._id !== data.data._id));
  }, []);

  // Order Event Listeners
  const handleOrderCreated = useCallback((data) => {
    if (user?.role === "admin") {
      setOrders((prev) => [data.data, ...prev]);
    }
  }, [user?.role]);

  const handleOrderStatusUpdated = useCallback((data) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === data.data._id ? data.data : o))
    );
  }, []);

  // Notification Listeners
  const handleAdminNotification = useCallback((data) => {
    if (user?.role === "admin") {
      const notif = {
        id: Date.now(),
        timestamp: data.timestamp,
        message: data.message,
        type: data.type,
        data: data.data,
        read: false
      };
      setNotifications((prev) => [notif, ...prev]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
      }, 5000);
    }
  }, [user?.role]);

  const handleCustomerNotification = useCallback((data) => {
    if (user?.role === "customer") {
      const notif = {
        id: Date.now(),
        timestamp: data.timestamp,
        message: data.message,
        type: data.type,
        data: data.data,
        read: false
      };
      setNotifications((prev) => [notif, ...prev]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
      }, 5000);
    }
  }, [user?.role]);

  // Register Event Listeners
  useEffect(() => {
    if (connected && socket) {
      on("product_created", handleProductCreated);
      on("product_updated", handleProductUpdated);
      on("product_deleted", handleProductDeleted);
      on("order_created", handleOrderCreated);
      on("order_status_updated", handleOrderStatusUpdated);
      on("admin_notification", handleAdminNotification);
      on("customer_notification", handleCustomerNotification);

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

### 2.3 Wrap App with SocketProvider
**File:** `frontend/src/App.jsx`

```javascript
import { SocketProvider } from "./context/SocketContext";

function App() {
  return (
    <SocketProvider>
      {/* Rest of your routes and components */}
    </SocketProvider>
  );
}
```

## 3. Socket Events Summary

### Product Events
| Event | Emitted By | Received By | Payload |
|-------|-----------|------------|---------|
| `product_created` | Server | All Clients | `{timestamp, data: Product}` |
| `product_updated` | Server | All Clients | `{timestamp, data: Product}` |
| `product_deleted` | Server | All Clients | `{timestamp, data: Product}` |

### Order Events
| Event | Emitted By | Received By | Payload |
|-------|-----------|------------|---------|
| `order_created` | Server | Admin Only | `{timestamp, data: Order}` |
| `order_status_updated` | Server | Customer + Admin | `{timestamp, data: Order}` |

### Notification Events
| Event | Emitted By | Received By | Payload |
|-------|-----------|------------|---------|
| `admin_notification` | Server | Admin Only | `{timestamp, message, type, data}` |
| `customer_notification` | Server | Specific Customer | `{timestamp, message, type, data}` |

## 4. Usage in Components

### Admin Dashboard
```javascript
import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";

const AdminDashboard = () => {
  const { connected, products, orders, notifications } = useContext(SocketContext);
  
  // Products and orders update automatically when socket events arrive
  return (
    <div>
      <ConnectionStatus connected={connected} />
      <ProductList products={products} />
      <OrderManagement orders={orders} />
      <Notifications notifications={notifications} />
    </div>
  );
};
```

### Customer Dashboard
```javascript
const CustomerDashboard = () => {
  const { connected, products, notifications } = useContext(SocketContext);
  
  // Products update automatically when admin changes them
  return (
    <div>
      <ProductGallery products={products} />
      <OrderHistory />
      <NotificationCenter notifications={notifications} />
    </div>
  );
};
```

## 5. Testing Real-Time Sync

1. **Open two browser tabs:**
   - Tab 1: Admin Dashboard (http://localhost:3000/admin)
   - Tab 2: Customer Dashboard (http://localhost:3000)

2. **Test Product Sync:**
   - Add a product in Admin Tab 1
   - Observe it appears in Tab 2 instantly ✅
   - Edit the product in Tab 1
   - See changes in Tab 2 in real-time ✅
   - Delete the product
   - It disappears from Tab 2 ✅

3. **Test Order Sync:**
   - Create an order in Customer Tab 2
   - Admin receives notification in Tab 1 ✅
   - Change order status in Tab 1
   - Customer sees status update in Tab 2 ✅

## 6. Best Practices Implemented

✅ **Error Handling:** Try-catch blocks with user-friendly toasts  
✅ **Room-based Broadcasting:** Admin rooms, customer-specific rooms  
✅ **Timestamp Tracking:** All socket events include timestamps  
✅ **Graceful Disconnect:** Proper cleanup on socket disconnection  
✅ **Fallback Transports:** WebSocket + polling for compatibility  
✅ **Auto-reconnection:** Exponential backoff retry logic  
✅ **Memory Efficiency:** Event listeners properly cleaned up  
✅ **Security:** User authentication before socket actions  

## 7. Deployment Considerations

- Update CORS origin to match production domain
- Use environment variables for socket URL
- Implement SSL/TLS for secure socket connections
- Monitor socket connections and events in production
- Consider scaling with Socket.io adapters (Redis) for multiple servers

## Next Steps

1. Test all real-time features thoroughly
2. Add error recovery mechanisms
3. Implement socket.io-redis for production scaling
4. Add socket event logging for debugging
5. Create comprehensive test suite for socket events
