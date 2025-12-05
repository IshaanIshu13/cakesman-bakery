const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      flavor: { type: String, default: "" },
      size: { type: String, default: "" },
      eggOption: { type: String, default: "" },
      subtotal: { type: Number, required: true }
    }
  ],
  totalPrice: { type: Number, required: true },
  shippingAddress: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, enum: ["pending", "accepted", "baking", "out_for_delivery", "completed", "cancelled"], default: "pending" },
  paymentMethod: { type: String, default: "cash_on_delivery" },
  notes: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
