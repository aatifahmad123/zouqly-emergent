import React, { useEffect, useState } from 'react'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import { Card } from '../../components/ui/card'
import { useAuth } from '../../context/AuthContext'
import { Package, Clock, CreditCard, Truck } from 'lucide-react'
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

  const getPaymentStatusStyle = (status) => {
    if (status === 'Paid') {
      return 'bg-green-100 text-green-700 border-green-200'
    }
    return 'bg-yellow-100 text-yellow-700 border-yellow-200'
  }

  const getDeliveryStatusStyle = (status) => {
    if (status === 'Delivered') {
      return 'bg-green-100 text-green-700 border-green-200'
    }
    if (status === 'Shipped') {
      return 'bg-blue-100 text-blue-700 border-blue-200'
    }
    if (status === 'Packed') {
      return 'bg-purple-100 text-purple-700 border-purple-200'
    }
    return 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const formatPaymentStatus = (status) => {
    if (status === 'Pending') return 'Payment Pending'
    return status
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
            <Package className="h-16 w-16 text-[#2D4A3E] opacity-30 mx-auto mb-4" />
            <p className="text-[#666666] text-lg">No orders yet</p>
            <p className="text-[#999999] text-sm mt-2">Your order history will appear here</p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <Card key={order.id} className="rounded-2xl overflow-hidden shadow-sm" data-testid={`order-${order.id}`}>
                {/* Order Header */}
                <div className="bg-[#2D4A3E] text-white px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-sm opacity-80">Order</span>
                    <span className="font-mono font-semibold">#{order.id.slice(0, 8).toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 opacity-80" />
                    <span>{order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}</span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Status Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Payment Status */}
                    <div className="bg-[#F3EFE6] rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <CreditCard className="h-5 w-5 text-[#2D4A3E]" />
                        <h4 className="font-semibold text-[#2D4A3E]">Payment Status</h4>
                      </div>
                      <span className={`inline-block px-4 py-2 rounded-lg text-sm font-medium border ${getPaymentStatusStyle(order.payment_status)}`}>
                        {formatPaymentStatus(order.payment_status)}
                      </span>
                    </div>

                    {/* Delivery Status */}
                    <div className="bg-[#F3EFE6] rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Truck className="h-5 w-5 text-[#2D4A3E]" />
                        <h4 className="font-semibold text-[#2D4A3E]">Delivery Status</h4>
                      </div>
                      <span className={`inline-block px-4 py-2 rounded-lg text-sm font-medium border ${getDeliveryStatusStyle(order.delivery_status)}`}>
                        {order.delivery_status}
                      </span>
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
        )}
      </div>
      <Footer />
    </div>
  )
}

export default OrderHistoryPage
