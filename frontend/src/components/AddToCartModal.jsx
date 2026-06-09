import React, { useState, useMemo } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { CAKE_SIZES } from './CakeSizeSelector';
import { calculateCakePrice } from '../data/cakePrices';
import { formatPrice } from '../utils/priceCalculator';

export default function AddToCartModal({ product, isOpen, onClose, onAdd }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState(product?.flavors?.[0]?.id || '');
  const [selectedCakeSize, setSelectedCakeSize] = useState(''); // MANDATORY - must be selected
  const [sizeError, setSizeError] = useState(false);

  // Get flavor list - use dynamic prices if available from CAKE_PRICES, otherwise use product flavors
  const flavorList = product?.flavors || [];
  const flavor = flavorList.find(f => f.id === selectedFlavor) || flavorList[0];

  // Calculate price dynamically based on category, flavor, and size
  const itemPrice = useMemo(() => {
    if (!selectedCakeSize || !product?.category || !selectedFlavor) {
      return product?.basePrice || 0;
    }

    // Try to get price from pricing database first
    const dbPrice = calculateCakePrice(product.category, selectedFlavor, selectedCakeSize);
    if (dbPrice !== null) {
      return dbPrice;
    }

    // Fallback: use base price with weight multiplier
    const sizeObj = CAKE_SIZES.find(s => s.value === selectedCakeSize);
    if (sizeObj && product?.basePrice) {
      // Infer multiplier from size (1kg = 1x, 0.5kg = 0.5x, 1.5kg = 1.5x, etc.)
      const multiplierMap = { '0.5 kg': 0.5, '1 kg': 1, '1.5 kg': 1.5, '2 kg': 2, '2.5 kg': 2.5, '3 kg': 3 };
      const multiplier = multiplierMap[selectedCakeSize] || 1;
      return Math.round(product.basePrice * multiplier);
    }

    return product?.basePrice || 0;
  }, [selectedCakeSize, product, selectedFlavor]);

  const totalPrice = itemPrice * quantity;

  // Early return after all hooks
  if (!isOpen || !product) return null;

  const handleAdd = () => {
    // MANDATORY: Cake size MUST be selected
    if (!selectedCakeSize) {
      setSizeError(true);
      return;
    }

    setSizeError(false);

    onAdd({
      // Generate unique cartId for this item instance
      cartId: `${product._id || product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      productId: product._id || product.id,
      name: product.name,
      quantity,
      flavor: flavor?.name || selectedFlavor || '',
      flavorId: selectedFlavor,
      category: product.category,
      size: selectedCakeSize, // MANDATORY SIZE INCLUDED
      price: itemPrice, // Store the calculated unit price
      // Include product image for cart display
      image: product.image
    });
    setQuantity(1);
    setSelectedCakeSize('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b flex items-center justify-between p-6 z-10">
          <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* MANDATORY: Cake Size Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              🎂 Select Cake Size *
              <span className="text-xs text-pink-600 font-bold">(Required)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CAKE_SIZES.map((size) => (
                <button
                  key={size.id}
                  onClick={() => {
                    setSelectedCakeSize(size.value);
                    setSizeError(false);
                  }}
                  className={`p-3 text-sm rounded-lg border-2 transition ${
                    selectedCakeSize === size.value
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
              <span>Price per unit ({selectedCakeSize || '1 kg'}):</span>
              <span className="font-semibold text-gray-900">{formatPrice(itemPrice)}</span>
            </div>
            <div className="border-t border-pink-200 pt-2 flex justify-between font-bold text-lg text-pink-600">
              <span>Total ({quantity}x):</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>

          {/* Info Box */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-900">
              💡 <span className="font-semibold">Tip:</span> Cake size cannot be changed after adding to cart. Choose wisely!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 flex gap-3 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-full border-2 border-gray-300 text-gray-900 font-semibold hover:border-pink-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!selectedCakeSize}
            className={`flex-1 px-6 py-3 rounded-full font-semibold transition shadow-lg ${
              selectedCakeSize
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
}
