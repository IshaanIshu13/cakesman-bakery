import React, { useState } from 'react'
import { ShoppingCart, Sparkles, Zap } from 'lucide-react'
import { toast } from 'sonner'

export default function PartyAddOns() {
  const [loading, setLoading] = useState({})

  const addOns = [
    {
      id: 'addon-001',
      name: 'Sparkle Candles',
      price: 149,
      description: 'Beautiful sparkle candles that light up any celebration',
      image: 'https://images.unsplash.com/photo-1587799363456-9a6db3f19d27?w=400&h=400&fit=crop',
      badges: ['Popular', 'Quick Add'],
      category: 'Party Accessories'
    },
    {
      id: 'addon-002',
      name: 'Colorful Balloons',
      price: 99,
      description: 'Set of 12 vibrant balloons to brighten up your party',
      image: 'https://images.unsplash.com/photo-1599027615149-3894f8e4e1ea?w=400&h=400&fit=crop',
      badges: ['Quick Add'],
      category: 'Party Accessories'
    },
    {
      id: 'addon-003',
      name: 'Birthday Caps',
      price: 79,
      description: 'Fun party hats for all your guests',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
      badges: ['Quick Add'],
      category: 'Party Accessories'
    },
    {
      id: 'addon-004',
      name: 'Party Poppers',
      price: 199,
      description: 'Pack of 6 confetti poppers for that surprise moment',
      image: 'https://images.unsplash.com/photo-1559329007-40790c9fdf4a?w=400&h=400&fit=crop',
      badges: ['Popular', 'Quick Add'],
      category: 'Party Accessories'
    }
  ]

  const handleAddToCart = async (addOn) => {
    setLoading(prev => ({ ...prev, [addOn.id]: true }))

    try {
      const cartItem = {
        id: addOn.id,
        name: addOn.name,
        price: addOn.price,
        image: addOn.image,
        category: addOn.category,
        quantity: 1,
        isAddOn: true
      }

      // Get existing cart from localStorage
      const existingCart = localStorage.getItem('cart')
      let cart = existingCart ? JSON.parse(existingCart) : []

      // Check if item already exists in cart
      const existingItem = cart.find(item => item.id === addOn.id)
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        cart.push(cartItem)
      }

      // Save updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(cart))

      // Emit custom event to update cart in other components
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }))

      toast.success(`${addOn.name} added to cart! 🎉`)
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add to cart')
    } finally {
      setLoading(prev => ({ ...prev, [addOn.id]: false }))
    }
  }

  return (
    <section className="py-16 bg-gradient-to-b from-pink-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
            <Sparkles className="text-pink-600" size={28} />
            <h2 className="text-3xl sm:text-4xl font-bold text-amber-900">
              Make Your Celebration Extra Special!
            </h2>
            <Sparkles className="text-pink-600" size={28} />
          </div>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Complete your cake order with these delightful party accessories and celebration add-ons.
          </p>
        </div>

        {/* Add-ons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {addOns.map((addOn) => (
            <div
              key={addOn.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden group"
            >
              {/* Image Container */}
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                <img
                  src={addOn.image}
                  alt={addOn.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />

                {/* Badges */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  {addOn.badges.map((badge, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                        badge === 'Popular'
                          ? 'bg-pink-600'
                          : 'bg-amber-600'
                      }`}
                    >
                      {badge === 'Popular' ? '⭐ Popular' : badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-amber-900 text-lg mb-2">
                  {addOn.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {addOn.description}
                </p>

                {/* Price */}
                <div className="mb-4">
                  <p className="text-2xl font-bold text-pink-600">
                    ₹{addOn.price}
                  </p>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(addOn)}
                  disabled={loading[addOn.id]}
                  className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-2.5 rounded-lg transition duration-300 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={18} />
                  {loading[addOn.id] ? 'Adding...' : 'Add'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info Footer */}
        <div className="mt-12 bg-white rounded-xl p-6 border-2 border-pink-100">
          <div className="flex items-start gap-3">
            <Zap className="text-amber-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h4 className="font-bold text-amber-900 mb-2">Quick Add Feature</h4>
              <p className="text-gray-700">
                Add party accessories to your order instantly! No customization needed - just add to cart and proceed to checkout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
