import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, Check } from 'lucide-react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { useCart } from '../context/CartContext'
import { toast } from 'sonner'
import axios from 'axios'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const API = `${BACKEND_URL}/api`

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API}/products/${id}`)
      setProduct(response.data)
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
    toast.success(`${product.name} added to cart!`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D4A3E]"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#666666] text-lg mb-4">Product not found</p>
          <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden rounded-2xl border-none">
              <div className="aspect-square bg-[#F3EFE6]">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-[#2D4A3E] opacity-40">No Image</span>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {product.tags && product.tags.includes('bestseller') && (
              <span className="inline-block text-sm font-accent text-[#D4A017] bg-[#D4A017]/10 px-3 py-1 rounded-full">
                Bestseller
              </span>
            )}
            
            <h1 className="font-display text-4xl font-bold text-[#2D4A3E]" data-testid="product-name">
              {product.name}
            </h1>
            
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#2D4A3E]" data-testid="product-price">
                ₹{product.price}
              </span>
              <span className="text-[#666666]">{product.weight}</span>
            </div>

            <p className="text-[#666666] leading-relaxed" data-testid="product-description">
              {product.description}
            </p>

            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg text-[#2D4A3E] mb-3">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-[#2D4A3E] flex-shrink-0 mt-0.5" />
                      <span className="text-[#666666]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <label className="font-medium text-[#2D4A3E]">Quantity:</label>
                <div className="flex items-center gap-2 border border-[#2D4A3E] rounded-full overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 bg-white hover:bg-[#F3EFE6] text-[#2D4A3E] font-bold transition-colors"
                    data-testid="decrease-quantity"
                  >
                    −
                  </button>
                  <span className="px-6 font-medium text-[#2D4A3E]" data-testid="quantity-display">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 bg-white hover:bg-[#F3EFE6] text-[#2D4A3E] font-bold transition-colors"
                    data-testid="increase-quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button
                size="lg"
                onClick={handleAddToCart}
                className="w-full bg-[#2D4A3E] text-white hover:bg-[#2D4A3E]/90 rounded-full"
                data-testid="add-to-cart-button"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ProductDetailPage
