import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Heart, Share2, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { api } from '../utils/api'
import PartyAddOns from '../components/PartyAddOns'
import { toast } from 'sonner'

export default function ProductDetailPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedFlavor, setSelectedFlavor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedEgg, setSelectedEgg] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch product from API
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const foundProduct = await api.getProduct(productId)
        if (foundProduct) {
          setProduct(foundProduct)
          setSelectedFlavor(foundProduct.flavors?.[0]?.id || '')
          setSelectedSize(foundProduct.sizes?.[0]?.id || '')
          setSelectedEgg(foundProduct.eggOptions?.[0]?.id || '')
        } else {
          toast.error('Product not found')
          navigate('/')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        toast.error('Failed to load product')
        navigate('/')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId, navigate])

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  const flavor = product.flavors?.find(f => f.id === selectedFlavor) || product.flavors?.[0]
  const size = product.sizes?.find(s => s.id === selectedSize) || product.sizes?.[0]
  const eggOption = product.eggOptions?.find(e => e.id === selectedEgg) || product.eggOptions?.[0]

  const priceMultiplier = (flavor?.priceMultiplier || 1) * (size?.priceMultiplier || 1) * (eggOption?.priceMultiplier || 1)
  const itemPrice = product.basePrice * priceMultiplier
  const totalPrice = itemPrice * quantity

  const handleAddToCart = () => {
    setLoading(true)
    try {
      addToCart({
        productId: product._id || product.id,
        quantity,
        flavor: flavor?.name,
        size: size?.name,
        eggOption: eggOption?.name,
        price: itemPrice
      })
      toast.success('Product added to cart! 🎉')
      setQuantity(1)
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add to cart')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-amber-50 pt-24 pb-16">
      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-pink-600 hover:text-pink-700 transition font-semibold"
        >
          <ChevronLeft size={20} />
          Back
        </button>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-lg p-8">
          {/* Image */}
          <div className="flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto max-h-96 object-cover rounded-lg"
            />
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-amber-900 mb-2">{product.name}</h1>
              <p className="text-gray-700">{product.description}</p>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-pink-600">
              ₹{itemPrice.toFixed(2)}
            </div>

            {/* Flavor Selection */}
            {product.flavors && product.flavors.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Select Flavor
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {product.flavors.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFlavor(f.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        selectedFlavor === f.id
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Select Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSize(s.id)}
                      className={`px-3 py-2 rounded-lg font-medium transition text-sm ${
                        selectedSize === s.id
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Egg Option */}
            {product.eggOptions && product.eggOptions.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Egg Option
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {product.eggOptions.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => setSelectedEgg(e.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        selectedEgg === e.id
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      {e.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  −
                </button>
                <span className="text-2xl font-bold text-amber-900 min-w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total Price */}
            <div className="bg-gradient-to-r from-pink-50 to-amber-50 p-4 rounded-lg border-2 border-pink-200">
              <p className="text-gray-600 mb-1">Total Price</p>
              <p className="text-3xl font-bold text-pink-600">₹{totalPrice.toFixed(2)}</p>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-75"
            >
              <ShoppingCart size={20} />
              {loading ? 'Adding...' : 'Add to Cart'}
            </button>

            {/* Share & Wishlist */}
            <div className="flex gap-4">
              <button className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:border-pink-500 hover:text-pink-600 transition">
                <Heart size={18} />
                Save
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:border-pink-500 hover:text-pink-600 transition">
                <Share2 size={18} />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Party Add-ons Section */}
      <PartyAddOns />
    </div>
  )
}
