import React, { useState } from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AddToCartModal from './AddToCartModal';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Normalize product data for safe rendering
  const normalizedProduct = {
    ...product,
    price: product.price || product.basePrice || 0,
    inStock: product.inStock !== undefined ? product.inStock : (product.stock > 0),
    available: product.available !== false
  };

  const handleAddClick = () => {
    // Only allow adding if product is available and in stock
    if (!normalizedProduct.available || !normalizedProduct.inStock) {
      toast.error("This product is currently unavailable");
      return;
    }

    // Open modal to let user select size (MANDATORY)
    setIsModalOpen(true);
  };

  const handleAddFromModal = (item) => {
    addToCart(item);
    toast.success(`${item.name} added to cart!`);
  };

  const handleViewProduct = () => {
    navigate(`/product/${normalizedProduct._id || normalizedProduct.id}`);
  };
  return (
    <>
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden">
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center overflow-hidden group">
          {normalizedProduct.image ? (
            <img 
              src={normalizedProduct.image} 
              alt={normalizedProduct.name}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
            />
          ) : (
            <span className="text-6xl">🎂</span>
          )}
          {normalizedProduct.featured && (
            <div className="absolute top-3 right-3 bg-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Name */}
          <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2">
            {normalizedProduct.name}
          </h3>

          {/* Category */}
          <p className="text-xs text-gray-500 mb-2 capitalize">
            {normalizedProduct.category} • {normalizedProduct.subcategory}
          </p>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {normalizedProduct.description}
          </p>

          {/* Rating */}
          {normalizedProduct.rating && (
            <div className="flex items-center gap-1 mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.round(normalizedProduct.rating) ? 'fill-current' : ''}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">({normalizedProduct.rating})</span>
          </div>
        )}

        {/* Price and Button */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-500">From</p>
            <p className="text-2xl font-bold text-pink-600">
              ₹{normalizedProduct.price}
            </p>
          </div>
          <button
            onClick={handleAddClick}
            disabled={!normalizedProduct.available || !normalizedProduct.inStock}
            className={`px-4 py-2 rounded-full font-semibold transition text-sm flex items-center gap-2 ${
              normalizedProduct.available && normalizedProduct.inStock
                ? 'bg-pink-600 text-white hover:bg-pink-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart size={16} />
            {normalizedProduct.inStock ? 'Add' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>

    {/* Modal for size selection - MANDATORY before add to cart */}
    <AddToCartModal
      product={{
        ...normalizedProduct,
        _id: normalizedProduct._id || normalizedProduct.id,
        flavors: [{ id: '1', name: 'Classic', priceMultiplier: 1 }],
      }}
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onAdd={handleAddFromModal}
    />
    </>
  );
}