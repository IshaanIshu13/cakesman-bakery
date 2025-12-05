import React, { useContext, useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { Plus, Minus, Trash2 } from "lucide-react";

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    notes: ""
  });

  useEffect(() => {
    setCart(cartItems);
  }, [cartItems]);

  const handleCheckoutChange = (e) => {
    setCheckoutForm({
      ...checkoutForm,
      [e.target.name]: e.target.value
    });
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0).toFixed(2);
  };

  const handleCheckout = async () => {
    if (!checkoutForm.name || !checkoutForm.phone || !checkoutForm.address) {
      alert("Please fill in all required fields");
      return;
    }
    // TODO: Send order to backend
    alert("Order placed successfully! (Demo mode)");
    clearCart();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">🛒 Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <p className="text-xl text-gray-600 mb-6">Your cart is empty 🍰</p>
            <Link
              to="/products"
              className="inline-block bg-pink-600 text-white px-8 py-3 rounded-full hover:bg-pink-700 transition font-semibold"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                {cart.map((item) => (
                  <div
                    key={item.cartId}
                    className="border-b last:border-b-0 p-6 flex gap-6"
                  >
                    {/* Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-3xl">🎂</span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {item.flavor && <span>{item.flavor} • </span>}
                        {item.size && <span>{item.size}</span>}
                      </p>
                      {item.eggOption && (
                        <p className="text-sm text-gray-600">{item.eggOption}</p>
                      )}
                      <p className="text-lg font-bold text-pink-600 mt-2">
                        ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                      </p>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col items-end justify-between">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                        <button
                          onClick={() => updateQuantity(item.cartId, Math.max(1, (item.quantity || 1) - 1))}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full transition"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity || 1}</span>
                        <button
                          onClick={() => updateQuantity(item.cartId, (item.quantity || 1) + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full transition"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.cartId)}
                        className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 mt-2"
                      >
                        <Trash2 size={18} />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <div className="mt-6">
                <Link
                  to="/products"
                  className="text-pink-600 hover:text-pink-700 font-semibold flex items-center gap-2"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Summary & Checkout */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{getCartTotal()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-pink-600">₹{getCartTotal()}</span>
                  </div>
                </div>

                {!showCheckout ? (
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="w-full py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition"
                  >
                    Proceed to Checkout
                  </button>
                ) : (
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name *"
                      value={checkoutForm.name}
                      onChange={handleCheckoutChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number *"
                      value={checkoutForm.phone}
                      onChange={handleCheckoutChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                    />
                    <textarea
                      name="address"
                      placeholder="Delivery Address *"
                      value={checkoutForm.address}
                      onChange={handleCheckoutChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                    />
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={checkoutForm.city}
                      onChange={handleCheckoutChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                    />
                    <textarea
                      name="notes"
                      placeholder="Special Notes (optional)"
                      value={checkoutForm.notes}
                      onChange={handleCheckoutChange}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                    />
                    <button
                      onClick={handleCheckout}
                      className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                    >
                      Place Order
                    </button>
                    <button
                      onClick={() => setShowCheckout(false)}
                      className="w-full py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                    >
                      Back
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;