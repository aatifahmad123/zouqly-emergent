import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react'
import { Button } from '../ui/button'

const Header = () => {
  const { user, signOut, getUserRole } = useAuth()
  const { getTotalItems } = useCart()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isAdmin = user && getUserRole() === 'admin'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <header
      data-testid="header"
      className="sticky top-0 z-50 bg-white shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3" data-testid="logo-link">
            <img
              src="https://res.cloudinary.com/dbt85chus/image/upload/v1767717725/Screenshot_from_2026-01-06_22-10-01_qbudwp.png"
              alt="Zouqly Logo"
              className="h-12 w-12 rounded-xl object-cover"
            />
            <span className="font-display text-2xl font-bold text-[#2D4A3E]">
              Zouqly
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-[#2D4A3E] hover:text-[#D4A017] transition-colors"
              data-testid="nav-home"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="text-[#2D4A3E] hover:text-[#D4A017] transition-colors"
              data-testid="nav-shop"
            >
              Shop
            </Link>
            <Link
              to="/about"
              className="text-[#2D4A3E] hover:text-[#D4A017] transition-colors"
              data-testid="nav-about"
            >
              About
            </Link>
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="text-[#2D4A3E] hover:text-[#D4A017] transition-colors"
                data-testid="nav-admin"
              >
                Admin
              </Link>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {!isAdmin && (
                  <>
                    <Link to="/orders" data-testid="orders-link">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <User className="h-4 w-4" />
                        Orders
                      </Button>
                    </Link>
                    <Link to="/cart" data-testid="cart-link" className="relative">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <ShoppingCart className="h-4 w-4" />
                        Cart
                        {getTotalItems() > 0 && (
                          <span
                            className="absolute -top-1 -right-1 bg-[#D4A017] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                            data-testid="cart-count"
                          >
                            {getTotalItems()}
                          </span>
                        )}
                      </Button>
                    </Link>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2"
                  data-testid="logout-button"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" data-testid="login-link">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/signup" data-testid="signup-link">
                  <Button
                    size="sm"
                    className="bg-[#2D4A3E] text-white hover:bg-[#2D4A3E]/90 rounded-full"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-button"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col gap-4">
              <Link to="/" className="text-[#2D4A3E] hover:text-[#D4A017] transition-colors">
                Home
              </Link>
              <Link to="/shop" className="text-[#2D4A3E] hover:text-[#D4A017] transition-colors">
                Shop
              </Link>
              <Link to="/about" className="text-[#2D4A3E] hover:text-[#D4A017] transition-colors">
                About
              </Link>
              {isAdmin && (
                <Link to="/admin/dashboard" className="text-[#2D4A3E] hover:text-[#D4A017] transition-colors">
                  Admin
                </Link>
              )}
              <div className="border-t pt-4 flex flex-col gap-2">
                {user ? (
                  <>
                    {!isAdmin && (
                      <>
                        <Link to="/orders">
                          <Button variant="ghost" className="w-full justify-start gap-2">
                            <User className="h-4 w-4" />
                            Orders
                          </Button>
                        </Link>
                        <Link to="/cart" className="relative">
                          <Button variant="ghost" className="w-full justify-start gap-2">
                            <ShoppingCart className="h-4 w-4" />
                            Cart {getTotalItems() > 0 && `(${getTotalItems()})`}
                          </Button>
                        </Link>
                      </>
                    )}
                    <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-2">
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="ghost" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button className="w-full bg-[#2D4A3E] text-white hover:bg-[#2D4A3E]/90 rounded-full">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
