import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddClick = () => {
    const cartId = `${product._id || product.id}-${Date.now()}-${Math.random()}`;
    addToCart({
      cartId,
      productId: product._id || product.id,
      name: product.name,
      price: product.basePrice,
      image: product.image,
      quantity: 1
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleViewProduct = () => {
    navigate(`/product/${product._id || product.id}`);
  };
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center overflow-hidden group">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
          />
        ) : (
          <span className="text-6xl">🎂</span>
        )}
        {product.featured && (
          <div className="absolute top-3 right-3 bg-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name */}
        <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2">
          {product.name}
        </h3>

        {/* Category */}
        <p className="text-xs text-gray-500 mb-2 capitalize">
          {product.category} • {product.subcategory}
        </p>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.round(product.rating) ? 'fill-current' : ''}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">({product.rating})</span>
          </div>
        )}

        {/* Price and Button */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-500">From</p>
            <p className="text-2xl font-bold text-pink-600">
              ₹{product.basePrice}
            </p>
          </div>
          <button
            onClick={handleAddClick}
            className="px-4 py-2 bg-pink-600 text-white rounded-full font-semibold hover:bg-pink-700 transition text-sm flex items-center gap-2"
          >
            <ShoppingCart size={16} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}