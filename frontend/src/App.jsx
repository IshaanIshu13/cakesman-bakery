import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute'
import { Toaster } from 'sonner'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import CategoryPage from './pages/CategoryPage'
import ProductDetailPage from './pages/ProductDetailPage'
import AdminDashboard from './pages/AdminDashboard'
import CheckoutPage from './pages/CheckoutPage'
import Cart from './pages/Cart'
import CustomerProfile from './pages/CustomerProfile'

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
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />

            {/* Routes with Layout (Header/Footer) */}
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/product/:productId" element={<ProductDetailPage />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <CustomerProfile />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </Router>
        </CartProvider>
      </AuthProvider>
    </SocketProvider>
  )
}

export default App