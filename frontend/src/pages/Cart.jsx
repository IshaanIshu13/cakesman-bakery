import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { 
  Plus, Minus, Trash2, AlertCircle, 
  ShoppingBag, Truck, Store, Calendar, 
  Clock, ArrowRight, CheckCircle2 
} from "lucide-react";
import { toast } from "sonner";

// Constants for business logic
const DELIVERY_FEE = 49; // Flat fee
const FREE_DELIVERY_THRESHOLD = 999; // Free delivery over ₹999
const TAX_RATE = 0.05; // 5% GST

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // State for Checkout Process
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [orderType, setOrderType] = useState("delivery"); // 'delivery' or 'pickup'
  const [tipAmount, setTipAmount] = useState(0);
  
  // Form State
  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    date: "",
    timeSlot: "",
    notes: ""
  });

  const [errors, setErrors] = useState({});

  // --- Calculations ---
  
  const subtotal = cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  const tax = subtotal * TAX_RATE;
  const deliveryCost = orderType === 'pickup' ? 0 : (subtotal > FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE);
  const total = subtotal + tax + deliveryCost + tipAmount;

  // --- Handlers ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCheckoutForm(prev => ({ ...prev, [name]: value }));
    // Clear specific error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const phoneRegex = /^[0-9]{10}$/;

    if (!checkoutForm.name.trim()) newErrors.name = "Name is required";
    if (!checkoutForm.phone.trim() || !phoneRegex.test(checkoutForm.phone)) newErrors.phone = "Valid 10-digit phone required";
    if (!checkoutForm.date) newErrors.date = "Select a date";
    if (!checkoutForm.timeSlot) newErrors.timeSlot = "Select a time slot";

    if (orderType === 'delivery') {
      if (!checkoutForm.address.trim()) newErrors.address = "Address is required";
      if (!checkoutForm.city.trim()) newErrors.city = "City is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setCheckoutLoading(true);

    try {
      // Simulate API Payload Construction
      const orderPayload = {
        customer: {
          name: checkoutForm.name,
          phone: checkoutForm.phone,
          address: orderType === 'delivery' ? `${checkoutForm.address}, ${checkoutForm.city}` : 'Store Pickup',
        },
        orderType,
        scheduling: {
          date: checkoutForm.date,
          time: checkoutForm.timeSlot
        },
        items: cartItems.map(item => ({ 
          id: item.id, 
          name: item.name, 
          qty: item.quantity, 
          flavor: item.flavor || 'Standard' 
        })),
        financials: {
          subtotal,
          tax,
          deliveryCost,
          tip: tipAmount,
          total
        },
        notes: checkoutForm.notes,
        status: "pending"
      };

      // console.log("Processing Order:", orderPayload); // For debugging
      
      // Simulate Network Request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(
        <div className="flex flex-col gap-1">
          <span className="font-bold">Order Placed Successfully!</span>
          <span className="text-sm">We'll start baking shortly. 👨‍🍳</span>
        </div>
      );
      
      clearCart();
      navigate("/order-success"); // Assuming you have this page, or redirect to home

    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  // --- Render Helpers ---

  // Get tomorrow's date for min date attribute
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-amber-50 px-4 mt-16">
        <div className="text-center max-w-md">
          <div className="bg-white p-8 rounded-full shadow-lg inline-flex mb-6">
            <ShoppingBag size={64} className="text-pink-300" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't made your choice yet. Our fresh pastries are waiting!</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-pink-600 text-white px-8 py-3 rounded-full hover:bg-pink-700 transition shadow-lg hover:shadow-pink-200"
          >
            Start Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 py-12 px-4 md:px-6 mt-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 font-serif">
          Complete your Order
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Cart Items & Form */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            
            {/* 1. Cart Items List */}
            <div className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-orange-50/50 flex justify-between items-center">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                  <ShoppingBag size={20} className="text-pink-500"/> Your Items ({cartItems.length})
                </h2>
                <button onClick={clearCart} className="text-xs text-red-500 hover:text-red-700 font-medium hover:underline">
                  Clear Cart
                </button>
              </div>
              
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item.cartId} className="p-4 sm:p-6 flex gap-4 sm:gap-6 transition hover:bg-gray-50">
                    {/* Product Image */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-pink-100 text-2xl">🍰</div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                          <span className="font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.size || "Standard"} • {item.flavor || "Original"} {item.eggOption ? `• ${item.eggOption}` : ""}
                        </p>
                      </div>

                      <div className="flex justify-between items-end mt-4">
                        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                          <button 
                            onClick={() => updateQuantity(item.cartId, Math.max(1, (item.quantity || 1) - 1))}
                            className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-md transition text-gray-600"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-semibold min-w-[1.5rem] text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.cartId, (item.quantity || 1) + 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-md transition text-gray-600"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(item.cartId)}
                          className="text-gray-400 hover:text-red-500 transition p-2"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Delivery Options & Details Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Details</h2>
              
              {/* Toggle Switch */}
              <div className="flex p-1 bg-gray-100 rounded-xl mb-8 w-full max-w-md">
                <button
                  onClick={() => setOrderType('delivery')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    orderType === 'delivery' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Truck size={18} /> Home Delivery
                </button>
                <button
                  onClick={() => setOrderType('pickup')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    orderType === 'pickup' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Store size={18} /> Store Pickup
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Info */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Contact Info</h3>
                    <div>
                      <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={checkoutForm.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={checkoutForm.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Date & Time (Crucial for Bakery) */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Scheduling</h3>
                    <div className="relative">
                      <Calendar size={18} className="absolute left-4 top-3.5 text-gray-400" />
                      <input
                        type="date"
                        name="date"
                        min={getMinDate()}
                        value={checkoutForm.date}
                        onChange={handleInputChange}
                        className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition ${errors.date ? 'border-red-500' : 'border-gray-200'}`}
                      />
                    </div>
                    {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}

                    <div className="relative">
                      <Clock size={18} className="absolute left-4 top-3.5 text-gray-400" />
                      <select
                        name="timeSlot"
                        value={checkoutForm.timeSlot}
                        onChange={handleInputChange}
                        className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none appearance-none transition ${errors.timeSlot ? 'border-red-500' : 'border-gray-200'}`}
                      >
                        <option value="">Select Time Slot</option>
                        <option value="10:00 - 12:00">10:00 AM - 12:00 PM</option>
                        <option value="12:00 - 14:00">12:00 PM - 02:00 PM</option>
                        <option value="14:00 - 16:00">02:00 PM - 04:00 PM</option>
                        <option value="16:00 - 18:00">04:00 PM - 06:00 PM</option>
                        <option value="18:00 - 20:00">06:00 PM - 08:00 PM</option>
                      </select>
                    </div>
                    {errors.timeSlot && <p className="text-red-500 text-xs mt-1">{errors.timeSlot}</p>}
                  </div>
                </div>

                {/* Delivery Address (Conditional) */}
                {orderType === 'delivery' && (
                  <div className="space-y-4 pt-4 border-t border-dashed border-gray-200">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Delivery Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <textarea
                          name="address"
                          placeholder="Street Address, Landmark, etc."
                          rows="2"
                          value={checkoutForm.address}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition ${errors.address ? 'border-red-500' : 'border-gray-200'}`}
                        />
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                      </div>
                      <div>
                        <input
                          type="text"
                          name="city"
                          placeholder="City"
                          value={checkoutForm.city}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition ${errors.city ? 'border-red-500' : 'border-gray-200'}`}
                        />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <textarea
                    name="notes"
                    placeholder="Message on cake, allergies, or special instructions..."
                    rows="2"
                    value={checkoutForm.notes}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Summary & Payment */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-24 space-y-6">
              
              {/* Bill Summary */}
              <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>GST (5%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    {deliveryCost === 0 ? (
                      <span className="text-green-600 font-medium">Free</span>
                    ) : (
                      <span>₹{deliveryCost.toFixed(2)}</span>
                    )}
                  </div>
                  
                  {/* Tip Selection */}
                  <div className="pt-3">
                    <span className="text-gray-600 block mb-2">Add a Tip (Optional)</span>
                    <div className="flex gap-2">
                      {[0, 20, 50, 100].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => setTipAmount(amt)}
                          className={`flex-1 py-1 text-xs rounded-full border transition ${
                            tipAmount === amt 
                              ? 'bg-pink-100 border-pink-500 text-pink-700 font-bold' 
                              : 'border-gray-200 hover:border-pink-300'
                          }`}
                        >
                          {amt === 0 ? 'None' : `₹${amt}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-dashed border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between items-end">
                      <span className="text-gray-900 font-bold text-lg">Total Amount</span>
                      <span className="text-2xl font-bold text-pink-600">₹{total.toFixed(2)}</span>
                    </div>
                    {orderType === 'delivery' && subtotal < FREE_DELIVERY_THRESHOLD && (
                      <p className="text-xs text-orange-600 mt-2 bg-orange-50 p-2 rounded">
                        Add ₹{(FREE_DELIVERY_THRESHOLD - subtotal).toFixed(0)} more for free delivery!
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="w-full mt-6 py-4 bg-pink-600 text-white font-bold rounded-xl shadow-lg shadow-pink-200 hover:bg-pink-700 hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {checkoutLoading ? (
                    <span className="animate-pulse">Processing...</span>
                  ) : (
                    <>
                      Confirm Order <CheckCircle2 size={20} />
                    </>
                  )}
                </button>
                
                <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-1">
                  <AlertCircle size={12} /> Secure Checkout
                </p>
              </div>

              {/* Trust Badges */}
              <div className="bg-orange-50 rounded-xl p-4 flex items-center justify-between text-orange-800 text-xs font-medium">
                <span className="flex flex-col items-center gap-1"><span className="text-lg">🥚</span> 100% Eggless Options</span>
                <span className="flex flex-col items-center gap-1"><span className="text-lg">🕒</span> Freshly Baked</span>
                <span className="flex flex-col items-center gap-1"><span className="text-lg">🧼</span> Hygienic Kitchen</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Cart;