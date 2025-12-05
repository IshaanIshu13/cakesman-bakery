import React from 'react'
import { Heart, Instagram, Facebook, Twitter, MessageCircle, Phone, Mail, MapPin } from 'lucide-react'
import { CATEGORIES } from '../data/categories'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-amber-50 to-yellow-50 border-t-2 border-pink-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl"></span>
              <h3 className="font-bold text-lg text-amber-900">Cakes Man Bakery</h3>
            </div>
            <p className="text-gray-700 text-sm mb-4 leading-relaxed">
              Freshly baked cakes and desserts made with love. Customized designs for every celebration. Same-day delivery available in your city.
            </p>
            <div className="flex gap-3">
              <button className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center hover:bg-pink-600 transition hover:scale-110" title="Instagram" aria-label="Follow on Instagram">
                <Instagram size={20} />
              </button>
              <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition hover:scale-110" title="Facebook" aria-label="Follow on Facebook">
                <Facebook size={20} />
              </button>
              <button className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition hover:scale-110" title="Twitter" aria-label="Follow on Twitter">
                <Twitter size={20} />
              </button>
              <button 
                onClick={() => window.open('https://wa.me/918808140339', '_blank')}
                className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition hover:scale-110" 
                title="WhatsApp" 
                aria-label="Contact on WhatsApp"
              >
                <MessageCircle size={20} />
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-amber-900 mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-3">
              <li><button onClick={() => window.scrollTo(0, 0)} className="text-gray-700 hover:text-pink-600 transition font-medium text-sm">Home</button></li>
              <li><button className="text-gray-700 hover:text-pink-600 transition font-medium text-sm">All Categories</button></li>
              <li><button className="text-gray-700 hover:text-pink-600 transition font-medium text-sm">Bestsellers</button></li>
              <li><button className="text-gray-700 hover:text-pink-600 transition font-medium text-sm">About Us</button></li>
              <li><button className="text-gray-700 hover:text-pink-600 transition font-medium text-sm">Contact</button></li>
              <li><button className="text-gray-700 hover:text-pink-600 transition font-medium text-sm">FAQ</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-amber-900 mb-4 text-lg">Categories</h4>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 5).map((category) => (
                <li key={category.id}>
                  <a href={`#category/${category.id}`} className="text-gray-700 hover:text-pink-600 transition font-medium text-sm flex items-center gap-2">
                    <span>{category.emoji}</span>{category.name}
                  </a>
                </li>
              ))}
              {CATEGORIES.length > 5 && (
                <li><button className="text-pink-600 hover:text-pink-700 transition font-semibold text-sm">+ {CATEGORIES.length - 5} More </button></li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-amber-900 mb-4 text-lg">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <Phone size={20} className="text-pink-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-amber-900">Phone</p>
                  <a href="tel:+918808140339" className="text-gray-700 hover:text-pink-600 transition text-sm">+91 88081 40339</a>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <Mail size={20} className="text-pink-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-amber-900">Email</p>
                  <a href="mailto:hello@cakesman.com" className="text-gray-700 hover:text-pink-600 transition text-sm">hello@cakesman.com</a>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <MapPin size={20} className="text-pink-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-amber-900">Address</p>
                  <p className="text-gray-700 text-sm">Beside Ambrosia Resturant<br />Sita Ram Mandir, Sita Dham, Varanasi<br />India</p>
                </div>
              </div>
              <button 
                onClick={() => window.open('https://wa.me/918808140339', '_blank')}
                className="w-full mt-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />WhatsApp
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-pink-100 my-8"></div>

        {/* Map Section */}
        <div className="mb-12">
          <h3 className="font-bold text-lg text-amber-900 mb-6 text-center">Visit Us</h3>
          <div className="w-full h-80 rounded-lg overflow-hidden shadow-lg border-2 border-pink-100">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              title="Cakesman Bakery Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1669.0833715876322!2d82.96482280516095!3d25.27710916484316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e3246b9f46e17%3A0x633fc89231c5bf8d!2sCAKESMAN%20BAKERY!5e0!3m2!1sen!2sin!4v1764770265139!5m2!1sen!2sin"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            ></iframe>
          </div>
          <p className="text-center text-gray-700 text-sm mt-4">📍 Beside Ambrosia Restaurant, Sita Ram Mandir, Sita Dham, Varanasi</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left">
          <p className="text-gray-700 text-sm mb-4 sm:mb-0">&copy; {currentYear} Cakes Man Bakery. All rights reserved.</p>
          <div className="flex items-center justify-center gap-1 text-sm text-gray-700">
            Made with <Heart size={16} className="text-pink-600 fill-pink-600" /> in India
          </div>
          <div className="flex gap-4 text-sm mt-4 sm:mt-0">
            <button className="text-gray-700 hover:text-pink-600 transition">Privacy Policy</button>
            <span className="text-gray-400">|</span>
            <button className="text-gray-700 hover:text-pink-600 transition">Terms & Conditions</button>
            <span className="text-gray-400">|</span>
            <button className="text-gray-700 hover:text-pink-600 transition">Refund Policy</button>
          </div>
        </div>
      </div>
    </footer>
  )
}
