// bestsellers.jsx
import React from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";

const products = [
  {
    id: 1,
    tag: "Bestseller",
    image: "https://i.ibb.co/xstD4qq/chocolate-cake.jpg",
    title: "Chocolate Birthday Cake",
    desc: "Rich chocolate layers with creamy frosting",
    rating: 4.8,
    reviews: 124,
    price: 799,
    oldPrice: 999,
  },
  {
    id: 2,
    tag: "Premium",
    image: "https://i.ibb.co/XL5jSYb/red-velvet.jpg",
    title: "Red Velvet Delight",
    desc: "Classic red velvet with cream cheese frosting",
    rating: 4.9,
    reviews: 89,
    price: 699,
    oldPrice: 799,
  },
  {
    id: 3,
    tag: "Wedding Special",
    image: "https://i.ibb.co/jwkg2DD/wedding-cake.jpg",
    title: "Elegant Wedding Cake",
    desc: "Multi-tier elegant design for your special day",
    rating: 5,
    reviews: 45,
    price: 2499,
    oldPrice: 2999,
  },
  {
    id: 4,
    tag: "Pack of 6",
    image: "https://i.ibb.co/XCs28dV/cupcakes.jpg",
    title: "Colorful Cupcakes",
    desc: "Assorted flavored cupcakes with colorful frosting",
    rating: 4.7,
    reviews: 203,
    price: 399,
    oldPrice: 499,
  },
  {
    id: 5,
    tag: "Customer Favorite",
    image: "https://i.ibb.co/sg3VSMg/cheesecake.jpg",
    title: "Classic Cheesecake",
    desc: "Creamy New York style cheesecake",
    rating: 4.6,
    reviews: 156,
    price: 549,
    oldPrice: 649,
  },
  {
    id: 6,
    tag: "New",
    image: "https://i.ibb.co/JFL8HQJ/birthday-special.jpg",
    title: "Birthday Special",
    desc: "Perfect celebration cake with candles included",
    rating: 4.8,
    reviews: 78,
    price: 899,
    oldPrice: 1099,
  },
];

export default function Bestsellers() {
  return (
    <section className="py-12 px-6 md:px-12 bg-white">
      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-brown-800 mb-3">
          Shop Our Bestsellers
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Classic iconic cakes, pastries, tea cakes, and more. These customer
          favorites are loved by thousands.
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            whileHover={{ scale: 1.03 }}
            className="bg-white shadow-md rounded-xl overflow-hidden relative group"
          >
            {/* Tag */}
            <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
              {item.tag}
            </span>

            {/* Wishlist */}
            <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-pink-100">
              <Heart className="w-4 h-4 text-gray-700" />
            </button>

            {/* Image */}
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-56 object-cover"
            />

            {/* Content */}
            <div className="p-4">
              <div className="flex items-center gap-1 text-yellow-500 text-sm font-semibold">
                ⭐ {item.rating}{" "}
                <span className="text-gray-500">({item.reviews})</span>
              </div>
              <h3 className="mt-2 text-lg font-bold text-gray-800">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm mt-1 mb-3">{item.desc}</p>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-pink-600 font-bold text-lg">
                    ₹{item.price}
                  </span>
                  <span className="line-through text-gray-400 text-sm ml-2">
                    ₹{item.oldPrice}
                  </span>
                </div>
                <button className="bg-pink-600 text-white p-2 rounded-full hover:bg-pink-700 shadow-md">
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="text-center mt-10">
        <button className="px-6 py-3 bg-pink-600 text-white rounded-full shadow hover:bg-pink-700 transition">
          View All Products
        </button>
      </div>
    </section>
  );
}
