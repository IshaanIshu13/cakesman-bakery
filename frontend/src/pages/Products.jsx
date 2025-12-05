import React, { useState, useContext, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { api } from "../utils/api";
import { CATEGORIES, SAMPLE_PRODUCTS } from "../data/categories";
import ProductCard from "../components/ProductCard";
import AddToCartModal from "../components/AddToCartModal";
import { Filter } from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedSubcategory, searchQuery]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getAllProducts(selectedCategory, selectedSubcategory, searchQuery);
      setProducts(data && data.length > 0 ? data : SAMPLE_PRODUCTS);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts(SAMPLE_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  const currentCategory = CATEGORIES.find(c => c.id === selectedCategory);

  const handleAddClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddToCart = (cartItem) => {
    addToCart(cartItem);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-pink-700 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">🎂 Our Products</h1>
          <p className="text-pink-100">Browse our delicious selection of cakes and pastries</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-20">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Filter size={20} /> Filters
              </h2>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Category</label>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedCategory("");
                      setSelectedSubcategory("");
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      !selectedCategory
                        ? "bg-pink-100 text-pink-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setSelectedSubcategory("");
                      }}
                      className={`w-full text-left px-4 py-2 rounded-lg transition ${
                        selectedCategory === cat.id
                          ? "bg-pink-100 text-pink-700 font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {cat.emoji} {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategories */}
              {currentCategory && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Subcategory</label>
                  <div className="space-y-2">
                    {currentCategory.subcategories.map((subcat) => (
                      <button
                        key={subcat.id}
                        onClick={() => setSelectedSubcategory(subcat.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition text-sm ${
                          selectedSubcategory === subcat.id
                            ? "bg-pink-100 text-pink-700 font-semibold"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {subcat.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
                </div>
                <p className="text-gray-600 mt-4">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                <p className="text-gray-600 text-lg mb-4">No products found</p>
                <button
                  onClick={() => {
                    setSelectedCategory("");
                    setSelectedSubcategory("");
                    setSearchQuery("");
                  }}
                  className="px-6 py-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddClick={handleAddClick}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Add to Cart Modal */}
      <AddToCartModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        onAdd={handleAddToCart}
      />
    </div>
  );
}