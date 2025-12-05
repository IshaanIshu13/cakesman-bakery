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
    origin: "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
  }
});

app.use(cors());
app.use(express.json());

// Store socket instance globally for use in controllers
app.set("io", io);

// Connect to MongoDB
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
