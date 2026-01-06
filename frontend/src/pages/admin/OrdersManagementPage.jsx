import React, { useEffect, useState } from 'react'
import Header from '../../components/layout/Header'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'sonner'
import { User, Package, Clock, CreditCard, Truck, Trash2 } from 'lucide-react'
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

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return
    }
    
    try {
      const token = await getToken()
      await axios.delete(`${API}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Order deleted!')
      fetchOrders()
    } catch (error) {
      toast.error('Failed to delete order')
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-4xl font-bold text-[#2D4A3E] mb-8">Manage Orders</h1>

        <div className="space-y-8">
          {orders.map((order) => (
            <Card key={order.id} className="rounded-2xl overflow-hidden shadow-sm">
              {/* Order Header */}
              <div className="bg-[#2D4A3E] text-white px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="text-sm opacity-80">Order</span>
                  <span className="font-mono font-semibold">#{order.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 opacity-80" />
                    <span>{order.created_at ? new Date(order.created_at).toLocaleString('en-IN', { 
                      timeZone: 'Asia/Kolkata',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    }) : 'N/A'}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteOrder(order.id)}
                    className="text-white hover:text-red-300 hover:bg-red-500/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-6">
                {/* Customer & Status Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  {/* Customer Details */}
                  <div className="bg-[#F3EFE6] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="h-5 w-5 text-[#2D4A3E]" />
                      <h4 className="font-semibold text-[#2D4A3E]">Customer Details</h4>
                    </div>
                    {order.customer_name && (
                      <>
                        <p className="text-sm text-[#666666]">Name</p>
                        <p className="font-medium text-[#2D4A3E] mb-2">{order.customer_name}</p>
                      </>
                    )}
                    <p className="text-sm text-[#666666]">Email</p>
                    <p className="font-medium text-[#2D4A3E] mb-2">{order.user_email}</p>
                    {order.customer_phone && (
                      <>
                        <p className="text-sm text-[#666666]">Phone</p>
                        <p className="font-medium text-[#2D4A3E] mb-2">{order.customer_phone}</p>
                      </>
                    )}
                    {order.customer_address && (
                      <>
                        <p className="text-sm text-[#666666]">Address</p>
                        <p className="font-medium text-[#2D4A3E] text-sm">{order.customer_address}</p>
                      </>
                    )}
                  </div>

                  {/* Payment Status */}
                  <div className="bg-[#F3EFE6] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CreditCard className="h-5 w-5 text-[#2D4A3E]" />
                      <h4 className="font-semibold text-[#2D4A3E]">Payment Status</h4>
                    </div>
                    <Select
                      value={order.payment_status}
                      onValueChange={(value) => updateStatus(order.id, 'payment', value)}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Payment Pending">Payment Pending</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Delivery Status */}
                  <div className="bg-[#F3EFE6] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Truck className="h-5 w-5 text-[#2D4A3E]" />
                      <h4 className="font-semibold text-[#2D4A3E]">Delivery Status</h4>
                    </div>
                    <Select
                      value={order.delivery_status}
                      onValueChange={(value) => updateStatus(order.id, 'delivery', value)}
                    >
                      <SelectTrigger className="bg-white">
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

                {/* Products Section */}
                <div className="border-t pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Package className="h-5 w-5 text-[#2D4A3E]" />
                    <h4 className="font-semibold text-[#2D4A3E]">Order Items</h4>
                  </div>
                  
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center justify-between bg-white border border-gray-100 rounded-lg p-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#F3EFE6] rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-[#2D4A3E] opacity-50" />
                          </div>
                          <div>
                            <p className="font-medium text-[#2D4A3E]">{item.product_name}</p>
                            <p className="text-sm text-[#666666]">Qty: {item.quantity} × ₹{item.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <p className="font-semibold text-[#2D4A3E]">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <span className="text-lg font-semibold text-[#2D4A3E]">Order Total</span>
                    <span className="text-2xl font-bold text-[#D4A017]">₹{order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default OrdersManagementPage
