import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import CartDrawer from './CartDrawer'
import Footer from './Footer'

export default function Layout() {
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      {!isLoginPage && <Header onCartOpen={setCartOpen} />}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      
      <main className={!isLoginPage ? 'flex-1 pt-20' : 'flex-1'}>
        <Outlet />
      </main>
      
      {!isLoginPage && <Footer />}
    </div>
  )
}