const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  basePrice: { type: Number, required: true },
  // Alias for basePrice - ensures compatibility with frontend
  price: { type: Number, default: null },
  image: { type: String, default: "" },
  images: [{ type: String }],
  flavors: [{ name: String, priceMultiplier: Number }],
  sizes: [{ name: String, servings: String, priceMultiplier: Number }],
  // All products are eggless - no eggOptions field needed
  isEggless: { type: Boolean, default: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviews: [{ user: String, rating: Number, comment: String, date: Date }],
  available: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  stock: { type: Number, default: 100 },
  // Derived field: true if stock > 0
  inStock: { type: Boolean, default: true }
}, { timestamps: true });

// Virtual getter: ensure price defaults to basePrice if not set
productSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    // Ensure price is always set
    if (!ret.price || ret.price === null) {
      ret.price = ret.basePrice;
    }
    // Ensure inStock reflects stock > 0
    ret.inStock = ret.stock > 0;
    // Always ensure isEggless is true
    ret.isEggless = true;
    return ret;
  }
});

module.exports = mongoose.model("Product", productSchema);
