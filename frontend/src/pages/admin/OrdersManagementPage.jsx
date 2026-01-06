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
