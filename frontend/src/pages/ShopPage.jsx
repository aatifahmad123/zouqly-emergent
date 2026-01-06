import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import axios from 'axios'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const API = `${BACKEND_URL}/api`

const ShopPage = () => {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [selectedCategory])

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`)
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const url = selectedCategory ? `${API}/products?category_id=${selectedCategory}` : `${API}/products`
      const response = await axios.get(url)
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-4xl font-bold text-[#2D4A3E] mb-8" data-testid="shop-title">
          Shop Premium Dry Fruits
        </h1>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-3">
          <Button
            onClick={() => setSelectedCategory('')}
            variant={!selectedCategory ? 'default' : 'outline'}
            className={!selectedCategory ? 'bg-[#2D4A3E] text-white' : ''}
            data-testid="category-all"
          >
            All Products
          </Button>
          {categories.map(category => (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              className={selectedCategory === category.id ? 'bg-[#2D4A3E] text-white' : ''}
              data-testid={`category-${category.id}`}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D4A3E]"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#666666] text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="products-grid">
            {products.map((product, index) => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group"
                  data-testid={`product-card-${product.id}`}
                >
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white rounded-2xl border-none">
                    <div className="aspect-square bg-[#F3EFE6] overflow-hidden">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-[#2D4A3E] opacity-40">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-[#2D4A3E] mb-1">{product.name}</h3>
                      <p className="text-sm text-[#666666] mb-2">{product.weight}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-[#2D4A3E]">
                          ₹{product.price}
                        </span>
                        {product.tags && product.tags.includes('bestseller') && (
                          <span className="text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 rounded-full shadow-sm">
                            🔥 Bestseller
                          </span>
                        )}
                        {product.tags && product.tags.includes('trending') && (
                          <span className="text-sm font-bold text-white bg-gradient-to-r from-pink-500 to-rose-500 px-3 py-1 rounded-full shadow-sm">
                            📈 Trending
                          </span>
                        )}
                        {product.tags && product.tags.includes('new') && (
                          <span className="text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1 rounded-full shadow-sm">
                            ✨ New
                          </span>
                        )}
                        {product.tags && product.tags.includes('premium') && (
                          <span className="text-sm font-bold text-white bg-gradient-to-r from-violet-500 to-purple-500 px-3 py-1 rounded-full shadow-sm">
                            👑 Premium
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default ShopPage
