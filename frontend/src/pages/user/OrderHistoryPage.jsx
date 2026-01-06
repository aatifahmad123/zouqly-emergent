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
                      Order Placed: {order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      order.payment_status === 'Paid' 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.payment_status === 'Pending' ? 'Payment Pending' : order.payment_status}
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
