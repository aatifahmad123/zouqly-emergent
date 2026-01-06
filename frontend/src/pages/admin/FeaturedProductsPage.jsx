import React, { useEffect, useState } from 'react'
import Header from '../../components/layout/Header'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Star } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'sonner'
import axios from 'axios'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const API = `${BACKEND_URL}/api`

const FeaturedProductsPage = () => {
  const { getToken } = useAuth()
  const [products, setProducts] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`)
      setProducts(response.data)
      setFeaturedProducts(response.data.filter(p => p.is_featured === true))
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const toggleFeatured = async (productId, currentStatus) => {
    // Check if trying to add more than 4 featured products
    if (!currentStatus && featuredProducts.length >= 4) {
      toast.error('You can only have 4 featured products. Remove one first.')
      return
    }

    try {
      const token = await getToken()
      const product = products.find(p => p.id === productId)
      
      await axios.put(
        `${API}/products/${productId}`,
        { ...product, is_featured: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      toast.success(currentStatus ? 'Removed from featured' : 'Added to featured!')
      fetchProducts()
    } catch (error) {
      toast.error('Failed to update featured status')
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-4xl font-bold text-[#2D4A3E] mb-4">
          Featured Products
        </h1>
        <p className="text-[#666666] mb-8">
          Select up to 4 products to feature on the homepage. Featured products are highlighted for customers.
        </p>

        {/* Currently Featured */}
        {featuredProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="font-semibold text-xl text-[#2D4A3E] mb-4">
              Currently Featured ({featuredProducts.length}/4)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="p-4 rounded-2xl border-2 border-[#D4A017]">
                  <div className="aspect-square bg-[#F3EFE6] rounded-lg mb-3 overflow-hidden">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-[#2D4A3E] opacity-40">No Image</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-[#2D4A3E] mb-1">{product.name}</h3>
                  <p className="text-sm text-[#666666] mb-3">{product.weight} - ₹{product.price}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFeatured(product.id, true)}
                    className="w-full text-red-600 border-red-600 hover:bg-red-50"
                  >
                    Remove from Featured
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Products */}
        <div>
          <h2 className="font-semibold text-xl text-[#2D4A3E] mb-4">
            All Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.filter(p => !p.is_featured).map((product) => (
              <Card key={product.id} className="p-4 rounded-2xl">
                <div className="aspect-square bg-[#F3EFE6] rounded-lg mb-3 overflow-hidden">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-[#2D4A3E] opacity-40">No Image</span>
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-[#2D4A3E] mb-1">{product.name}</h3>
                <p className="text-sm text-[#666666] mb-3">{product.weight} - ₹{product.price}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleFeatured(product.id, false)}
                  className="w-full"
                  disabled={featuredProducts.length >= 4}
                >
                  <Star className="h-4 w-4 mr-1" />
                  Set as Featured
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeaturedProductsPage
