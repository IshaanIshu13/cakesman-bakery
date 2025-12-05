import React, { useState } from 'react';
import CakeCustomizationModal from './CakeCustomizationModal';
import { ShoppingCart } from 'lucide-react';

const CakeCard = ({ cake }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCart = (customizedCake) => {
    // Get existing cart items from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Add new item with unique ID
    const newItem = {
      ...customizedCake,
      cartId: Date.now()
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
          src={cake.image} 
          alt={cake.name}
          className="w-full h-48 object-cover transform transition-transform group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 transition-opacity opacity-0 group-hover:opacity-100"></div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{cake.name}</h3>
        <p className="text-gray-600 text-sm mb-3 h-12 overflow-hidden">{cake.description}</p>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500">Starting from</span>
            <span className="block text-lg font-bold text-pink-600">₹{cake.price}</span>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-full text-sm hover:bg-pink-600 transition-colors"
          >
            <ShoppingCart size={18} />
            <span>Add to Cart</span>
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