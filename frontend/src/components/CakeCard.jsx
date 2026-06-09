import React, { useState } from 'react';
import CakeCustomizationModal from './CakeCustomizationModal';
import { ShoppingCart } from 'lucide-react';

const CakeCard = ({ cake }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Normalize product data for safe rendering
  const normalizedCake = {
    ...cake,
    price: cake.price || cake.basePrice || 0,
    inStock: cake.inStock !== undefined ? cake.inStock : (cake.stock > 0),
    available: cake.available !== false
  };

  const handleAddToCart = (customizedCake) => {
    // Verify product is still available
    if (!normalizedCake.available || !normalizedCake.inStock) {
      return;
    }

    // Get existing cart items from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Add new item with unique ID (timestamp + random to ensure uniqueness)
    const newItem = {
      ...customizedCake,
      // Ensure cartId is unique - timestamp + random string
      cartId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      // Ensure quantity defaults to 1
      quantity: customizedCake.quantity || 1
    };
    
    // Save updated cart
    localStorage.setItem('cart', JSON.stringify([...existingCart, newItem]));
    
    // Dispatch event for cart update
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <div className="group bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-xl">
      <div className="relative overflow-hidden">
        <img 
          src={normalizedCake.image} 
          alt={normalizedCake.name}
          className="w-full h-48 object-cover transform transition-transform group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 transition-opacity opacity-0 group-hover:opacity-100"></div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{normalizedCake.name}</h3>
        <p className="text-gray-600 text-sm mb-3 h-12 overflow-hidden">{normalizedCake.description}</p>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500">Starting from</span>
            <span className="block text-lg font-bold text-pink-600">₹{normalizedCake.price}</span>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            disabled={!normalizedCake.available || !normalizedCake.inStock}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors ${
              normalizedCake.available && normalizedCake.inStock
                ? 'bg-pink-500 text-white hover:bg-pink-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart size={18} />
            <span>{normalizedCake.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
          </button>
        </div>
      </div>

      <CakeCustomizationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleAddToCart}
        cake={cake}
      />
    </div>
  );
};

export default CakeCard;