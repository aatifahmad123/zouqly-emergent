import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Shield, Leaf, Truck, ArrowRight } from 'lucide-react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import axios from 'axios'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const API = `${BACKEND_URL}/api`

const HomePage = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [testimonials, setTestimonials] = useState([])

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchTestimonials()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`)
      // Show first 4 products on homepage
      setProducts(response.data.slice(0, 4))
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`)
      setCategories(response.data.slice(0, 4))
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(`${API}/testimonials`)
      setTestimonials(response.data)
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4" data-testid="hero-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2D4A3E] leading-tight">
                Premium Quality
                <br />
                <span className="text-[#D4A017]">Dry Fruits</span>
              </h1>
              <p className="text-lg text-[#666666] leading-relaxed">
                Indulge in premium, handpicked dry fruits curated for purity, freshness, and exceptional flavor – delivered to you with care.
              </p>
              <div className="flex gap-4">
                <Link to="/shop">
                  <Button
                    size="lg"
                    className="bg-[#2D4A3E] text-white hover:bg-[#2D4A3E]/90 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    data-testid="shop-now-button"
                  >
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-[#2D4A3E] text-[#2D4A3E] hover:bg-[#2D4A3E]/10"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Premium Dry Fruits"
                className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-[#F3EFE6]" data-testid="features-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#2D4A3E] mb-4">
              Why Zouqly?
            </h2>
            <p className="text-[#666666] max-w-2xl mx-auto">
              We bring you the finest dry fruits with uncompromising quality and care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="h-8 w-8" />,
                title: 'Premium Quality',
                desc: 'Handpicked from the finest farms, rigorously quality-checked.'
              },
              {
                icon: <Leaf className="h-8 w-8" />,
                title: '100% Natural',
                desc: 'No artificial colours, preservatives, or additives.'
              },
              {
                icon: <Star className="h-8 w-8" />,
                title: 'Healthy & Nutritious',
                desc: 'Rich in essential vitamins, minerals & antioxidants.'
              },
              {
                icon: <Truck className="h-8 w-8" />,
                title: 'Flavor-Lock Freshness',
                desc: 'Airtight premium packaging to preserve crunch & taste.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 text-center hover:shadow-xl transition-shadow duration-300 bg-white rounded-2xl border-none">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F3EFE6] text-[#2D4A3E] mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-[#2D4A3E]">{feature.title}</h3>
                  <p className="text-sm text-[#666666]">{feature.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="py-16 px-4 bg-[#F3EFE6]" data-testid="featured-products-section">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#2D4A3E] mb-4">
                Featured Products
              </h2>
              <p className="text-[#666666]">Our most popular dry fruits</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white rounded-2xl border-none">
                      <div className="aspect-square bg-[#F3EFE6] overflow-hidden">
                        {product.image_url ? (
                          <img
                            src={product.image_url.includes('?') ? product.image_url : `${product.image_url}?auto=compress&cs=tinysrgb&w=600`}
                            alt={product.name}
                            loading="lazy"
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

            <div className="text-center mt-12">
              <Link to="/shop">
                <Button
                  size="lg"
                  className="bg-[#2D4A3E] text-white hover:bg-[#2D4A3E]/90 rounded-full"
                >
                  View All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-16 px-4 overflow-hidden bg-[#F3EFE6]" data-testid="testimonials-section">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#2D4A3E] mb-4">
                What Our Customers Say
              </h2>
            </div>

            <div className="relative">
              <style>{`
                @keyframes scroll-testimonials {
                  0% {
                    transform: translateX(0);
                  }
                  100% {
                    transform: translateX(-50%);
                  }
                }
                .testimonials-track {
                  animation: scroll-testimonials 40s linear infinite;
                  will-change: transform;
                }
                .testimonials-track:hover {
                  animation-play-state: paused;
                }
              `}</style>
              
              <div className="flex testimonials-track">
                {/* Duplicate testimonials for seamless loop */}
                {[...testimonials, ...testimonials].map((testimonial, index) => (
                  <div
                    key={`${testimonial.id}-${index}`}
                    className="flex-shrink-0 w-96 mx-4"
                  >
                    <Card className="p-6 bg-white rounded-2xl border-none shadow-lg h-full">
                      <div className="flex gap-1 mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-[#D4A017] text-[#D4A017]" />
                        ))}
                      </div>
                      <p className="text-[#666666] mb-4 leading-relaxed">{testimonial.comment}</p>
                      <p className="font-semibold text-[#2D4A3E]">{testimonial.name}</p>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}

export default HomePage
