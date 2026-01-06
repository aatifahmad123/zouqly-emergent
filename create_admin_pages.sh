#!/bin/bash

# Checkout Page
cat > /app/frontend/src/pages/user/CheckoutPage.jsx << 'EOF'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'sonner'
import axios from 'axios'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const API = `${BACKEND_URL}/api`

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { cart, getTotalPrice, clearCart } = useCart()
  const { getToken } = useAuth()
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')

  const handlePlaceOrder = async () => {
    if (!address || !phone) {
      toast.error('Please fill all fields')
      return
    }

    setLoading(true)
    try {
      const token = await getToken()
      const orderItems = cart.map(item => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price
      }))

      await axios.post(
        `${API}/orders`,
        {
          items: orderItems,
          total_amount: getTotalPrice()
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      toast.success('Order placed successfully!')
      clearCart()
      navigate('/orders')
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error('Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-4xl font-bold text-[#2D4A3E] mb-8">Checkout</h1>

        <div className="space-y-6">
          <Card className="p-6 rounded-2xl">
            <h2 className="font-semibold text-xl text-[#2D4A3E] mb-4">Delivery Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2D4A3E] mb-2">
                  Delivery Address
                </label>
                <Input
                  placeholder="Enter your full address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  data-testid="address-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D4A3E] mb-2">
                  Phone Number
                </label>
                <Input
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  data-testid="phone-input"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-2xl">
            <h2 className="font-semibold text-xl text-[#2D4A3E] mb-4">Order Summary</h2>
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-[#666666]">
                    {item.name} x {item.quantity}
                  </span>
                  <span className="font-medium text-[#2D4A3E]">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span className="text-[#2D4A3E]">Total</span>
                <span className="text-[#2D4A3E]" data-testid="checkout-total">
                  ₹{getTotalPrice().toFixed(2)}
                </span>
              </div>
            </div>
          </Card>

          <Button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full bg-[#2D4A3E] text-white hover:bg-[#2D4A3E]/90 rounded-full"
            data-testid="place-order-button"
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default CheckoutPage
EOF

# Order History Page
cat > /app/frontend/src/pages/user/OrderHistoryPage.jsx << 'EOF'
import React, { useEffect, useState } from 'react'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import { Card } from '../../components/ui/card'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const API = `${BACKEND_URL}/api`

const OrderHistoryPage = () => {
  const { getToken } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const token = await getToken()
      const response = await axios.get(`${API}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOrders(response.data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-4xl font-bold text-[#2D4A3E] mb-8" data-testid="orders-title">
          My Orders
        </h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D4A3E]"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#666666] text-lg">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="p-6 rounded-2xl" data-testid={`order-${order.id}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-[#666666]">
                      Order ID: {order.id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-[#666666]">
                      Date: {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      order.payment_status === 'Paid' 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.payment_status}
                    </span>
                    <span className={`inline-block ml-2 px-3 py-1 rounded-full text-xs font-medium ${
                      order.delivery_status === 'Delivered'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {order.delivery_status}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-[#666666]">
                        {item.product_name} x {item.quantity}
                      </span>
                      <span className="font-medium text-[#2D4A3E]">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 flex justify-between font-bold">
                  <span className="text-[#2D4A3E]">Total</span>
                  <span className="text-[#2D4A3E]">₹{order.total_amount.toFixed(2)}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default OrderHistoryPage
EOF

# Admin Dashboard
cat > /app/frontend/src/pages/admin/AdminDashboard.jsx << 'EOF'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, ShoppingCart, FileText, Star, FolderOpen } from 'lucide-react'
import Header from '../../components/layout/Header'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const API = `${BACKEND_URL}/api`

const AdminDashboard = () => {
  const { getToken } = useAuth()
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    categories: 0,
    testimonials: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = await getToken()
      const headers = { Authorization: `Bearer ${token}` }
      
      const [products, orders, categories, testimonials] = await Promise.all([
        axios.get(`${API}/products`),
        axios.get(`${API}/orders`, { headers }),
        axios.get(`${API}/categories`),
        axios.get(`${API}/testimonials`)
      ])

      setStats({
        products: products.data.length,
        orders: orders.data.length,
        categories: categories.data.length,
        testimonials: testimonials.data.length
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const menuItems = [
    { title: 'Products', icon: Package, path: '/admin/products', count: stats.products },
    { title: 'Categories', icon: FolderOpen, path: '/admin/categories', count: stats.categories },
    { title: 'Orders', icon: ShoppingCart, path: '/admin/orders', count: stats.orders },
    { title: 'Testimonials', icon: Star, path: '/admin/testimonials', count: stats.testimonials },
    { title: 'Content', icon: FileText, path: '/admin/content', count: 0 }
  ]

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-4xl font-bold text-[#2D4A3E] mb-8" data-testid="admin-dashboard-title">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Card className="p-6 hover:shadow-xl transition-shadow cursor-pointer rounded-2xl" data-testid={`admin-card-${item.title.toLowerCase()}`}>
                <div className="flex items-center justify-between mb-4">
                  <item.icon className="h-8 w-8 text-[#2D4A3E]" />
                  <span className="text-3xl font-bold text-[#2D4A3E]">{item.count}</span>
                </div>
                <h3 className="font-semibold text-lg text-[#2D4A3E]">{item.title}</h3>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
EOF

echo "Created Checkout, Order History, and Admin Dashboard"
