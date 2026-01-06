import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, MapPin, Instagram } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-[#2D4A3E] text-white mt-20" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="https://res.cloudinary.com/dbt85chus/image/upload/v1767717725/Screenshot_from_2026-01-06_22-10-01_qbudwp.png"
                alt="Zouqly Logo"
                className="h-10 w-10 rounded-xl"
              />
              <span className="font-display text-2xl font-bold">Zouqly</span>
            </div>
            <p className="text-sm text-white/80">
              Where Quality Meets Expectation & Taste
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-white/80 hover:text-white transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/80 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-white/80 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/80">
                  A108, Okhla Vihar,<br />New Delhi – 110025
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <a href="mailto:customercare@zouqly.in" className="text-sm text-white/80 hover:text-white">
                  customercare@zouqly.in
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <a href="mailto:info.hubofall@gmail.com" className="text-sm text-white/80 hover:text-white">
                  info.hubofall@gmail.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
            <a
              href="https://instagram.com/zouqly.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <Instagram className="h-5 w-5" />
              @zouqly.in
            </a>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 text-center text-sm text-white/60">
          <p>© {new Date().getFullYear()} Zouqly. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer