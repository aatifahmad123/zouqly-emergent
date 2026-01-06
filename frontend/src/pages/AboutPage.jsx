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
