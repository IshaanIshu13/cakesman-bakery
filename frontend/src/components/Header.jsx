import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Search, User, Menu, X, LogOut } from 'lucide-react'
import { CATEGORIES } from '../data/categories'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { toast } from 'sonner'

export default function Header({ onCartOpen }) {
  const navigate = useNavigate()
  const { cartCount } = useCart()
  const { user, logout, isAdmin } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <>
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
            >
              <span className="text-3xl">🧁</span>
              <span className="font-bold text-xl text-amber-900 hidden sm:inline">
                Cakes Man Bakery
              </span>
              <span className="font-bold text-lg text-amber-900 sm:hidden">
                CMB
              </span>
            </div>

            {/* Center - Search (hidden on mobile) */}
            <div className="hidden md:flex flex-1 max-w-sm mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search cakes, desserts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-pink-50 border border-pink-200 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 text-sm"
                />
              </div>
            </div>

            {/* Right - Icons */}
            <div className="flex items-center gap-4">
              {/* Cart Icon */}
              <button
                onClick={() => onCartOpen?.(true)}
                className="relative p-2 hover:bg-pink-50 rounded-lg transition"
              >
                <ShoppingCart size={24} className="text-amber-900" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Profile / Login Button (hidden on mobile) */}
              <div className="hidden md:flex relative">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-pink-50 rounded-lg transition text-amber-900 font-semibold"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      {user.name}
                    </button>

                    {/* User Dropdown Menu */}
                    {userMenuOpen && (
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-pink-100 rounded-lg shadow-lg overflow-hidden z-50">
                        <div className="px-4 py-3 border-b border-pink-100">
                          <p className="text-sm text-gray-600">{user.email}</p>
                          {isAdmin && (
                            <span className="inline-block mt-1 px-2 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                              Admin
                            </span>
                          )}
                        </div>
                        
                        {isAdmin && (
                          <button
                            onClick={() => {
                              navigate('/admin')
                              setUserMenuOpen(false)
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-pink-50 text-amber-900 font-semibold transition flex items-center gap-2"
                          >
                            📊 Admin Dashboard
                          </button>
                        )}
                        
                        <button
                          onClick={() => {
                            navigate('/')
                            setUserMenuOpen(false)
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-pink-50 text-amber-900 transition flex items-center gap-2"
                        >
                          👤 My Profile
                        </button>

                        <button
                          onClick={() => {
                            handleLogout()
                            setUserMenuOpen(false)
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 font-semibold transition flex items-center gap-2 border-t border-pink-100"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-pink-50 rounded-lg transition text-amber-900 font-semibold"
                  >
                    <User size={20} />
                    Login
                  </button>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-pink-50 rounded-lg transition"
              >
                {mobileMenuOpen ? (
                  <X size={24} className="text-amber-900" />
                ) : (
                  <Menu size={24} className="text-amber-900" />
                )}
              </button>
            </div>
          </div>

          {/* Desktop Navigation Bar */}
          <div className="hidden md:flex items-center gap-1 border-t border-pink-100 h-16">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => navigate(`/category/${category.id}`)}
                className="flex items-center gap-2 px-4 py-2 text-amber-900 hover:text-pink-600 transition font-medium"
              >
                <span className="text-lg">{category.emoji}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed top-20 left-0 right-0 bg-white border-b border-pink-100 z-30 md:hidden">
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
            {/* Mobile Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-pink-50 border border-pink-200 focus:outline-none focus:border-pink-400 text-sm"
              />
            </div>

            {/* Mobile Categories */}
            {CATEGORIES.map((category) => (
              <div key={category.id}>
                <button
                  onClick={() => {
                    navigate(`/category/${category.id}`)
                    setMobileMenuOpen(false)
                  }}
                  className="w-full text-left px-4 py-3 border-b border-pink-100 text-amber-900 font-semibold hover:text-pink-600 transition flex items-center gap-2"
                >
                  <span className="text-xl">{category.emoji}</span>
                  {category.name}
                </button>
              </div>
            ))}

            {/* Mobile User Section */}
            {user ? (
              <>
                <div className="px-4 py-3 bg-pink-50 rounded-lg">
                  <p className="text-sm font-semibold text-amber-900">Welcome, {user.name}!</p>
                  <p className="text-xs text-gray-600">{user.email}</p>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => {
                      navigate('/admin')
                      setMobileMenuOpen(false)
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-100 text-amber-900 rounded-lg font-semibold transition"
                  >
                    📊 Admin Dashboard
                  </button>
                )}

                <button
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-100 text-red-600 rounded-lg font-semibold transition"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  navigate('/login')
                  setMobileMenuOpen(false)
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg font-semibold mt-4"
              >
                <User size={20} />
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}

