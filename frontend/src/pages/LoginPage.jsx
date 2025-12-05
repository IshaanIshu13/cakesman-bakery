import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { api } from '../utils/api'
import { toast } from 'sonner'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loginType, setLoginType] = useState('customer') // 'customer' or 'admin'
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (loginType === 'admin') {
      // Admin validation
      if (!adminEmail) newErrors.adminEmail = 'Email is required'
      else if (!validateEmail(adminEmail)) newErrors.adminEmail = 'Please enter a valid email'
      
      if (!adminPassword) newErrors.adminPassword = 'Password is required'
    } else {
      // Customer validation
      if (!email) newErrors.email = 'Email is required'
      else if (!validateEmail(email)) newErrors.email = 'Please enter a valid email'
      
      if (!password) newErrors.password = 'Password is required'
      else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters'
      
      if (isSignUp) {
        if (!name) newErrors.name = 'Name is required'
        if (!phone) newErrors.phone = 'Phone is required'
        else if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
          newErrors.phone = 'Please enter a valid 10-digit phone number'
        }
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAdminLogin = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    try {
      // Admin credentials check (demo)
      if (adminEmail === 'admin@cakesman.com' && adminPassword === 'admin123') {
        localStorage.setItem('userRole', 'admin')
        localStorage.setItem('userEmail', adminEmail)
        toast.success('Admin access granted!', {
          description: 'Redirecting to admin dashboard...'
        })
        setTimeout(() => navigate('/admin'), 1000)
      } else {
        toast.error('Admin login failed', {
          description: 'Invalid admin credentials.'
        })
        setErrors({ adminSubmit: 'Invalid admin credentials.' })
      }
    } catch (error) {
      const errorMsg = error.message || 'An error occurred'
      toast.error(errorMsg)
      setErrors({ adminSubmit: errorMsg })
    } finally {
      setLoading(false)
    }
  }

  const handleCustomerLogin = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    try {
      let response
      
      if (isSignUp) {
        response = await api.register(name, email, password, phone)
      } else {
        response = await api.login(email, password)
      }
      
      if (response.token) {
        localStorage.setItem('userRole', 'customer')
        localStorage.setItem('userEmail', email)
        toast.success(isSignUp ? 'Account created successfully!' : 'Logged in successfully!')
        setTimeout(() => navigate('/'), 1000)
      } else if (response.error) {
        toast.error(response.error)
        setErrors({ submit: response.error })
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'An error occurred'
      toast.error(errorMsg)
      setErrors({ submit: errorMsg })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = loginType === 'admin' ? handleAdminLogin : handleCustomerLogin

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-yellow-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="text-center py-8 px-4 bg-gradient-to-r from-pink-50 to-yellow-50">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">🧁 Cakes Man Bakery</h1>
          <p className="text-gray-600">Sign in to continue</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => {
              setLoginType('customer')
              setErrors({})
              setAdminEmail('')
              setAdminPassword('')
            }}
            className={`flex-1 py-3 px-4 text-center font-semibold transition ${
              loginType === 'customer'
                ? 'border-b-2 border-pink-500 text-pink-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            👤 Customer
          </button>
          <button
            onClick={() => {
              setLoginType('admin')
              setErrors({})
              setEmail('')
              setPassword('')
              setName('')
              setPhone('')
              setIsSignUp(false)
            }}
            className={`flex-1 py-3 px-4 text-center font-semibold transition ${
              loginType === 'admin'
                ? 'border-b-2 border-amber-500 text-amber-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 inline mr-1" />
            Admin
          </button>
        </div>

        <div className="p-8">
          {/* Error Message */}
          {(errors.submit || errors.adminSubmit) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {errors.submit || errors.adminSubmit}
            </div>
          )}

          {/* Admin Login Form */}
          {loginType === 'admin' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-6 h-6 text-amber-600" />
                </div>
                <h2 className="text-lg font-semibold text-amber-900 mb-2">Admin Access</h2>
                <p className="text-xs text-gray-600 mb-3">Manage products and orders</p>
                <div className="bg-amber-50 border border-amber-200 rounded p-2 text-xs text-amber-800">
                  <p className="font-semibold mb-1">Demo Credentials:</p>
                  <p>Email: admin@cakesman.com</p>
                  <p>Password: admin123</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-2">Admin Email</label>
                <input 
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@cakesman.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.adminEmail
                      ? 'border-red-300 focus:ring-red-200'
                      : 'border-gray-300 focus:border-amber-400 focus:ring-amber-100'
                  }`}
                />
                {errors.adminEmail && <p className="text-red-600 text-xs mt-1">{errors.adminEmail}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-2">Admin Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition pr-12 ${
                      errors.adminPassword
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-300 focus:border-amber-400 focus:ring-amber-100'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.adminPassword && <p className="text-red-600 text-xs mt-1">{errors.adminPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Admin Sign In'}
              </button>
            </form>
          ) : (
            /* Customer Login Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-semibold text-amber-900 mb-2">Full Name</label>
                  <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                      errors.name
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-300 focus:border-pink-400 focus:ring-pink-100'
                    }`}
                  />
                  {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-2">Email</label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.email
                      ? 'border-red-300 focus:ring-red-200'
                      : 'border-gray-300 focus:border-pink-400 focus:ring-pink-100'
                  }`}
                />
                {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-sm font-semibold text-amber-900 mb-2">Phone</label>
                  <input 
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                      errors.phone
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-300 focus:border-pink-400 focus:ring-pink-100'
                    }`}
                  />
                  {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-2">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition pr-12 ${
                      errors.password
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-300 focus:border-pink-400 focus:ring-pink-100'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full px-8 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:from-pink-600 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
              </button>

              {/* Toggle Sign Up / Login */}
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button
                    onClick={() => {
                      setIsSignUp(!isSignUp)
                      setErrors({})
                      setEmail('')
                      setPassword('')
                      setName('')
                      setPhone('')
                    }}
                    className="text-pink-600 hover:text-pink-700 font-semibold transition"
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
