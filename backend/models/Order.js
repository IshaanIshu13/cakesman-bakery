const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: String, default: "" },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      flavor: { type: String, default: "" },
      flavorId: { type: String, default: "" },
      category: { type: String, default: "" },
      size: { type: String, default: "" },
      eggOption: { type: String, default: "" },
      subtotal: { 
        type: Number,
        default: function() {
          return this.price * this.quantity;
        }
      }
    }
  ],
  totalPrice: { type: Number, required: true },
  deliveryType: { type: String, enum: ["home_delivery", "takeaway"], default: "home_delivery" },
  timeSlot: { type: String, enum: ["10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00", "18:00-20:00", "20:00-22:00"], default: "10:00-12:00" },
  shippingAddress: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, enum: ["pending", "accepted", "baking", "out_for_delivery", "completed", "cancelled"], default: "pending" },
  paymentMethod: { type: String, default: "cash_on_delivery" },
  notes: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
