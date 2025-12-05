import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AddToCartModal({ product, isOpen, onClose, onAdd }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState(product?.flavors?.[0]?.id || '');
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0]?.id || '');
  const [selectedEgg, setSelectedEgg] = useState(product?.eggOptions?.[0]?.id || '');

  if (!isOpen || !product) return null;

  const flavor = product.flavors?.find(f => f.id === selectedFlavor) || product.flavors?.[0];
  const size = product.sizes?.find(s => s.id === selectedSize) || product.sizes?.[0];
  const eggOption = product.eggOptions?.find(e => e.id === selectedEgg) || product.eggOptions?.[0];

  const priceMultiplier = (flavor?.priceMultiplier || 1) * (size?.priceMultiplier || 1) * (eggOption?.priceMultiplier || 1);
  const itemPrice = product.basePrice * priceMultiplier;
  const totalPrice = itemPrice * quantity;

  const handleAdd = () => {
    onAdd({
      productId: product.id,
      quantity,
      flavor: flavor?.name,
      size: size?.name,
      eggOption: eggOption?.name,
      price: itemPrice
    });
    setQuantity(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b flex items-center justify-between p-6">
          <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Flavor Selection */}
          {product.flavors && product.flavors.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Flavor</label>
              <div className="grid grid-cols-2 gap-2">
                {product.flavors.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFlavor(f.id)}
                    className={`p-2 text-sm rounded border-2 transition ${
                      selectedFlavor === f.id
                        ? 'border-pink-600 bg-pink-50 text-pink-600 font-semibold'
                        : 'border-gray-300 hover:border-pink-300'
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
              <label className="block text-sm font-semibold text-gray-900 mb-2">Size</label>
              <div className="grid grid-cols-2 gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSize(s.id)}
                    className={`p-2 text-sm rounded border-2 transition ${
                      selectedSize === s.id
                        ? 'border-pink-600 bg-pink-50 text-pink-600 font-semibold'
                        : 'border-gray-300 hover:border-pink-300'
                    }`}
                  >
                    <div>{s.name.split('(')[0]}</div>
                    <div className="text-xs text-gray-600">{s.servings}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Egg Option Selection */}
          {product.eggOptions && product.eggOptions.length > 1 && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Egg Option</label>
              <div className="flex gap-2">
                {product.eggOptions.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => setSelectedEgg(e.id)}
                    className={`flex-1 p-2 text-sm rounded border-2 transition ${
                      selectedEgg === e.id
                        ? 'border-pink-600 bg-pink-50 text-pink-600 font-semibold'
                        : 'border-gray-300 hover:border-pink-300'
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
          <div className="bg-pink-50 rounded-xl p-4 space-y-1">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Base Price:</span>
              <span>${product.basePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>With Selections:</span>
              <span>${itemPrice.toFixed(2)}</span>
            </div>
            <div className="border-t border-pink-200 pt-2 flex justify-between font-bold text-lg text-pink-600">
              <span>Total ({quantity}x):</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-full border-2 border-gray-300 text-gray-900 font-semibold hover:border-pink-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="flex-1 px-6 py-3 rounded-full bg-pink-600 text-white font-semibold hover:bg-pink-700 transition shadow-lg"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
