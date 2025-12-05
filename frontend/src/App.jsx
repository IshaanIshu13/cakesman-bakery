import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import { Toaster } from 'sonner'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import CategoryPage from './pages/CategoryPage'
import ProductDetailPage from './pages/ProductDetailPage'
import AdminDashboard from './pages/AdminDashboard'
import CheckoutPage from './pages/CheckoutPage'

function App() {
  return (
    <SocketProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
          <Toaster position="bottom-right" />
          <Routes>
            {/* Routes without Layout (Header/Footer) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Routes with Layout (Header/Footer) */}
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/product/:productId" element={<ProductDetailPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
            </Route>
          </Routes>
        </Router>
        </CartProvider>
      </AuthProvider>
    </SocketProvider>
  )
}

export default App