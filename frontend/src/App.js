import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { Toaster } from './components/ui/sonner'

// Public pages
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductDetailPage from './pages/ProductDetailPage'
import AboutPage from './pages/AboutPage'
import PrivacyPage from './pages/PrivacyPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

// User pages
import CartPage from './pages/user/CartPage'
import CheckoutPage from './pages/user/CheckoutPage'
import OrderHistoryPage from './pages/user/OrderHistoryPage'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import ProductsManagementPage from './pages/admin/ProductsManagementPage'
import CategoriesManagementPage from './pages/admin/CategoriesManagementPage'
import OrdersManagementPage from './pages/admin/OrdersManagementPage'
import TestimonialsManagementPage from './pages/admin/TestimonialsManagementPage'

import '@/App.css'

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, getUserRole } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D4A3E]"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && getUserRole() !== 'admin') {
    return <Navigate to="/shop" replace />
  }

  return children
}

const AppRoutes = () => {
  const { user, loading, getUserRole } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D4A3E]"></div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/login" element={user ? <Navigate to={getUserRole() === 'admin' ? '/admin/dashboard' : '/shop'} /> : <LoginPage />} />
      <Route path="/signup" element={user ? <Navigate to={getUserRole() === 'admin' ? '/admin/dashboard' : '/shop'} /> : <SignupPage />} />

      {/* User routes */}
      <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />

      {/* Admin routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/products" element={<ProtectedRoute requireAdmin><ProductsManagementPage /></ProtectedRoute>} />
      <Route path="/admin/categories" element={<ProtectedRoute requireAdmin><CategoriesManagementPage /></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute requireAdmin><OrdersManagementPage /></ProtectedRoute>} />
      <Route path="/admin/testimonials" element={<ProtectedRoute requireAdmin><TestimonialsManagementPage /></ProtectedRoute>} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="App">
            <AppRoutes />
            <Toaster position="top-center" />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App