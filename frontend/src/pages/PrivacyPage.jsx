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
