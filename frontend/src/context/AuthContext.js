import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(null)

  // Load user from localStorage on component mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedToken = localStorage.getItem('authToken')
        const savedUser = localStorage.getItem('user')
        
        if (savedToken && savedUser) {
          setToken(savedToken)
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error('AuthContext: Error loading saved data', error)
        // Clear corrupted data
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Login failed')
      }

      const data = await response.json()
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
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Registration failed')
      }

      const data = await response.json()
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

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    
    // Clear state
    setToken(null)
    setUser(null)
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.isAdmin === true,
    login,
    register,
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
