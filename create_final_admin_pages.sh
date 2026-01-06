#!/bin/bash

# Orders Management
cat > /app/frontend/src/pages/admin/OrdersManagementPage.jsx << 'EOF'
import React, { useEffect, useState } from 'react'
import Header from '../../components/layout/Header'
import { Card } from '../../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'sonner'
import axios from 'axios'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const API = `${BACKEND_URL}/api`

const OrdersManagementPage = () => {
  const { getToken } = useAuth()
  const [orders, setOrders] = useState([])

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
      console.error('Error:', error)
    }
  }

  const updateStatus = async (orderId, field, value) => {
    try {
      const token = await getToken()
      const params = new URLSearchParams()
      if (field === 'payment') params.append('payment_status', value)
      if (field === 'delivery') params.append('delivery_status', value)
      
      await axios.put(`${API}/orders/${orderId}?${params}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Order updated!')
      fetchOrders()
    } catch (error) {
      toast.error('Failed to update order')
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-4xl font-bold text-[#2D4A3E] mb-8">Manage Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="p-6 rounded-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-[#666666]">Order ID</p>
                  <p className="font-medium text-[#2D4A3E]">{order.id.slice(0, 8)}</p>
                </div>
                <div>
                  <p className="text-sm text-[#666666]">Customer</p>
                  <p className="font-medium text-[#2D4A3E]">{order.user_email}</p>
                </div>
                <div>
                  <p className="text-sm text-[#666666]">Total</p>
                  <p className="font-medium text-[#2D4A3E]">₹{order.total_amount.toFixed(2)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm text-[#666666] block mb-2">Payment Status</label>
                  <Select
                    value={order.payment_status}
                    onValueChange={(value) => updateStatus(order.id, 'payment', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-[#666666] block mb-2">Delivery Status</label>
                  <Select
                    value={order.delivery_status}
                    onValueChange={(value) => updateStatus(order.id, 'delivery', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Order Placed">Order Placed</SelectItem>
                      <SelectItem value="Packed">Packed</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-[#2D4A3E] mb-2">Items</h4>
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm py-1">
                    <span>{item.product_name} x {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default OrdersManagementPage
EOF

# Testimonials Management
cat > /app/frontend/src/pages/admin/TestimonialsManagementPage.jsx << 'EOF'
import React, { useEffect, useState } from 'react'
import Header from '../../components/layout/Header'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Plus, Trash2, Star } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'sonner'
import axios from 'axios'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const API = `${BACKEND_URL}/api`

const TestimonialsManagementPage = () => {
  const { getToken } = useAuth()
  const [testimonials, setTestimonials] = useState([])
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', rating: 5, comment: '' })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(`${API}/testimonials`)
      setTestimonials(response.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = await getToken()
      await axios.post(`${API}/testimonials`, {
        ...formData,
        rating: parseInt(formData.rating)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Testimonial added!')
      fetchTestimonials()
      setOpen(false)
      setFormData({ name: '', rating: 5, comment: '' })
    } catch (error) {
      toast.error('Failed to add testimonial')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      const token = await getToken()
      await axios.delete(`${API}/testimonials/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Testimonial deleted!')
      fetchTestimonials()
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-display text-4xl font-bold text-[#2D4A3E]">Manage Testimonials</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#2D4A3E] text-white rounded-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Testimonial
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Testimonial</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Customer Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
                <Input
                  placeholder="Rating (1-5)"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: e.target.value})}
                  required
                />
                <Textarea
                  placeholder="Comment"
                  value={formData.comment}
                  onChange={(e) => setFormData({...formData, comment: e.target.value})}
                  required
                />
                <Button type="submit" className="w-full bg-[#2D4A3E] text-white">
                  Add Testimonial
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6 rounded-2xl">
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#D4A017] text-[#D4A017]" />
                ))}
              </div>
              <p className="text-[#666666] mb-3">{testimonial.comment}</p>
              <p className="font-semibold text-[#2D4A3E] mb-4">{testimonial.name}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(testimonial.id)}
                className="text-red-600 hover:text-red-700 w-full"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TestimonialsManagementPage
EOF

# Content Management
cat > /app/frontend/src/pages/admin/ContentManagementPage.jsx << 'EOF'
import React, { useState, useEffect } from 'react'
import Header from '../../components/layout/Header'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Textarea } from '../../components/ui/textarea'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'sonner'
import axios from 'axios'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const API = `${BACKEND_URL}/api`

const ContentManagementPage = () => {
  const { getToken } = useAuth()
  const [aboutContent, setAboutContent] = useState('')
  const [privacyContent, setPrivacyContent] = useState('')

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const [about, privacy] = await Promise.all([
        axios.get(`${API}/content/about`),
        axios.get(`${API}/content/privacy`)
      ])
      setAboutContent(about.data.content || '')
      setPrivacyContent(privacy.data.content || '')
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const updateContent = async (page, content) => {
    try {
      const token = await getToken()
      await axios.put(`${API}/content/${page}`, { page, content }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success(`${page} page updated!`)
    } catch (error) {
      toast.error('Failed to update content')
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-4xl font-bold text-[#2D4A3E] mb-8">Manage Content</h1>

        <div className="space-y-6">
          <Card className="p-6 rounded-2xl">
            <h2 className="font-semibold text-xl text-[#2D4A3E] mb-4">About Us Page</h2>
            <Textarea
              value={aboutContent}
              onChange={(e) => setAboutContent(e.target.value)}
              rows={10}
              className="mb-4"
            />
            <Button
              onClick={() => updateContent('about', aboutContent)}
              className="bg-[#2D4A3E] text-white"
            >
              Update About Us
            </Button>
          </Card>

          <Card className="p-6 rounded-2xl">
            <h2 className="font-semibold text-xl text-[#2D4A3E] mb-4">Privacy Policy Page</h2>
            <Textarea
              value={privacyContent}
              onChange={(e) => setPrivacyContent(e.target.value)}
              rows={10}
              className="mb-4"
            />
            <Button
              onClick={() => updateContent('privacy', privacyContent)}
              className="bg-[#2D4A3E] text-white"
            >
              Update Privacy Policy
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ContentManagementPage
EOF

echo "Created Orders, Testimonials, and Content Management pages"
