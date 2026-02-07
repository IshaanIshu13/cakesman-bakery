const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Get cart
exports.getCart = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated", success: false });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
      await cart.save();
    }
    res.json({ success: true, data: cart });
  } catch (err) {
    console.error("❌ Get cart error:", err);
    res.status(500).json({ 
      message: "Failed to fetch cart",
      error: err.message,
      success: false 
    });
  }
};

// Add to cart
exports.addToCart = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated", success: false });
    }

    const { productId, quantity, flavor, size, eggOption, price } = req.body;

    // Validate required fields
    if (!productId || !quantity || !price) {
      return res.status(400).json({ 
        message: "productId, quantity, and price are required",
        success: false 
      });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        message: "Product not found",
        success: false 
      });
    }

    // Check if item already in cart
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId && item.flavor === flavor && item.size === size && item.eggOption === eggOption
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        name: product.name,
        quantity,
        price,
        image: product.image,
        flavor,
        size,
        eggOption
      });
    }

    await cart.save();
    res.json({ success: true, message: "Item added to cart", data: cart });
  } catch (err) {
    console.error("❌ Add to cart error:", err);
    res.status(500).json({ 
      message: "Failed to add item to cart",
      error: err.message,
      success: false 
    });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated", success: false });
    }

    const { itemIndex, quantity } = req.body;

    if (itemIndex === undefined || quantity === undefined) {
      return res.status(400).json({ 
        message: "itemIndex and quantity are required",
        success: false 
      });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ 
        message: "Cart not found",
        success: false 
      });
    }

    if (itemIndex < 0 || itemIndex >= cart.items.length) {
      return res.status(400).json({ 
        message: "Invalid item index",
        success: false 
      });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    res.json({ success: true, message: "Cart updated successfully", data: cart });
  } catch (err) {
    console.error("❌ Update cart error:", err);
    res.status(500).json({ 
      message: "Failed to update cart",
      error: err.message,
      success: false 
    });
  }
};

// Remove from cart
exports.removeFromCart = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated", success: false });
    }

    const { itemIndex } = req.body;

    if (itemIndex === undefined) {
      return res.status(400).json({ 
        message: "itemIndex is required",
        success: false 
      });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ 
        message: "Cart not found",
        success: false 
      });
    }

    if (itemIndex < 0 || itemIndex >= cart.items.length) {
      return res.status(400).json({ 
        message: "Invalid item index",
        success: false 
      });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();
    res.json({ success: true, message: "Item removed from cart", data: cart });
  } catch (err) {
    console.error("❌ Remove from cart error:", err);
    res.status(500).json({ 
      message: "Failed to remove item from cart",
      error: err.message,
      success: false 
    });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated", success: false });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }
    cart.items = [];
    await cart.save();
    res.json({ success: true, message: "Cart cleared successfully", data: cart });
  } catch (err) {
    console.error("❌ Clear cart error:", err);
    res.status(500).json({ 
      message: "Failed to clear cart",
      error: err.message,
      success: false 
    });
  }
};
