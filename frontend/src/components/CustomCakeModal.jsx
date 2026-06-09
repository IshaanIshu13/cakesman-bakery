import React from 'react';
import { X, Phone, MessageCircle } from 'lucide-react';

const CustomCakeModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const phoneNumber = '8808140339';
  const whatsappUrl = `https://wa.me/91${phoneNumber}?text=Hi! I'm interested in ordering a custom cake design.`;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-in">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Custom Cake Design</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Message */}
            <div className="text-center space-y-4">
              <div className="text-6xl">🎂</div>
              <p className="text-lg text-gray-700 font-medium">
                Let's Create Something Sweet!
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Got a wild cake idea? Our bakers love bringing your dreams to life!
              </p>
              <p className="text-3xl font-bold text-rose-600">
                {phoneNumber}
              </p>
              <p className="text-xs text-gray-500">
                Call or WhatsApp to discuss your custom creation
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Call Button */}
              <a
                href={`tel:+91${phoneNumber}`}
                className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                <Phone size={20} />
                Call Us
              </a>

              {/* WhatsApp Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                <MessageCircle size={20} />
                WhatsApp
              </a>
            </div>

            {/* Info Text */}
            <p className="text-sm text-gray-600 text-center">
              Our team will help you create the perfect custom cake for your special occasion.
            </p>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomCakeModal;
