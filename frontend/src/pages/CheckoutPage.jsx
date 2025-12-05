import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Truck, Shield } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { toast } from 'sonner'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cartItems, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    deliveryDate: '',
    specialInstructions: ''
  })

  const [paymentMethod, setPaymentMethod] = useState('cod') // cod or card
  const [agreedTerms, setAgreedTerms] = useState(false)

  // Redirect if cart is empty
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-cream-50 pt-24 pb-16 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md text-center">
          <h1 className="text-3xl font-bold text-amber-900 mb-4">Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some delicious cakes to your cart before checkout</p>
          <button
            onClick={() => navigate('/category/birthday-cakes')}
            className="w-full px-8 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-full hover:from-pink-600 hover:to-pink-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
      toast.error('Please fill all required fields')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return false
    }

    if (formData.phone.length < 10) {
      toast.error('Please enter a valid phone number')
      return false
    }

    if (!formData.deliveryDate) {
      toast.error('Please select a delivery date')
      return false
    }

    if (!agreedTerms) {
      toast.error('Please agree to terms and conditions')
      return false
    }

    return true
  }

  const handlePlaceOrder = async () => {
    if (!validateForm()) return

    setIsProcessing(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast.success('Order placed successfully! 🎉', {
        description: `Order ID: #ORD${Date.now().toString().slice(-6)}`
      })

      // Clear cart and redirect
      clearCart()
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (error) {
      toast.error('Failed to place order', {
        description: error.message
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0)
  const deliveryFee = subtotal > 500 ? 0 : 50
  const discount = 0
  const total = subtotal + deliveryFee - discount

  // Get tomorrow's date for minimum delivery date
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  // Get max date (30 days from now)
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 30)
  const maxDateStr = maxDate.toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-cream-50 pt-24 pb-16">
      {/* Header */}
      <div className="bg-white border-b border-pink-100 shadow-sm sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-pink-600 hover:text-pink-700 transition"
            >
              <ArrowLeft size={20} />
              Back
            </button>
            <h1 className="text-3xl font-bold text-amber-900">Checkout</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Delivery & Payment Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Information */}
            <div className="bg-white rounded-2xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-3">
                <Truck size={24} />
                Delivery Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-amber-900 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-400 focus:outline-none transition"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-amber-900 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-400 focus:outline-none transition"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-amber-900 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-400 focus:outline-none transition"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-semibold text-amber-900 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Mumbai"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-400 focus:outline-none transition"
                  />
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-sm font-semibold text-amber-900 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="400001"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-400 focus:outline-none transition"
                  />
                </div>

                {/* Delivery Date */}
                <div>
                  <label className="block text-sm font-semibold text-amber-900 mb-2 flex items-center gap-2">
                    <Clock size={16} />
                    Preferred Delivery Date *
                  </label>
                  <input
                    type="date"
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleInputChange}
                    min={minDate}
                    max={maxDateStr}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-400 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-amber-900 mb-2">
                  Delivery Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your complete delivery address"
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-400 focus:outline-none transition"
                />
              </div>

              {/* Special Instructions */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-amber-900 mb-2">
                  Special Instructions (Optional)
                </label>
                <textarea
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  placeholder="Any special instructions for delivery? (e.g., Ring bell twice, Call before arrival)"
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-400 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-3">
                <Shield size={24} />
                Payment Method
              </h2>

              <div className="space-y-4">
                {/* Cash on Delivery */}
                <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-pink-400 transition"
                  style={{ borderColor: paymentMethod === 'cod' ? '#EC4899' : '' }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-pink-600"
                  />
                  <div className="ml-4 flex-1">
                    <p className="font-semibold text-amber-900">Cash on Delivery</p>
                    <p className="text-sm text-gray-600">Pay when your order arrives</p>
                  </div>
                </label>

                {/* Card Payment (Disabled for demo) */}
                <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer opacity-50"
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    disabled
                    className="w-4 h-4 text-gray-400"
                  />
                  <div className="ml-4 flex-1">
                    <p className="font-semibold text-gray-400">Card / UPI Payment</p>
                    <p className="text-sm text-gray-400">Coming soon</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="bg-pink-50 rounded-2xl border-2 border-pink-200 p-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 text-pink-600 rounded"
                />
                <div>
                  <p className="text-sm text-gray-700">
                    I agree to the <span className="font-semibold text-pink-600">Terms & Conditions</span> and <span className="font-semibold text-pink-600">Privacy Policy</span>
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-8 sticky top-32">
              <h2 className="text-2xl font-bold text-amber-900 mb-6">Order Summary</h2>

              {/* Order Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm border-b border-gray-200 pb-4">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.flavor} • {item.size} • {item.eggOption}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-amber-900">₹{item.price}</p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t-2 border-gray-200 pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">₹{subtotal}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : 'text-amber-900'}`}>
                    {deliveryFee === 0 ? '🎁 FREE' : `₹${deliveryFee}`}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium text-green-600">-₹{discount}</span>
                  </div>
                )}

                {/* Total */}
                <div className="bg-gradient-to-r from-pink-50 to-yellow-50 rounded-lg p-4 mt-6">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-amber-900">Total Amount</span>
                    <span className="text-3xl font-bold text-amber-900">₹{total}</span>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="mt-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
                <p className="text-xs text-amber-900">
                  ✨ <span className="font-semibold">Free delivery</span> on orders above ₹500
                </p>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing || !agreedTerms}
                className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold rounded-full hover:from-pink-600 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </button>

              {/* Back to Cart */}
              <button
                onClick={() => navigate(-1)}
                className="w-full mt-3 px-8 py-3 border-2 border-pink-300 text-pink-600 font-semibold rounded-full hover:bg-pink-50 transition"
              >
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
