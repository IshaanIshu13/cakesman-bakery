import React, { useState } from 'react';
import { X } from 'lucide-react';

const CakeCustomizationModal = ({ isOpen, onClose, onConfirm, cake }) => {
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  const flavors = [
    "Vanilla",
    "Chocolate",
    "Butterscotch",
    "Red Velvet",
    "Strawberry",
    "Pineapple",
    "Mango",
    "Coffee"
  ];

  const sizes = [
    { value: 0.5, label: "500g" },
    { value: 1, label: "1 Kg" },
    { value: 1.5, label: "1.5 Kg" },
    { value: 2, label: "2 Kg" },
    { value: 3, label: "3 Kg" },
    { value: 5, label: "5 Kg" }
  ];

  const handleSubmit = () => {
    if (selectedFlavor && selectedSize) {
      onConfirm({
        ...cake,
        selectedFlavor,
        selectedSize,
        quantity,
        totalPrice: cake.price * parseFloat(selectedSize)
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{cake.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Flavor Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-semibold">Select Flavor</label>
          <select 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-400 outline-none"
            value={selectedFlavor}
            onChange={(e) => setSelectedFlavor(e.target.value)}
          >
            <option value="">Choose a flavor</option>
            {flavors.map((flavor) => (
              <option key={flavor} value={flavor}>{flavor}</option>
            ))}
          </select>
        </div>

        {/* Size Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-semibold">Select Size</label>
          <select 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-400 outline-none"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            <option value="">Choose a size</option>
            {sizes.map((size) => (
              <option key={size.value} value={size.value}>
                {size.label} - ₹{(cake.price * size.value).toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-semibold">Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-400 outline-none"
          />
        </div>

        {/* Total Price */}
        {selectedSize && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Price:</span>
              <span className="text-xl font-bold text-pink-600">
                ₹{(cake.price * parseFloat(selectedSize) * quantity).toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedFlavor || !selectedSize}
            className={`px-6 py-2 rounded-lg ${
              selectedFlavor && selectedSize
                ? 'bg-pink-500 hover:bg-pink-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            } transition-colors`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CakeCustomizationModal;