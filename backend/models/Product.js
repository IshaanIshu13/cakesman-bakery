const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  basePrice: { type: Number, required: true },
  image: { type: String, default: "" },
  images: [{ type: String }],
  flavors: [{ name: String, priceMultiplier: Number }],
  sizes: [{ name: String, servings: String, priceMultiplier: Number }],
  eggOptions: [{ name: String, priceMultiplier: Number }],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviews: [{ user: String, rating: Number, comment: String, date: Date }],
  available: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  stock: { type: Number, default: 100 }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
