import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../utils/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(null)
  const [error, setError] = useState(null)

  // Load user from localStorage and validate session on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem('authToken')
        const savedUser = localStorage.getItem('user')
        
        if (savedToken && savedUser) {
          setToken(savedToken)
          setUser(JSON.parse(savedUser))
          
          // Validate token with backend (skip for demo admin token)
          if (savedToken !== 'admin-token') {
            try {
              const data = await api.getMe()
              const userData = data.user || JSON.parse(savedUser)
              setUser(userData)
              localStorage.setItem('user', JSON.stringify(userData))
            } catch (err) {
              console.warn('AuthContext: Token validation failed during init')
              console.warn('ℹ️ Keeping user logged in - they will be redirected on next protected API call if needed')
              // IMPORTANT: Do NOT clear the user here - let them stay logged in
              // The auth interceptor will handle actual token expiry
              // This prevents spurious logouts due to temporary API failures
            }
          }
        }
      } catch (error) {
        console.error('AuthContext: Error loading saved data', error)
        // Only clear corrupted data, not valid sessions
        setError('Failed to restore session')
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const data = await api.login(email, password)
      const { token, user } = data

      // Save to localStorage
      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      // Update state
      setToken(token)
      setUser(user)
      
      return { success: true, user }
    } catch (error) {
      console.error('AuthContext: Login error', error)
      throw error
    }
  }

  const register = async (name, email, password, phone = '') => {
    try {
      const data = await api.register(name, email, password, phone)
      const { token, user } = data

      // Save to localStorage
      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      // Update state
      setToken(token)
      setUser(user)
      
      return { success: true, user }
    } catch (error) {
      console.error('AuthContext: Registration error', error)
      throw error
    }
  }

  const loginAdmin = (adminEmail) => {
    try {
      // Create admin user object
      const adminUser = {
        _id: 'admin',
        email: adminEmail,
        name: 'Administrator',
        isAdmin: true,
        role: 'admin'
      }

      // Save to localStorage
      localStorage.setItem('authToken', 'admin-token')
      localStorage.setItem('user', JSON.stringify(adminUser))
      
      // Update state
      setToken('admin-token')
      setUser(adminUser)
      
      return { success: true, user: adminUser }
    } catch (error) {
      console.error('AuthContext: Admin login error', error)
      throw error
    }
  }

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    
    // Clear state
    setToken(null)
    setUser(null)
    setError(null)
  }

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.isAdmin === true || user?.role === 'admin',
    login,
    register,
    loginAdmin,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
