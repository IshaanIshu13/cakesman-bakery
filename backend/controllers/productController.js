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

    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single product
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

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).limit(8);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create product (admin only)
exports.createProduct = async (req, res) => {
  try {
    console.log("=== CREATE PRODUCT REQUEST ===");
    console.log("User:", req.user);
    console.log("Request Body:", req.body);
    
    const { name, description, category, subcategory, basePrice, image, flavors, sizes, eggOptions } = req.body;

    // Validate required fields
    if (!name || !category || !subcategory || !basePrice) {
      console.log("Validation failed - Missing fields");
      return res.status(400).json({ 
        message: "Missing required fields: name, category, subcategory, basePrice",
        received: req.body
      });
    }

    console.log("Creating product with:", { name, category, subcategory, basePrice });

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
    console.log("Product saved successfully:", savedProduct);

    // Emit socket event to all connected clients
    const io = req.app.get("io");
    broadcastProductUpdate(io, "product_created", savedProduct);

    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("=== PRODUCT CREATION ERROR ===");
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    res.status(500).json({ message: err.message, error: err.toString() });
  }
};

// Update product (admin only)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Emit socket event to all connected clients
    const io = req.app.get("io");
    broadcastProductUpdate(io, "product_updated", product);

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete product (admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Emit socket event to all connected clients
    const io = req.app.get("io");
    broadcastProductUpdate(io, "product_deleted", product);

    res.json({ message: "Product deleted successfully", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
