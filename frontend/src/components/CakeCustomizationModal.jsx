import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { CAKE_SIZES } from './CakeSizeSelector';

const CakeCustomizationModal = ({ isOpen, onClose, onConfirm, cake }) => {
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);

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

  const handleSubmit = () => {
    // MANDATORY: Size MUST be selected
    if (!selectedSize) {
      setSizeError(true);
      return;
    }

    if (selectedFlavor && selectedSize) {
      onConfirm({
        ...cake,
        flavor: selectedFlavor,
        size: selectedSize, // Use standard cake size value
        quantity,
        cartId: `${cake._id || cake.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        productId: cake._id || cake.id,
        name: cake.name,
        price: cake.price,
        image: cake.image
      });
      onClose();
      setSelectedSize('');
      setSelectedFlavor('');
      setSizeError(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{cake.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* MANDATORY: Size Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              🎂 Select Cake Size *
              <span className="text-xs text-pink-600 font-bold">(Required)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CAKE_SIZES.map((size) => (
                <button
                  key={size.id}
                  onClick={() => {
                    setSelectedSize(size.value);
                    setSizeError(false);
                  }}
                  className={`p-3 text-sm rounded-lg border-2 transition ${
                    selectedSize === size.value
                      ? 'border-pink-600 bg-pink-50 text-pink-600 font-semibold shadow-md'
                      : 'border-gray-300 hover:border-pink-300'
                  }`}
                >
                  <div className="font-bold">{size.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{size.servings}</div>
                </button>
              ))}
            </div>
            {sizeError && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-600 font-semibold">Please select a cake size</p>
              </div>
            )}
          </div>

          {/* Flavor Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Flavor (Optional)</label>
            <select 
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-pink-400 focus:outline-none transition"
              value={selectedFlavor}
              onChange={(e) => setSelectedFlavor(e.target.value)}
            >
              <option value="">Choose a flavor</option>
              {flavors.map((flavor) => (
                <option key={flavor} value={flavor}>{flavor}</option>
              ))}
            </select>
          </div>

          {/* Quantity Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-pink-600 flex items-center justify-center"
              >
                −
              </button>
              <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-pink-600 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* Price Summary */}
          {selectedSize && (
            <div className="p-4 bg-pink-50 border-2 border-pink-200 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Unit Price:</span>
                <span className="font-semibold text-gray-900">₹{cake.price.toFixed(0)}</span>
              </div>
              <div className="border-t border-pink-200 pt-2 flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total ({quantity}x):</span>
                <span className="text-xl font-bold text-pink-600">
                  ₹{(cake.price * quantity).toFixed(0)}
                </span>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-900">
              💡 <span className="font-semibold">Tip:</span> Size cannot be changed after adding to cart!
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="border-t p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-900 font-semibold rounded-full hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedSize}
            className={`flex-1 px-6 py-3 rounded-full font-semibold transition shadow-lg ${
              selectedSize
                ? 'bg-pink-600 text-white hover:bg-pink-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CakeCustomizationModal;