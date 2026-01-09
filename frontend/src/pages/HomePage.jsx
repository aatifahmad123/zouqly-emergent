import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Shield, Leaf, Truck, ArrowRight } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchTestimonials();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${API}/products`);
            // Show first 4 products on homepage
            setProducts(response.data.slice(0, 4));
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API}/categories`);
            setCategories(response.data.slice(0, 4));
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchTestimonials = async () => {
        try {
            const response = await axios.get(`${API}/testimonials`);
            setTestimonials(response.data);
        } catch (error) {
            console.error("Error fetching testimonials:", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7]">
            <Header />

            {/* 🔥 Winter Offer Banner */}
<section className="bg-gradient-to-r from-[#2D4A3E] to-[#3F6B59] px-4">
    <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
    >
        {/* Text */}
        <div className="text-white text-sm sm:text-base font-medium">
            ❄️ <span className="font-bold">30% OFF Winter Discount</span> on
            <span className="font-semibold"> Premium Mix Dry Fruits</span>
        </div>

        {/* CTA */}
        <Link to="/shop">
            <Button
                size="sm"
                className="bg-white text-[#2D4A3E] hover:bg-white/90 rounded-full font-semibold shadow-md transition-all duration-300"
            >
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </Link>
    </motion.div>
</section>


            {/* Hero Section */}
            <section
                className="relative overflow-hidden py-20 px-4"
                data-testid="hero-section"
            >
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
                                <span className="text-[#D4A017]">
                                    Dry Fruits
                                </span>
                            </h1>
                            <p className="text-lg text-[#666666] leading-relaxed">
                                Indulge in premium, handpicked dry fruits
                                curated for purity, freshness, and exceptional
                                flavor – delivered to you with care.
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
                                src="https://res.cloudinary.com/dbt85chus/image/upload/v1767941119/image-one_ymlgjm.png"
                                alt="Premium Dry Fruits"
                                className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section
                className="py-16 px-4 bg-[#F3EFE6]"
                data-testid="features-section"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#2D4A3E] mb-4">
                            Why Zouqly?
                        </h2>
                        <p className="text-[#666666] max-w-2xl mx-auto">
                            We bring you the finest dry fruits with
                            uncompromising quality and care
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <Shield className="h-8 w-8" />,
                                title: "Premium Quality",
                                desc: "Handpicked from the finest farms, rigorously quality-checked.",
                            },
                            {
                                icon: <Leaf className="h-8 w-8" />,
                                title: "100% Natural",
                                desc: "No artificial colours, preservatives, or additives.",
                            },
                            {
                                icon: <Star className="h-8 w-8" />,
                                title: "Healthy & Nutritious",
                                desc: "Rich in essential vitamins, minerals & antioxidants.",
                            },
                            {
                                icon: <Truck className="h-8 w-8" />,
                                title: "Flavor-Lock Freshness",
                                desc: "Airtight premium packaging to preserve crunch & taste.",
                            },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                                viewport={{ once: true }}
                            >
                                <Card className="p-8 text-center hover:shadow-xl transition-shadow duration-300 bg-white rounded-2xl border-none">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F3EFE6] text-[#2D4A3E] mb-4">
                                        {feature.icon}
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2 text-[#2D4A3E]">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-[#666666]">
                                        {feature.desc}
                                    </p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            {products.length > 0 && (
                <section
                    className="py-16 px-4 bg-[#F3EFE6]"
                    data-testid="featured-products-section"
                >
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#2D4A3E] mb-4">
                                Featured Products
                            </h2>
                            <p className="text-[#666666]">
                                Our most popular dry fruits
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {products.map((product, index) => (
                                <Link
                                    key={product.id}
                                    to={`/product/${product.id}`}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: index * 0.1,
                                        }}
                                        viewport={{ once: true }}
                                        className="group"
                                    >
                                        <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white rounded-2xl border-none">
                                            <div className="aspect-square bg-[#F3EFE6] overflow-hidden">
                                                {product.image_url ? (
                                                    <img
                                                        src={
                                                            product.image_url.includes(
                                                                "?"
                                                            )
                                                                ? product.image_url
                                                                : `${product.image_url}?auto=compress&cs=tinysrgb&w=600`
                                                        }
                                                        alt={product.name}
                                                        loading="lazy"
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <span className="text-[#2D4A3E] opacity-40">
                                                            No Image
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-semibold text-[#2D4A3E] mb-1">
                                                    {product.name}
                                                </h3>
                                                <p className="text-sm text-[#666666] mb-2">
                                                    {product.weight}
                                                </p>
                                                <div className="flex items-start justify-between gap-2">
                                                    {/* Price */}
                                                    <span className="text-lg font-bold text-[#2D4A3E] shrink-0">
                                                        ₹{product.price}
                                                    </span>

                                                    {/* Tags */}
                                                    <div className="flex flex-wrap gap-2 justify-end">
                                                        {product.tags?.includes(
                                                            "bestseller"
                                                        ) && (
                                                            <span className="text-xs font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
                                                                🔥 Bestseller
                                                            </span>
                                                        )}

                                                        {product.tags?.includes(
                                                            "trending"
                                                        ) && (
                                                            <span className="text-xs font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
                                                                📈 Trending
                                                            </span>
                                                        )}

                                                        {product.tags?.includes(
                                                            "new"
                                                        ) && (
                                                            <span className="text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
                                                                ✨ New
                                                            </span>
                                                        )}

                                                        {product.tags?.includes(
                                                            "premium"
                                                        ) && (
                                                            <span className="text-xs font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-500 px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
                                                                👑 Premium
                                                            </span>
                                                        )}
                                                    </div>
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

{/* Testimonials */}
{testimonials.length > 0 && (
  <section className="py-16 bg-gradient-to-b from-white to-[rgb(45,74,62)]/10">
    <div className="container mx-auto px-4 mb-12 text-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-bold mb-4"
      >
        What Our Customers Say
      </motion.h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Real stories from people who love Zouqly
      </p>
    </div>

    {/* Scrolling Container */}
    <div className="overflow-hidden group">
      <motion.div
        className="flex gap-6"
        animate={{
          x: ["0%", "-33.333%"],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: testimonials.length * 5,
            ease: "linear",
          },
        }}
        style={{ width: "max-content" }}
        whileHover={{ animationPlayState: "paused" }}
      >
        {/* Triple testimonials for seamless loop */}
        {[...testimonials, ...testimonials, ...testimonials].map((testimonial, index) => (
          <Card
            key={`testimonial-${index}`}
            className="w-[320px] md:w-[420px] flex-shrink-0 p-6 bg-white shadow-lg"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <p className="text-gray-700 mb-6 italic leading-relaxed">
              "{testimonial.comment}"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[rgb(45,74,62)] to-[rgb(35,60,50)] flex items-center justify-center text-white font-semibold">
                {testimonial.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {testimonial.name}
                </p>
                <p className="text-sm text-gray-500">Verified Customer</p>
              </div>
            </div>
          </Card>
        ))}
      </motion.div>
    </div>
  </section>
)}



            {/* FAQ Section */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-4xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#2D4A3E] mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-[#666666]">
                            Find answers to common questions about our products and services
                        </p>
                    </motion.div>

                    <div className="space-y-4">
                        {[
                            {
                                question: "What are the health benefits of eating dry fruits?",
                                answer: "Dry fruits are nutrient-dense foods packed with essential vitamins, minerals, fiber, and healthy fats. They help boost immunity, improve digestion, support heart health, provide energy, strengthen bones, and promote healthy skin and hair. Regular consumption in moderation can also help manage weight and reduce the risk of chronic diseases."
                            },
                            {
                                question: "How many dry fruits should I eat daily?",
                                answer: "A handful (about 30-40 grams) of mixed dry fruits per day is generally recommended. This typically includes 4-5 almonds, 2-3 walnuts, 2-3 cashews, and a few raisins or dates. However, the quantity may vary based on individual dietary needs and health goals."
                            },
                            {
                                question: "When is the best time to eat dry fruits?",
                                answer: "The best time to consume dry fruits is in the morning or as a mid-morning snack. Eating them on an empty stomach or soaking them overnight (especially almonds and raisins) can enhance nutrient absorption. They also make excellent pre-workout or post-workout snacks for energy."
                            },
                            {
                                question: "Should I soak dry fruits before eating?",
                                answer: "Soaking certain dry fruits like almonds, raisins, and figs overnight can make them easier to digest and enhance nutrient absorption. Soaking helps remove phytic acid and tannins, making the nutrients more bioavailable. However, nuts like cashews and pistachios can be consumed without soaking."
                            },
                            {
                                question: "How should I store dry fruits to keep them fresh?",
                                answer: "Store dry fruits in airtight containers in a cool, dry place away from direct sunlight. For longer shelf life, you can refrigerate them, especially during summer months. Properly stored dry fruits can last for several months while maintaining their freshness and nutritional value."
                            },
                            {
                                question: "Can diabetics eat dry fruits?",
                                answer: "Yes, diabetics can eat dry fruits in moderation, but should be cautious with naturally sweet ones like dates, raisins, and figs. Nuts like almonds, walnuts, and pistachios have a lower glycemic index and are better options. It's always best to consult with a healthcare provider for personalized advice."
                            },
                            {
                                question: "Are roasted and salted dry fruits healthy?",
                                answer: "Plain, unsalted, and unroasted dry fruits are the healthiest option. Roasted and salted varieties may contain added oils, sodium, and preservatives that reduce their nutritional benefits. If you prefer roasted nuts, choose lightly roasted or dry-roasted options without added salt."
                            },
                            {
                                question: "Can dry fruits help with weight loss?",
                                answer: "When consumed in moderation, dry fruits can support weight loss by providing satiety, reducing cravings, and offering sustained energy. They're rich in protein and healthy fats that keep you full longer. However, portion control is key as they are calorie-dense."
                            },
                            {
                                question: "What's the difference between dry fruits and dried fruits?",
                                answer: "Dry fruits typically refer to nuts and seeds like almonds, cashews, walnuts, and pistachios. Dried fruits are fresh fruits that have been dehydrated, such as raisins, dried apricots, dates, and figs. Both are nutritious but have different nutritional profiles."
                            },
                            {
                                question: "Are organic dry fruits better than regular ones?",
                                answer: "Organic dry fruits are grown without synthetic pesticides, fertilizers, or chemicals, making them a cleaner option. While both organic and regular dry fruits offer nutritional benefits, organic varieties may have fewer chemical residues and are often considered more environmentally sustainable."
                            }
                        ].map((item, index) => (
                            <FAQItem 
                                key={index} 
                                question={item.question} 
                                answer={item.answer} 
                            />
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

// FAQ Item Component
function FAQItem({ question, answer }) {
    const [isOpen, setIsOpen] = React.useState(false);
    
    return (
        <motion.div 
            className="border border-gray-200 rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
        >
            <button
                className={`w-full px-6 py-4 text-left flex justify-between items-center transition-colors ${isOpen ? 'bg-[#2D4A3E] text-white' : 'bg-white hover:bg-gray-50 text-[#2D4A3E]'}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-medium text-lg">{question}</span>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <svg 
                        className={`w-5 h-5 transition-transform ${isOpen ? 'text-white' : 'text-[#2D4A3E]'}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </motion.span>
            </button>
            <motion.div
                initial={false}
                animate={{
                    height: isOpen ? 'auto' : 0,
                    opacity: isOpen ? 1 : 0,
                    padding: isOpen ? '1.5rem' : '0 1.5rem',
                }}
                className="bg-white overflow-hidden"
                transition={{ duration: 0.3 }}
            >
                <p className="text-gray-600">{answer}</p>
            </motion.div>
        </motion.div>
    );
};

export default HomePage;
