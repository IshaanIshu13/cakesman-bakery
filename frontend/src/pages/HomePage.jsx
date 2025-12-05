import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Star, Clock, ArrowRight } from 'lucide-react'
import { CATEGORIES, SAMPLE_PRODUCTS } from '../data/categories'

export default function HomePage() {
  const navigate = useNavigate()

  // ============ HERO SECTION ============
  const HeroSection = () => (
    <div className="bg-gradient-to-br from-pink-50 via-white to-yellow-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-200 rounded-full w-fit">
              <span className="text-xl">✨</span>
              <span className="text-sm font-semibold text-pink-800">Freshly Baked Daily</span>
            </div>

            {/* Heading */}
            <div className="space-y-2">
              <h1 className="text-5xl lg:text-6xl font-bold text-amber-900 leading-tight">
                Sweet Moments,<br />
                <span className="text-pink-500">Perfect Cakes</span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-700 max-w-lg">
              From custom birthday cakes to elegant wedding masterpieces, we create delicious memories that bring joy to every celebration.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate('/category/cakes')}
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:from-pink-600 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Order Now
              </button>
              <button 
                onClick={() => navigate('/category/cakes')}
                className="px-8 py-4 border-2 border-pink-300 text-pink-700 rounded-full font-semibold hover:bg-pink-50 transition-all duration-300"
              >
                View Menu
              </button>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { icon: '🚚', title: 'Same Day Delivery', subtitle: 'Order before 2 PM' },
                { icon: '🎨', title: 'Custom Designs', subtitle: 'Your vision, our craft' },
                { icon: '👨‍🍳', title: 'Fresh Daily', subtitle: 'Made with love' },
              ].map((feature, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-sm p-4 border border-pink-100">
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <h4 className="font-semibold text-amber-900 text-sm">{feature.title}</h4>
                  <p className="text-xs text-gray-600">{feature.subtitle}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative">
            <div className="relative h-96 lg:h-full rounded-2xl overflow-hidden bg-gradient-to-br from-pink-100 to-pink-50 shadow-2xl flex items-center justify-center">
              <div className="text-9xl animate-bounce">🎂</div>
              
              {/* Rating Badge */}
              <div className="absolute top-6 right-6 bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-amber-900">4.9/5</span>
              </div>

              {/* Price Badge */}
              <div className="absolute bottom-6 left-6 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full px-6 py-3 text-white shadow-lg">
                <p className="text-xs opacity-80">Starting from</p>
                <p className="text-2xl font-bold">₹299</p>
              </div>

              {/* Decorative Circles */}
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-pink-200 rounded-full opacity-20 blur-2xl"></div>
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-yellow-200 rounded-full opacity-20 blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // ============ CATEGORIES SECTION ============
  const CategoriesSection = () => (
    <div className="bg-gradient-to-br from-pink-50 via-white to-yellow-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-amber-900 mb-4">
            Explore Our Collection
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto text-lg">
            From birthday celebrations to luxury weddings, find the perfect cake for every special moment
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {CATEGORIES.map((category) => (
            <div
              key={category.id}
              onClick={() => navigate(`/category/${category.id}`)}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:border-pink-300 border border-transparent transition-all duration-300 p-6 text-center cursor-pointer group"
            >
              {/* Icon */}
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {category.emoji}
              </div>

              {/* Name */}
              <h3 className="font-bold text-amber-900 text-lg mb-2 group-hover:text-pink-600 transition-colors">
                {category.name}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {category.description}
              </p>

              {/* Subcategory Count */}
              <p className="text-sm font-semibold text-pink-600 flex items-center justify-center gap-1 group-hover:gap-2 transition-all">
                {category.subcategories.length} varieties
                <ArrowRight size={16} />
              </p>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <button 
            onClick={() => navigate('/category/cakes')}
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2"
          >
            View Full Menu
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  )

  // ============ BESTSELLERS SECTION ============
  const BestsellersSection = () => (
    <div className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-amber-900 mb-2">
            Our Bestsellers
          </h2>
          <p className="text-gray-600 text-lg">
            Most loved cakes by our customers
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SAMPLE_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Image Container */}
              <div className="relative h-64 bg-gradient-to-br from-pink-100 to-pink-50 overflow-hidden flex items-center justify-center">
                {/* Badges */}
                {product.discount > 0 && (
                  <div className="absolute top-3 left-3 bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg z-10">
                    {product.discount}% OFF
                  </div>
                )}
                {product.featured && (
                  <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg z-10">
                    ⭐ Featured
                  </div>
                )}

                {/* Product Image */}
                <div className="text-8xl group-hover:scale-110 transition-transform duration-500">
                  {product.image}
                </div>

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <button className="px-6 py-2 bg-white text-pink-600 rounded-full font-semibold hover:bg-pink-50 transition-all">
                    Customize & Order
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5">
                {/* Top Row */}
                <div className="flex justify-between items-start mb-2 text-xs">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock size={14} />
                    {product.deliveryTime}
                  </div>
                  {product.rating && (
                    <div className="flex items-center gap-1 text-gray-700">
                      <Star size={14} className="fill-yellow-400 text-yellow-400" />
                      {product.rating}
                      <span className="text-gray-500">({product.reviews})</span>
                    </div>
                  )}
                </div>

                {/* Product Name */}
                <h3 className="font-semibold text-amber-900 text-base mb-1 line-clamp-1 group-hover:text-pink-600 transition-colors">
                  {product.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.tags.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="text-xs bg-pink-50 text-pink-600 px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bottom Row - Price and Button */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-600">Starting from</p>
                    <p className="text-2xl font-bold text-pink-600">
                      ₹{(product.basePrice * (1 - product.discount / 100)).toFixed(0)}
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg transition-all text-sm">
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // ============ WHY CHOOSE US SECTION ============
  const WhyChooseUsSection = () => (
    <div className="bg-pink-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-amber-900">
            Why Choose Cakes Man Bakery?
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: '🌾', title: 'Premium Quality Ingredients', desc: 'We use only the finest, freshest ingredients' },
            { icon: '👨‍🍳', title: 'Expert Bakers', desc: 'Skilled artisans with years of experience' },
            { icon: '🎨', title: '100% Customizable', desc: 'Your imagination, our creation' },
            { icon: '🚚', title: 'Timely Delivery', desc: 'Same-day and next-day delivery available' },
            { icon: '✨', title: 'Hygiene First', desc: 'ISO certified kitchen with strict quality control' },
            { icon: '💬', title: '24/7 Support', desc: 'We\'re here to help anytime' },
          ].map((feature, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="font-bold text-amber-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // ============ REVIEWS SECTION ============
  const ReviewsSection = () => (
    <div className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-amber-900 mb-2">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 text-lg">
            ⭐ 4.9 out of 5 based on 2,450+ reviews
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              text: 'Absolutely stunning! The unicorn cake for my daughter\'s birthday was perfect. Everyone was amazed!',
              name: 'Priya S.',
              order: 'Unicorn Cake',
              avatar: 'PS'
            },
            {
              text: 'Best wedding cake ever! Beautiful design and delicious taste. Highly recommended!',
              name: 'Rahul & Meera',
              order: '3-Tier Wedding Cake',
              avatar: 'RM'
            },
            {
              text: 'The photo print came out crystal clear. Great quality and taste!',
              name: 'Amit K.',
              order: 'Photo Print Cake',
              avatar: 'AK'
            },
            {
              text: 'Corporate order was delivered on time and looked professional. Client loved it!',
              name: 'Sarah M.',
              order: 'Company Logo Cake',
              avatar: 'SM'
            },
            {
              text: 'Eggless red velvet was so moist and flavorful. Will order again!',
              name: 'Deepa R.',
              order: 'Red Velvet Cake',
              avatar: 'DR'
            },
            {
              text: 'The gaming theme cake was a hit at my son\'s party. Thank you!',
              name: 'Vikram P.',
              order: 'PUBG Theme Cake',
              avatar: 'VP'
            },
          ].map((review, idx) => (
            <div key={idx} className="bg-white border-2 border-pink-100 rounded-xl p-6 hover:border-pink-300 hover:shadow-md transition-all duration-300">
              {/* Stars */}
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-700 italic mb-4 line-clamp-4">
                "{review.text}"
              </p>

              {/* Reviewer Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center font-semibold text-pink-700">
                  {review.avatar}
                </div>
                <div>
                  <p className="font-semibold text-amber-900 text-sm">{review.name}</p>
                  <p className="text-xs text-gray-600">Ordered {review.order}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <BestsellersSection />
      <WhyChooseUsSection />
      <ReviewsSection />
    </>
  )
}
