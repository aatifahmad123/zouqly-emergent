import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext({})

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const { user } = useAuth()
  const [cart, setCart] = useState([])

  // Get cart key specific to the user
  const getCartKey = () => {
    return user ? `zouqly_cart_${user.id}` : 'zouqly_cart_guest'
  }

  // Load cart when user changes
  useEffect(() => {
    const cartKey = getCartKey()
    const savedCart = localStorage.getItem(cartKey)
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    } else {
      setCart([]) // Clear cart when switching users
    }
  }, [user])

  // Save cart when it changes
  useEffect(() => {
    const cartKey = getCartKey()
    localStorage.setItem(cartKey, JSON.stringify(cart))
  }, [cart, user])

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prevCart, { ...product, quantity }]
    })
  }

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}