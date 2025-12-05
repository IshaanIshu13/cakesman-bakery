// ============================================
// FINAL NAVBAR.JSX (KEY PARTS)
// Location: frontend/src/components/Navbar.jsx
// ============================================

import React, { useState, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, ChevronDown, LogOut, Settings } from "lucide-react";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal";

// Separate component for cart link to properly handle context
const CartLink = () => {
  const { getCartCount } = useContext(CartContext);
  const cartCount = getCartCount();
  
  return (
    <Link to="/cart" className="relative group text-xl cursor-pointer text-gray-700 hover:text-pink-600 transition-colors">
      <ShoppingCart size={24} />
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-3 bg-pink-400 text-white text-xs px-2 py-0.5 rounded-full">
          {cartCount}
        </span>
      )}
      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-max bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
        Go to Cart
      </span>
    </Link>
  );
};

function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();
  
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  // ... menu items code (unchanged) ...

  return (
    <nav className="bg-white border-b border-gray-200 font-sans fixed top-0 left-0 right-0 z-50">
      {/* Top Section */}
      <div className="flex items-center justify-between px-10 py-3">
        <Link to="/" className="text-xl font-bold text-gray-700 hover:text-pink-600 transition-colors">
          🧁 Cakes Man Bakery
        </Link>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search for cakes, desserts..."
            className="w-[350px] px-4 py-2 border border-gray-300 rounded-full outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
          />
        </div>

        {/* Cart + User Profile Section */}
        <div className="flex items-center gap-6">
          <CartLink />
          
          {!isAuthenticated ? (
            // Show Login button if not authenticated
            <button 
              onClick={() => setIsLoginModalOpen(true)} 
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-pink-600 transition-colors border border-gray-200 rounded-lg hover:border-pink-600"
            >
              <User size={20} />
              <span className="font-semibold">Login</span>
            </button>
          ) : isAdmin ? (
            // Show Admin Dashboard button if admin
            <button 
              onClick={() => navigate("/admin")} 
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
            >
              <Settings size={20} />
              Admin Panel
            </button>
          ) : (
            // Show user profile dropdown if customer
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-pink-100 hover:bg-pink-200 transition-colors"
              >
                <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="text-sm font-semibold text-gray-700 hidden sm:inline max-w-[100px] truncate">
                  {user?.name?.split(" ")[0]}
                </span>
              </button>
              
              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <p className="font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-pink-600 transition-colors"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    👤 My Profile
                  </Link>
                  
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-pink-600 transition-colors"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    🛒 My Orders
                  </Link>
                  
                  <button
                    onClick={() => {
                      logout();
                      setIsProfileMenuOpen(false);
                      navigate("/");
                    }}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors border-t border-gray-200 font-semibold flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
          
          <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
        </div>
      </div>

      {/* Bottom Menu (unchanged - shown for completeness in actual file) */}
      {/* ... rest of menu code ... */}
    </nav>
  );
}

export default Navbar;
