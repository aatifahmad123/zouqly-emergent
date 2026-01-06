#!/bin/bash

# About Page
cat > /app/frontend/src/pages/AboutPage.jsx << 'EOF'
import React from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-display text-4xl font-bold text-[#2D4A3E] mb-8">About Zouqly</h1>
        <div className="prose prose-lg">
          <p className="text-[#666666] leading-relaxed mb-4">
            At Zouqly, we believe in bringing you the finest quality dry fruits that meet both your expectations and taste. Our commitment to excellence drives us to source only the best, handpicked products from trusted farms around the world.
          </p>
          <p className="text-[#666666] leading-relaxed">
            Every product we offer is carefully selected to ensure maximum freshness, taste, and nutritional value. We take pride in our rigorous quality checks and airtight packaging that preserves the natural goodness of our dry fruits.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AboutPage
EOF

# Privacy Page  
cat > /app/frontend/src/pages/PrivacyPage.jsx << 'EOF'
import React from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-display text-4xl font-bold text-[#2D4A3E] mb-8">Privacy Policy</h1>
        <div className="prose prose-lg space-y-4 text-[#666666]">
          <p>This privacy policy outlines how Zouqly collects, uses, and protects your information.</p>
          <h2 className="font-display text-2xl font-bold text-[#2D4A3E] mt-8 mb-4">Information Collection</h2>
          <p>We collect information that you provide directly to us when creating an account or placing an order.</p>
          <h2 className="font-display text-2xl font-bold text-[#2D4A3E] mt-8 mb-4">Use of Information</h2>
          <p>Your information is used to process orders, improve our services, and communicate with you about your purchases.</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default PrivacyPage
EOF

# Cart Page
cat > /app/frontend/src/pages/user/CartPage.jsx << 'EOF'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag } from 'lucide-react'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { useCart } from '../../context/CartContext'

const CartPage = () => {
  const navigate = useNavigate()
  const { cart, updateQuantity, removeFromCart, getTotalPrice } = useCart()

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-20">
            <ShoppingBag className="h-20 w-20 mx-auto text-[#2D4A3E] opacity-40 mb-4" />
            <h2 className="font-display text-2xl font-bold text-[#2D4A3E] mb-4">Your cart is empty</h2>
            <Link to="/shop">
              <Button className="bg-[#2D4A3E] text-white hover:bg-[#2D4A3E]/90 rounded-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-4xl font-bold text-[#2D4A3E] mb-8" data-testid="cart-title">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.id} className="p-4 rounded-2xl" data-testid={`cart-item-${item.id}`}>
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg bg-[#F3EFE6] overflow-hidden flex-shrink-0">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-[#2D4A3E] opacity-40 text-xs">No Image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#2D4A3E]">{item.name}</h3>
                    <p className="text-sm text-[#666666] mb-2">{item.weight}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          data-testid={`decrease-${item.id}`}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center" data-testid={`quantity-${item.id}`}>
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          data-testid={`increase-${item.id}`}
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700"
                        data-testid={`remove-${item.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-[#2D4A3E]" data-testid={`item-total-${item.id}`}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div>
            <Card className="p-6 rounded-2xl sticky top-24">
              <h3 className="font-display text-xl font-bold text-[#2D4A3E] mb-4">Order Summary</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-[#666666]">Subtotal</span>
                  <span className="font-semibold text-[#2D4A3E]" data-testid="cart-subtotal">
                    ₹{getTotalPrice().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-[#2D4A3E]">Total</span>
                  <span className="text-[#2D4A3E]" data-testid="cart-total">
                    ₹{getTotalPrice().toFixed(2)}
                  </span>
                </div>
              </div>
              <Button
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#2D4A3E] text-white hover:bg-[#2D4A3E]/90 rounded-full"
                data-testid="checkout-button"
              >
                Proceed to Checkout
              </Button>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default CartPage
EOF

echo "Created About, Privacy, and Cart pages"
