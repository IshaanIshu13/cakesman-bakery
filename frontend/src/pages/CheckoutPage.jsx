import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Truck, Shield, AlertCircle } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'
import { toast } from 'sonner'
import { getAvailableTimeSlots, areTimeSlotAvailable, getNoSlotsMessage, getTodayDateString } from '../utils/timeSlotUtils'
import { calculateCartTotal, formatPrice } from '../utils/priceCalculator'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cartItems, clearCart } = useCart()
  const { isAuthenticated, user } = useAuth()
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

  const [deliveryType, setDeliveryType] = useState('home_delivery') // home_delivery or takeaway
  const [paymentMethod, setPaymentMethod] = useState('cod') // cod or card
  const [agreedTerms, setAgreedTerms] = useState(false)
  const [timeSlot, setTimeSlot] = useState('') // Selected delivery time slot

  // Get available time slots based on delivery type and date
  const availableTimeSlots = useMemo(() => {
    if (!formData.deliveryDate) return []
    return getAvailableTimeSlots(deliveryType, formData.deliveryDate)
  }, [deliveryType, formData.deliveryDate])

  // Check if no slots are available
  const noSlotsAvailable = useMemo(() => {
    if (!formData.deliveryDate) return false
    return !areTimeSlotAvailable(deliveryType, formData.deliveryDate)
  }, [deliveryType, formData.deliveryDate])

  // Message to show when no slots available
  const noSlotsMessage = useMemo(() => {
    if (!formData.deliveryDate || !noSlotsAvailable) return ''
    return getNoSlotsMessage(deliveryType, formData.deliveryDate)
  }, [deliveryType, formData.deliveryDate, noSlotsAvailable])

  // Calculate totals using dynamic pricing calculator (hook must be before early return)
  const { subtotal, tax, total: cartTotalWithTax } = useMemo(() => {
    return calculateCartTotal(cartItems)
  }, [cartItems])

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-cream-50 pt-24 pb-16 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md text-center">
          <h1 className="text-3xl font-bold text-amber-900 mb-4">Login Required</h1>
          <p className="text-gray-600 mb-8">Please log in to your account to place an order</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full px-8 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-full hover:from-pink-600 hover:to-pink-700 transition"
            >
              Go to Login
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full px-8 py-3 border-2 border-pink-500 text-pink-600 font-semibold rounded-full hover:bg-pink-50 transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Redirect if cart is empty (early return after all hooks)
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
    if (!formData.fullName || !formData.phone) {
      toast.error('Please fill all required fields')
      return false
    }

    if (formData.phone.length < 10) {
      toast.error('Please enter a valid phone number')
      return false
    }

    // Only require address for home delivery
    if (deliveryType === 'home_delivery') {
      if (!formData.address || !formData.city || !formData.pincode) {
        toast.error('Please fill all delivery address fields')
        return false
      }
    }

    if (!formData.deliveryDate) {
      toast.error('Please select a delivery date')
      return false
    }

    // Validate time slot selection
    if (!timeSlot) {
      toast.error('Please select a delivery time slot')
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
      // Prepare order items - map cart items correctly with pricing info
      const orderItems = cartItems.map(item => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity || 1,
        price: item.price,  // Unit price
        flavor: item.flavor || '',
        flavorId: item.flavorId || '', // For pricing verification
        category: item.category || '', // For pricing verification
        size: item.size || '',
        eggOption: item.eggOption || ''
      }))

      // Use calculated totals from price calculator
      const orderPayload = {
        items: orderItems,
        subtotal: subtotal,
        tax: tax,
        deliveryFee: deliveryFee,
        totalPrice: total,  // Use dynamically calculated total
        deliveryType: deliveryType,
        timeSlot: timeSlot,
        shippingAddress: deliveryType === 'home_delivery' 
          ? `${formData.address}, ${formData.city}, ${formData.pincode}`
          : 'Store Pickup',
        phone: formData.phone,
        notes: formData.specialInstructions || ''
      }

      console.log("📦 Placing order with payload:", orderPayload)

      // Call backend API
      const response = await api.createOrder(
        orderPayload.items,
        orderPayload.totalPrice,
        orderPayload.shippingAddress,
        orderPayload.phone,
        orderPayload.notes,
        orderPayload.deliveryType,
        orderPayload.timeSlot
      )

      console.log("✅ Order response:", response)

      if (response.success) {
        const orderId = response.data._id

        toast.success('Order placed successfully! 🎉', {
          description: `Order ID: ${orderId.slice(-6).toUpperCase()}`
        })

        // Clear cart
        clearCart()

        // Generate WhatsApp message with order details
        const whatsappMessage = generateWhatsAppMessage(
          orderId,
          formData.fullName,
          formData.phone,
          orderPayload.shippingAddress,
          timeSlot,
          orderItems,
          orderPayload.totalPrice
        )

        // Redirect to WhatsApp after a brief delay
        setTimeout(() => {
          redirectToWhatsApp(formData.phone, whatsappMessage)
          // Then navigate to home
          setTimeout(() => {
            navigate('/')
          }, 500)
        }, 1000)
      } else {
        console.error("❌ Order failed - Response:", response)
        toast.error('Order failed', {
          description: response.message || 'Could not create order'
        })
      }
    } catch (error) {
      console.error("❌ Order creation error:", error)
      console.error("Error details:", {
        status: error?.response?.status,
        message: error?.message,
        data: error?.response?.data
      })
      
      // Check if it's an authentication error
      if (error?.response?.status === 401) {
        toast.error('Authentication required', {
          description: 'Your session has expired. Please log in again.'
        })
        navigate('/login')
      } else {
        toast.error('Failed to place order', {
          description: error?.response?.data?.message || error.message || 'An error occurred while placing your order'
        })
      }
    } finally {
      setIsProcessing(false)
    }
  }

  // Generate WhatsApp message with order details
  const generateWhatsAppMessage = (orderId, customerName, phone, address, timeSlot, items, totalAmount) => {
    const timeSlotLabel = availableTimeSlots.find(slot => slot.value === timeSlot)?.label || timeSlot
    
    let itemsList = items.map(item => 
      `${item.name}${item.flavor ? ` (${item.flavor})` : ''}${item.size ? ` - ${item.size}` : ''} x${item.quantity} = ₹${(item.price * item.quantity).toFixed(0)}`
    ).join('\n')

    const message = `
🎉 *Order Confirmation*

*Order ID:* ${orderId.slice(-6).toUpperCase()}
*Customer Name:* ${customerName}
*Phone:* ${phone}

📍 *Delivery Address:*
${address}

⏰ *Delivery Time Slot:*
${timeSlotLabel}

📦 *Ordered Items:*
${itemsList}

💰 *Total Amount:* ₹${totalAmount.toFixed(0)}

Thank you for ordering with us! ❤️
    `.trim()

    return message
  }

  // Redirect to WhatsApp with pre-filled message
  const redirectToWhatsApp = (phone, message) => {
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message)
    // WhatsApp Web URL - using shop's WhatsApp number
    const whatsappUrl = `https://wa.me/918808140339?text=${encodedMessage}`
    console.log("📱 Redirecting to WhatsApp:", whatsappUrl)
    window.open(whatsappUrl, '_blank')
  }

  const deliveryFee = (deliveryType === 'takeaway' || subtotal > 500) ? 0 : 50
  const total = cartTotalWithTax + deliveryFee

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
            {/* Delivery Type Selection */}
            <div className="bg-white rounded-2xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-3">
                <Truck size={24} />
                Delivery Type
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Takeaway Option */}
                <label
                  onClick={() => setDeliveryType('takeaway')}
                  className={`relative cursor-pointer p-6 rounded-xl border-2 transition-all ${
                    deliveryType === 'takeaway'
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-300 bg-white hover:border-pink-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryType"
                    value="takeaway"
                    checked={deliveryType === 'takeaway'}
                    onChange={() => setDeliveryType('takeaway')}
                    className="absolute opacity-0"
                  />
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        deliveryType === 'takeaway'
                          ? 'border-pink-500 bg-pink-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {deliveryType === 'takeaway' && (
                        <div className="w-3 h-3 bg-white rounded-full" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-amber-900 text-lg">Takeaway From Store</p>
                      <p className="text-sm text-gray-600 mt-1">Pick up your order from our store</p>
                    </div>
                  </div>
                </label>

                {/* Home Delivery Option */}
                <label
                  onClick={() => setDeliveryType('home_delivery')}
                  className={`relative cursor-pointer p-6 rounded-xl border-2 transition-all ${
                    deliveryType === 'home_delivery'
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-300 bg-white hover:border-pink-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryType"
                    value="home_delivery"
                    checked={deliveryType === 'home_delivery'}
                    onChange={() => setDeliveryType('home_delivery')}
                    className="absolute opacity-0"
                  />
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        deliveryType === 'home_delivery'
                          ? 'border-pink-500 bg-pink-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {deliveryType === 'home_delivery' && (
                        <div className="w-3 h-3 bg-white rounded-full" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-amber-900 text-lg">Home Delivery</p>
                      <p className="text-sm text-gray-600 mt-1">We'll deliver to your address</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-2xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-amber-900 mb-6">
                {deliveryType === 'takeaway' ? 'Contact Information' : 'Delivery Information'}
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

              {/* Time Slot Selection */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-amber-900 mb-4 flex items-center gap-2">
                  <Clock size={16} />
                  Delivery Time Slot *
                </label>

                {noSlotsAvailable ? (
                  <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-lg flex items-start gap-3">
                    <AlertCircle size={20} className="text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-orange-900">{noSlotsMessage}</p>
                      <p className="text-sm text-orange-700 mt-2">
                        Please select a different {deliveryType === 'takeaway' ? 'date' : 'date'} or {deliveryType === 'takeaway' ? 'contact us' : 'try home delivery'}.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {availableTimeSlots.map((slot) => (
                      <label
                        key={slot.id}
                        className={`relative cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 ${
                          timeSlot === slot.value
                            ? 'border-pink-500 bg-pink-50 shadow-md'
                            : 'border-gray-300 bg-white hover:border-pink-300'
                        }`}
                      >
                        <input
                          type="radio"
                          value={slot.value}
                          checked={timeSlot === slot.value}
                          onChange={(e) => setTimeSlot(e.target.value)}
                          className="absolute opacity-0 cursor-pointer"
                        />
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              timeSlot === slot.value
                                ? 'border-pink-500 bg-pink-500'
                                : 'border-gray-400'
                            }`}
                          >
                            {timeSlot === slot.value && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <p className="font-semibold text-amber-900">{slot.label}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {/* Info Box - Same Day Rules */}
                {formData.deliveryDate === getTodayDateString() && availableTimeSlots.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 border-2 border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-900">
                      ⏰ <span className="font-semibold">Same-day delivery:</span> Requires minimum 2-hour advance order.
                    </p>
                  </div>
                )}
              </div>

              {/* Address Fields - Only for Home Delivery */}
              {deliveryType === 'home_delivery' && (
                <>
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

                  {/* City & Pincode */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
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
                  </div>
                </>
              )}

              {/* Special Instructions */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-amber-900 mb-2">
                  Special Instructions (Optional)
                </label>
                <textarea
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  placeholder={deliveryType === 'takeaway' ? 'Any special instructions? (e.g., Prefer afternoon pickup)' : 'Any special instructions for delivery? (e.g., Ring bell twice, Call before arrival)'}
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
                  <div key={item.cartId} className="flex justify-between text-sm border-b border-gray-200 pb-4">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.flavor && `${item.flavor} • `}
                        {item.size && `${item.size} • `}
                        {item.eggOption}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-amber-900">{formatPrice(item.price * (item.quantity || 1))}</p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t-2 border-gray-200 pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (GST 18%)</span>
                  <span className="font-medium text-gray-900">{formatPrice(tax)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : 'text-amber-900'}`}>
                    {deliveryFee === 0 ? (deliveryType === 'takeaway' ? 'Store Pickup' : '🎁 FREE') : formatPrice(deliveryFee)}
                  </span>
                </div>

                {/* Total */}
                <div className="bg-gradient-to-r from-pink-50 to-yellow-50 rounded-lg p-4 mt-6">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-amber-900">Total Amount</span>
                    <span className="text-3xl font-bold text-amber-900">{formatPrice(total)}</span>
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
