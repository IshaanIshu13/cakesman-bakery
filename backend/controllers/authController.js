const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: "Name, email, and password are required",
        success: false 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: "Email already registered",
        success: false 
      });
    }

    // Create new user
    const user = new User({ name, email, password, phone });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
    });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ 
      message: "Registration failed",
      error: err.message,
      success: false 
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required",
        success: false 
      });
    }

    // Demo credentials for testing (when database is unavailable)
    if (email === 'demo@test.com' && password === 'demo123') {
      const token = jwt.sign(
        { id: 'demo-user', email: email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      return res.status(200).json({
        success: true,
        message: "Demo login successful",
        token,
        user: { _id: 'demo-user', name: 'Demo User', email: email, isAdmin: false }
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        message: "Invalid email or password",
        success: false 
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: "Invalid email or password",
        success: false 
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ 
      message: "Server error during login",
      error: err.message,
      success: false 
    });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ 
        message: "User not found",
        success: false 
      });
    }
    // Standardize response with _id field
    res.json({ 
      success: true, 
      data: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
    });
  } catch (err) {
    console.error("❌ Get user error:", err);
    res.status(500).json({ 
      message: "Failed to fetch user",
      error: err.message,
      success: false 
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { name, phone, address, city } = req.body;
    
    // Validate that user exists
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        message: "User not authenticated",
        success: false 
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, address, city },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ 
        message: "User not found",
        success: false 
      });
    }

    res.json({ success: true, message: "User updated successfully", user });
  } catch (err) {
    console.error("❌ Update user error:", err);
    res.status(500).json({ 
      message: "Failed to update user",
      error: err.message,
      success: false 
    });
  }
};
