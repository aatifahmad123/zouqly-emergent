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
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [deliveryOption, setDeliveryOption] = useState('within-delhi')

  const deliveryCharges = {
    'within-delhi': 50,
    'ncr': 70,
    'outside-ncr': 90
  }

  const getTotalWithDelivery = () => {
    return getTotalPrice() + deliveryCharges[deliveryOption]
  }

  const handlePlaceOrder = async () => {
    if (!name || !address || !phone) {
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
          total_amount: getTotalWithDelivery(),
          delivery_charge: deliveryCharges[deliveryOption],
          delivery_type: deliveryOption,
          customer_name: name,
          customer_address: address,
          customer_phone: phone
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
                  Full Name
                </label>
                <Input
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  data-testid="name-input"
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
              <div>
                <label className="block text-sm font-medium text-[#2D4A3E] mb-2">
                  Delivery Address
                </label>
                <Input
                  placeholder="Enter your complete address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  data-testid="address-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D4A3E] mb-2">
                  Delivery Location
                </label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-[#F3EFE6] transition-colors">
                    <input
                      type="radio"
                      name="delivery"
                      value="within-delhi"
                      checked={deliveryOption === 'within-delhi'}
                      onChange={(e) => setDeliveryOption(e.target.value)}
                      className="mr-3"
                    />
                    <span className="flex-1">Within Delhi</span>
                    <span className="font-semibold text-[#2D4A3E]">₹50</span>
                  </label>
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-[#F3EFE6] transition-colors">
                    <input
                      type="radio"
                      name="delivery"
                      value="ncr"
                      checked={deliveryOption === 'ncr'}
                      onChange={(e) => setDeliveryOption(e.target.value)}
                      className="mr-3"
                    />
                    <span className="flex-1">Outside Delhi but within NCR</span>
                    <span className="font-semibold text-[#2D4A3E]">₹70</span>
                  </label>
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-[#F3EFE6] transition-colors">
                    <input
                      type="radio"
                      name="delivery"
                      value="outside-ncr"
                      checked={deliveryOption === 'outside-ncr'}
                      onChange={(e) => setDeliveryOption(e.target.value)}
                      className="mr-3"
                    />
                    <span className="flex-1">Outside NCR</span>
                    <span className="font-semibold text-[#2D4A3E]">₹90</span>
                  </label>
                </div>
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
              <div className="border-t pt-3">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#666666]">Subtotal</span>
                  <span className="font-medium text-[#2D4A3E]">
                    ₹{getTotalPrice().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#666666]">Delivery Charge</span>
                  <span className="font-medium text-[#2D4A3E]">
                    ₹{deliveryCharges[deliveryOption]}
                  </span>
                </div>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span className="text-[#2D4A3E]">Total</span>
                <span className="text-[#2D4A3E]" data-testid="checkout-total">
                  ₹{getTotalWithDelivery().toFixed(2)}
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
