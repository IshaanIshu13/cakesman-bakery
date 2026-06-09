import React from 'react';
import { X } from 'lucide-react';

const CAKE_SIZES = [
  { id: 1, label: '0.5 kg', value: '0.5 kg', servings: '2-4 people' },
  { id: 2, label: '1 kg', value: '1 kg', servings: '4-6 people' },
  { id: 3, label: '1.5 kg', value: '1.5 kg', servings: '6-8 people' },
  { id: 4, label: '2 kg', value: '2 kg', servings: '8-10 people' },
  { id: 5, label: '2.5 kg', value: '2.5 kg', servings: '10-12 people' },
  { id: 6, label: '3 kg', value: '3 kg', servings: '12-15 people' }
];

export default function CakeSizeSelector({ isOpen, onClose, onSelect, productName }) {
  const [selectedSize, setSelectedSize] = React.useState(null);

  const handleSelect = (size) => {
    setSelectedSize(size);
    onSelect(size);
    setSelectedSize(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Select Cake Size</h2>
            <p className="text-pink-100 text-sm mt-1">{productName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-pink-600 p-1 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-3">
            {CAKE_SIZES.map((size) => (
              <button
                key={size.id}
                onClick={() => handleSelect(size.value)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  selectedSize === size.value
                    ? 'border-pink-500 bg-pink-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-pink-300 hover:bg-pink-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">{size.label}</p>
                    <p className="text-sm text-gray-500 mt-1">👥 {size.servings}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedSize === size.value
                        ? 'border-pink-500 bg-pink-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedSize === size.value && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
            <p className="text-xs text-amber-900">
              💡 <span className="font-semibold">Tip:</span> Choose the size based on the number of guests.
              Larger sizes offer better value!
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full mt-6 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export { CAKE_SIZES };
