import React, { useState, useEffect } from 'react'
import { X, Plus, Minus } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { toast } from 'sonner'

// Define available add-ons
const ADD_ONS_DATA = [
  {
    id: 'candles',
    name: 'Candles',
    label: 'Decoration',
    emoji: '🕯️',
    price: 50,
    description: 'Beautiful decorative candles'
  },
  {
    id: 'birthday-caps',
    name: 'Birthday Caps',
    label: 'Party Essentials',
    emoji: '🎉',
    price: 100,
    description: 'Set of colorful birthday caps'
  },
  {
    id: 'patties',
    name: 'Patties',
    label: 'Snacks',
    emoji: '🥧',
    price: 150,
    description: 'Delicious pastry patties (6 pcs)'
  },
  {
    id: 'pastry',
    name: 'Pastry',
    label: 'Desserts',
    emoji: '🥐',
    price: 120,
    description: 'Fresh pastry selection (4 pcs)'
  },
  {
    id: 'cupcakes',
    name: 'Cupcakes',
    label: 'Mini Treats',
    emoji: '🧁',
    price: 80,
    description: 'Assorted cupcakes (6 pcs)'
  },
  {
    id: 'no-addon',
    name: 'No Add-ons',
    label: 'Skip',
    emoji: '✓',
    price: 0,
    description: 'Continue without add-ons',
    isSkip: true
  }
]

