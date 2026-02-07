import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut, Settings, Search, X } from "lucide-react";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { SocketContext } from "../context/SocketContext";
import LoginModal from "./LoginModal";
import { api } from "../utils/api";

// Search Bar Component with Dropdown
const SearchBar = () => {
  const navigate = useNavigate();
  const socketContext = useContext(SocketContext);
  const { products: realtimeProducts = [] } = socketContext || {};

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);

  // Combine categories from menuItems
  const categories = ["Cakes", "Cupcakes", "Pastries", "Breads", "Cookies", "Specialty", "Desserts"];

  // Handle search input change
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      setIsDropdownOpen(false);
      return;
    }

    // Perform search
    const performSearch = async () => {
      setIsLoading(true);
      try {
        // Use realtime products first, fallback to API
        let productsToSearch = realtimeProducts;
        
        // If no realtime products, fetch from API
        if (!Array.isArray(productsToSearch) || productsToSearch.length === 0) {
          try {
            const response = await api.getAllProducts("", "", searchQuery);
            productsToSearch = response.data || response || [];
          } catch (error) {
            console.error("Error fetching products:", error);
            productsToSearch = [];
          }
        }

        // Filter products based on search query (case-insensitive, partial match)
        const query = searchQuery.toLowerCase();
        
        const productMatches = (Array.isArray(productsToSearch) ? productsToSearch : [])
          .filter(p => {
            const normalized = {
              ...p,
              price: p.price || p.basePrice || 0,
              inStock: p.inStock !== undefined ? p.inStock : (p.stock > 0),
              available: p.available !== false
            };
            return (
              normalized.available &&
              normalized.inStock &&
              (normalized.name?.toLowerCase().includes(query) ||
                normalized.description?.toLowerCase().includes(query) ||
                normalized.category?.toLowerCase().includes(query))
            );
          })
          .slice(0, 3) // Limit to 3 products
          .map(p => ({
            ...p,
            price: p.price || p.basePrice || 0,
            inStock: p.inStock !== undefined ? p.inStock : (p.stock > 0),
            available: p.available !== false,
            type: "product"
          }));

        // Find category matches
        const categoryMatches = categories
          .filter(cat => cat.toLowerCase().includes(query))
          .slice(0, 4 - productMatches.length) // Fill remaining slots
          .map(cat => ({
            name: cat,
            category: cat,
            type: "category"
          }));

        const combined = [...productMatches, ...categoryMatches].slice(0, 4);
        setSearchResults(combined);
        setIsDropdownOpen(combined.length > 0);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, realtimeProducts]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle result click
  const handleResultClick = (result) => {
    if (result.type === "product") {
      navigate(`/product/${result._id}`);
    } else {
      navigate(`/category/${result.name.toLowerCase()}`);
    }
    setSearchQuery("");
    setSearchResults([]);
    setIsDropdownOpen(false);
  };

  // Clear search
  const handleClear = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search for cakes, desserts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery && setIsDropdownOpen(true)}
          className="w-[350px] pl-10 pr-10 py-2 border border-gray-300 rounded-full outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isDropdownOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-pink-500"></div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="max-h-[400px] overflow-y-auto">
              {searchResults.map((result, idx) => (
                <div key={idx}>
                  {result.type === "product" ? (
                    // Product Result
                    <button
                      onClick={() => handleResultClick(result)}
                      className="w-full px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-pink-50 transition-colors text-left flex items-center gap-3"
                    >
                      <img
                        src={result.image}
                        alt={result.name}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/48?text=Cake";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{result.name}</p>
                        <p className="text-sm text-gray-600">{result.category}</p>
                        <p className="text-sm font-semibold text-pink-600">₹{result.price}</p>
                      </div>
                    </button>
                  ) : (
                    // Category Result
                    <button
                      onClick={() => handleResultClick(result)}
                      className="w-full px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-pink-50 transition-colors text-left"
                    >
                      <p className="font-semibold text-gray-900">
                        📂 {result.name}
                      </p>
                      <p className="text-xs text-gray-500">Category</p>
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No results found for "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Separate component for cart link to properly handle context
const CartLink = () => {
  const { cartCount } = useContext(CartContext);
  
  return (
    <Link to="/cart" className="relative group text-xl cursor-pointer text-gray-700 hover:text-pink-600 transition-colors">
      <ShoppingCart size={24} />
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-3 bg-pink-400 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
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
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const menuItems = [
    "Cakes",
    "Cupcakes",
    "Pastries",
    "Breads",
    "Cookies",
    "Specialty",
    "Desserts"
  ];

  return (
    <nav className="bg-white border-b border-gray-200 font-sans fixed top-0 left-0 right-0 z-50">
      {/* Top Section */}
      <div className="flex items-center justify-between px-10 py-3">
        <Link to="/" className="text-xl font-bold text-gray-700 hover:text-pink-600 transition-colors">
          🧁 Cakes Man Bakery
        </Link>

        {/* Search */}
        <SearchBar />

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

      {/* Bottom Menu */}
      <div className="flex justify-center gap-8 py-3 bg-white">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={`/category/${item.toLowerCase()}`}
            className="px-2 py-1 text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors"
          >
            {item}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;