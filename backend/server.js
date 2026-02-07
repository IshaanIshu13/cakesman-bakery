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
const customerRoutes = require("./routes/customerRoutes");

const app = express();
const server = http.createServer(app);

// Socket.io configuration
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
  }
});

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", process.env.FRONTEND_URL].filter(Boolean),
  credentials: true
}));
app.use(express.json());

// Request logging middleware for debugging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const path = req.path;
  const hasAuth = !!req.headers.authorization;
  
  console.log(`[${timestamp}] 📨 ${method} ${path}${hasAuth ? ' [Auth]' : ''}`);
  
  // Log response when sent
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`[${timestamp}] ✓ ${method} ${path} → ${res.statusCode}`);
    originalSend.call(this, data);
  };
  
  next();
});

// Store socket instance globally for use in controllers
app.set("io", io);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    console.warn("⚠️  Continuing without database. Some features may not work.");
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customers", customerRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ message: "Backend is running" });
});

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Join user to a room based on their role (admin or customer)
  socket.on("user_role", (role, userId) => {
    socket.join(role); // Join 'admin' or 'customer' room
    socket.join(`user_${userId}`); // Join personal room
    console.log(`User ${userId} (${role}) joined room`);
  });

  // Listen for admin disconnect
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Backend started on http://localhost:${PORT}`));