export default function AddOnsModal({ isOpen, onClose, onConfirm }) {
  const { addToCart } = useCart()
  const [selectedAddOns, setSelectedAddOns] = useState({})
  const [showQuantityModal, setShowQuantityModal] = useState(null)
  const [tempQuantity, setTempQuantity] = useState(1)

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  const handleAddOnClick = (addOn) => {
    if (addOn.isSkip) {
      // No Add-ons selected
      setSelectedAddOns({})
      handleConfirm()
      return
    }

    // Show quantity modal for other add-ons
    setShowQuantityModal(addOn)
    setTempQuantity(selectedAddOns[addOn.id]?.quantity || 1)
  }

  const handleQuantityConfirm = () => {
    if (showQuantityModal) {
      setSelectedAddOns(prev => ({
        ...prev,
        [showQuantityModal.id]: {
          ...showQuantityModal,
          quantity: tempQuantity
        }
      }))
      setShowQuantityModal(null)
      toast.success(`${showQuantityModal.name} added (Qty: ${tempQuantity})`)
    }
  }

  const handleRemoveAddOn = (addOnId) => {
    setSelectedAddOns(prev => {
      const updated = { ...prev }
      delete updated[addOnId]
      return updated
    })
  }

  const handleConfirm = () => {
    // Add selected add-ons to cart
    Object.values(selectedAddOns).forEach(addOn => {
      const cartItem = {
        // Generate unique cartId for each add-on instance
        cartId: `addon_${addOn.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        productId: addOn.id,
        name: addOn.name,
        price: addOn.price,
        // Ensure quantity is always set (default 1)
        quantity: addOn.quantity || 1,
        isAddOn: true,
        emoji: addOn.emoji
      }
      addToCart(cartItem)
    })

    if (Object.keys(selectedAddOns).length > 0) {
      toast.success('Add-ons added to cart! 🎉')
    }

    handleClose()
    onConfirm()
  }

  const handleClose = () => {
    setSelectedAddOns({})
    setShowQuantityModal(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 animate-in fade-in scale-95"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-pink-50 to-amber-50 border-b border-pink-200 p-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-amber-900">Special Add-ons</h2>
              <p className="text-sm text-gray-600 mt-1">Enhance your celebration with extras</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white rounded-full transition"
            >
              <X size={28} className="text-gray-900" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Add-ons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {ADD_ONS_DATA.map((addOn) => {
                const isSelected = selectedAddOns[addOn.id]
                const quantity = isSelected?.quantity || 0

                return (
                  <button
                    key={addOn.id}
                    onClick={() => !addOn.isSkip && handleAddOnClick(addOn)}
                    className={`relative p-6 rounded-2xl border-2 transition-all duration-200 transform hover:scale-105 ${
                      isSelected && !addOn.isSkip
                        ? 'border-pink-500 bg-pink-50 shadow-lg'
                        : addOn.isSkip
                        ? 'border-gray-300 bg-gray-50 hover:border-gray-400'
                        : 'border-gray-200 bg-white hover:border-pink-300'
                    }`}
                  >
                    {/* Checkmark for selected */}
                    {isSelected && !addOn.isSkip && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                    )}

                    {/* Content */}
                    <div className="text-center">
                      <div className="text-5xl mb-3">{addOn.emoji}</div>
                      <h3 className={`text-lg font-bold ${addOn.isSkip ? 'text-gray-700' : 'text-amber-900'}`}>
                        {addOn.name}
                      </h3>
                      <p className={`text-xs mt-1 ${addOn.isSkip ? 'text-gray-500' : 'text-pink-600 font-semibold'}`}>
                        {addOn.label}
                      </p>
                      {!addOn.isSkip && (
                        <>
                          <p className="text-sm text-gray-600 mt-2">{addOn.description}</p>
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                            <span className="text-lg font-bold text-pink-600">₹{addOn.price}</span>
                            {isSelected && (
                              <span className="text-sm bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-semibold">
                                Qty: {quantity}
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Selected Add-ons Summary */}
            {Object.keys(selectedAddOns).length > 0 && (
              <div className="bg-pink-50 border-2 border-pink-200 rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-bold text-amber-900 mb-4">Selected Add-ons</h3>
                <div className="space-y-3">
                  {Object.values(selectedAddOns).map((addOn) => (
                    <div key={addOn.id} className="flex items-center justify-between bg-white p-4 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{addOn.emoji}</span>
                        <div className="text-left">
                          <p className="font-semibold text-amber-900">{addOn.name}</p>
                          <p className="text-sm text-gray-600">₹{addOn.price} × {addOn.quantity} = ₹{addOn.price * addOn.quantity}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveAddOn(addOn.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition text-red-600"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Total Add-ons Price */}
                <div className="mt-4 pt-4 border-t border-pink-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-amber-900">Add-ons Total:</span>
                    <span className="text-2xl font-bold text-pink-600">
                      ₹{Object.values(selectedAddOns).reduce((sum, addOn) => sum + (addOn.price * (addOn.quantity || 1)), 0)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gradient-to-t from-white to-transparent border-t border-gray-200 p-8 flex gap-4">
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-3 border-2 border-pink-300 text-pink-600 font-semibold rounded-full hover:bg-pink-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-full hover:from-pink-600 hover:to-pink-700 transition shadow-lg"
            >
              Continue to Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Quantity Selection Modal */}
      {showQuantityModal && (
        <QuantityModal
          addOn={showQuantityModal}
          quantity={tempQuantity}
          onQuantityChange={setTempQuantity}
          onConfirm={handleQuantityConfirm}
          onClose={() => setShowQuantityModal(null)}
        />
      )}
    </>
  )
}

// Quantity Selection Modal Component
function QuantityModal({ addOn, quantity, onQuantityChange, onConfirm, onClose }) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full transform transition-all duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{addOn.emoji}</div>
            <h3 className="text-2xl font-bold text-amber-900">{addOn.name}</h3>
            <p className="text-gray-600 mt-2">{addOn.description}</p>
            <p className="text-lg font-bold text-pink-600 mt-2">₹{addOn.price} per unit</p>
          </div>

          {/* Quantity Selector */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <p className="text-center text-sm text-gray-600 mb-4 font-semibold">How many would you like?</p>
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                className="p-3 bg-white border-2 border-gray-300 rounded-full hover:border-pink-500 hover:bg-pink-50 transition"
              >
                <Minus size={24} className="text-gray-900" />
              </button>

              <div className="bg-white border-2 border-pink-500 rounded-xl px-8 py-4 min-w-32 text-center">
                <p className="text-4xl font-bold text-pink-600">{quantity}</p>
              </div>

              <button
                onClick={() => onQuantityChange(quantity + 1)}
                className="p-3 bg-white border-2 border-gray-300 rounded-full hover:border-pink-500 hover:bg-pink-50 transition"
              >
                <Plus size={24} className="text-gray-900" />
              </button>
            </div>

            {/* Total */}
            <div className="mt-6 pt-6 border-t border-gray-300 flex justify-between items-center">
              <span className="font-semibold text-amber-900">Total for this item:</span>
              <span className="text-2xl font-bold text-pink-600">₹{addOn.price * quantity}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition"
            >
              Change
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-full hover:from-pink-600 hover:to-pink-700 transition"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
