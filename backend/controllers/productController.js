const Product = require("../models/Product");
const { broadcastProductUpdate } = require("../services/socketService");

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const { category, subcategory, search } = req.query;
    let query = {};

    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (search) query.name = { $regex: search, $options: "i" };

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: products, count: products.length });
  } catch (err) {
    console.error("❌ Get products error:", err);
    res.status(500).json({ 
      message: "Failed to fetch products",
      error: err.message,
      success: false 
    });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ 
        message: "Product not found",
        success: false 
      });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    console.error("❌ Get product error:", err);
    res.status(500).json({ 
      message: "Failed to fetch product",
      error: err.message,
      success: false 
    });
  }
};

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).limit(8);
    res.json({ success: true, data: products, count: products.length });
  } catch (err) {
    console.error("❌ Get featured products error:", err);
    res.status(500).json({ 
      message: "Failed to fetch featured products",
      error: err.message,
      success: false 
    });
  }
};

// Create product (admin only)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, category, subcategory, basePrice, image, flavors, sizes } = req.body;

    // Validate required fields
    if (!name || !category || !subcategory || basePrice === undefined) {
      return res.status(400).json({ 
        message: "Missing required fields: name, category, subcategory, basePrice",
        success: false,
        received: req.body
      });
    }

    // Validate data types
    if (typeof basePrice !== 'number' || basePrice < 0) {
      return res.status(400).json({ 
        message: "basePrice must be a non-negative number",
        success: false 
      });
    }

    // Create product - all products are eggless
    const product = new Product({
      name,
      description,
      category,
      subcategory,
      basePrice,
      price: basePrice, // Set price = basePrice
      image,
      flavors,
      sizes,
      isEggless: true // All products are eggless
    });

    const savedProduct = await product.save();

    // Emit socket event to all connected clients
    const io = req.app.get("io");
    if (io) {
      const { broadcastProductUpdate } = require("../services/socketService");
      broadcastProductUpdate(io, "product_created", savedProduct);
    }

    res.status(201).json({ success: true, message: "Product created successfully", data: savedProduct });
  } catch (err) {
    console.error("❌ Product creation error:", err);
    res.status(500).json({ 
      message: "Failed to create product",
      error: err.message,
      success: false 
    });
  }
};

// Update product (admin only)
exports.updateProduct = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Product ID is required", success: false });
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) {
      return res.status(404).json({ 
        message: "Product not found",
        success: false 
      });
    }

    // Emit socket event to all connected clients
    const io = req.app.get("io");
    if (io) {
      const { broadcastProductUpdate } = require("../services/socketService");
      broadcastProductUpdate(io, "product_updated", product);
    }

    res.json({ success: true, message: "Product updated successfully", data: product });
  } catch (err) {
    console.error("❌ Product update error:", err);
    res.status(500).json({ 
      message: "Failed to update product",
      error: err.message,
      success: false 
    });
  }
};

// Delete product (admin only)
exports.deleteProduct = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Product ID is required", success: false });
    }

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ 
        message: "Product not found",
        success: false 
      });
    }

    // Emit socket event to all connected clients
    const io = req.app.get("io");
    if (io) {
      const { broadcastProductUpdate } = require("../services/socketService");
      broadcastProductUpdate(io, "product_deleted", product);
    }

    res.json({ success: true, message: "Product deleted successfully", data: product });
  } catch (err) {
    console.error("❌ Product delete error:", err);
    res.status(500).json({ 
      message: "Failed to delete product",
      error: err.message,
      success: false 
    });
  }
};
