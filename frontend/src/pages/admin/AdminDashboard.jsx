import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, ShoppingCart, FileText, Star, FolderOpen, Sparkles } from 'lucide-react'
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
    { title: 'Testimonials', icon: Star, path: '/admin/testimonials', count: stats.testimonials }
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
