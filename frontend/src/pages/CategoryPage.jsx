import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronRight, Filter, X } from 'lucide-react'
import { CATEGORIES } from '../data/categories'
import ProductCard from '../components/ProductCard'
import { toast } from 'sonner'
import { api } from '../utils/api'

export default function CategoryPage() {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const [selectedSubcategory, setSelectedSubcategory] = useState(null)
  const [filteredProducts, setFilteredProducts] = useState([])
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Get current category
  const currentCategory = CATEGORIES.find(cat => cat.id === categoryId)

  // Fetch products from API
  useEffect(() => {
    if (!currentCategory) {
      toast.error('Category not found')
      navigate('/')
      return
    }

    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await api.getAllProducts(currentCategory.name, selectedSubcategory)
        setFilteredProducts(Array.isArray(response) ? response : response.products || [])
      } catch (error) {
        console.error('Error fetching products:', error)
        toast.error('Failed to load products')
        setFilteredProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [categoryId, selectedSubcategory, currentCategory, navigate])

  if (!currentCategory) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-cream-50 pt-24 pb-16">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-pink-100 shadow-sm sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-4 text-sm text-gray-600">
            <button
              onClick={() => navigate('/')}
              className="text-pink-600 hover:text-pink-700 transition"
            >
              Home
            </button>
            <ChevronRight size={16} />
            <span className="text-gray-600">{currentCategory.name}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-5xl">{currentCategory.emoji}</span>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-amber-900 mb-2">
                {currentCategory.name}
              </h1>
              <p className="text-gray-600">{currentCategory.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-amber-900">
            {filteredProducts.length} products found
          </h2>
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 border-2 border-pink-300 text-pink-600 rounded-full hover:bg-pink-50 transition"
          >
            <Filter size={18} />
            Filter
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories Filter */}
          <div
            className={`lg:col-span-1 ${
              mobileFilterOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-40">
              <div className="flex justify-between items-center mb-6 lg:hidden">
                <h3 className="text-xl font-bold text-amber-900">Subcategories</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1"
                >
                  <X size={24} />
                </button>
              </div>

              <h3 className="text-xl font-bold text-amber-900 mb-4 hidden lg:block">
                🎯 Subcategories
              </h3>

              {/* All Button */}
              <button
                onClick={() => setSelectedSubcategory(null)}
                className={`w-full text-left px-4 py-3 rounded-xl mb-3 font-medium transition-all ${
                  selectedSubcategory === null
                    ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md'
                    : 'bg-transparent text-gray-700 hover:bg-pink-50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>All</span>
                  <span className="text-xs bg-pink-200 text-pink-700 px-2 py-1 rounded-full">
                    {filteredProducts.length}
                  </span>
                </div>
              </button>

              {/* Subcategory Buttons */}
              <div className="space-y-2">
                {currentCategory.subcategories.map((subcategory) => (
                  <button
                    key={subcategory.id}
                    onClick={() => {
                      setSelectedSubcategory(subcategory.id)
                      setMobileFilterOpen(false)
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
                      selectedSubcategory === subcategory.id
                        ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md'
                        : 'bg-transparent text-gray-700 hover:bg-pink-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm">{subcategory.name}</div>
                        {subcategory.description && (
                          <div className="text-xs opacity-70 mt-1">
                            {subcategory.description}
                          </div>
                        )}
                      </div>
                      <span className="text-xs bg-pink-200 text-pink-700 px-2 py-1 rounded-full ml-2">
                        -
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-amber-900">
                  {filteredProducts.length} products found
                </h2>
                {selectedSubcategory && (
                  <button
                    onClick={() => setSelectedSubcategory(null)}
                    className="text-sm text-pink-600 hover:text-pink-700 mt-2"
                  >
                    ← Clear filter
                  </button>
                )}
              </div>

              {/* Decorative Badges */}
              <div className="flex gap-2 flex-wrap">
                <span className="px-4 py-2 bg-white border-2 border-pink-200 text-pink-600 rounded-full text-sm font-medium">
                  🎂 Fresh Baked
                </span>
                <span className="px-4 py-2 bg-white border-2 border-pink-200 text-pink-600 rounded-full text-sm font-medium">
                  🚚 Same Day Delivery
                </span>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="bg-white rounded-2xl p-12 text-center">
                <p className="text-gray-500 text-lg">Loading products...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center">
                <p className="text-gray-500 text-lg mb-2">
                  No products found in this category
                </p>
                <p className="text-gray-400 text-sm">
                  Try selecting a different subcategory
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}