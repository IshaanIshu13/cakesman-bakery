import React from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { toast } from 'sonner'

export default function CartDrawer({ isOpen, onClose }) {
  const navigate = useNavigate()
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart()

  const handleCheckout = () => {
    onClose()
    navigate('/checkout')
  }

  const deliveryFee = cartTotal > 500 ? 0 : 50
  const finalTotal = cartTotal + deliveryFee

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 z-50 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="border-b border-gray-200 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-amber-900">Shopping Cart</h2>
            <p className="text-sm text-gray-600">{cartItems.length} items</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} className="text-gray-900" />
          </button>
        </div>

        {/* Items List */}
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <ShoppingBag size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-600 text-center mb-6">Your cart is empty</p>
            <button
              onClick={() => {
                onClose()
                navigate('/category/birthday-cakes')
              }}
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-full hover:from-pink-600 hover:to-pink-700 transition"
            >
              Browse Cakes
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-gray-200 pb-4">
                  <div className="w-16 h-16 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">{item.emoji || ''}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-amber-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-600">
                      {item.flavor && `${item.flavor} • `}
                      {item.size && `${item.size} • `}
                      {item.eggOption}
                    </p>
                    <p className="text-sm font-semibold text-pink-600 mt-1">₹{item.price}</p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 hover:bg-gray-100 text-sm"
                      >
                        −
                      </button>
                      <span className="px-2 text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 hover:bg-gray-100 text-sm"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        removeFromCart(item.id)
                        toast.success('Item removed from cart')
                      }}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-6 space-y-4 bg-gray-50">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold text-amber-900">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee:</span>
                  <span className="font-semibold text-amber-900">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
                {cartTotal <= 500 && deliveryFee > 0 && (
                  <p className="text-xs text-gray-500 pt-2 border-t border-gray-300">
                    Free delivery on orders above ₹500
                  </p>
                )}
              </div>

              <div className="bg-gradient-to-r from-pink-50 to-amber-50 border border-pink-200 rounded-lg p-3">
                <p className="flex justify-between items-center">
                  <span className="font-semibold text-amber-900">Total:</span>
                  <span className="text-xl font-bold text-pink-600">₹{finalTotal}</span>
                </p>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-full hover:from-pink-600 hover:to-pink-700 transition"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={onClose}
                className="w-full px-6 py-3 border-2 border-pink-300 text-pink-600 font-semibold rounded-full hover:bg-pink-50 transition"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}