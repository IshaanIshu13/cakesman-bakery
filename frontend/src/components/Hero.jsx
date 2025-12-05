import React from "react";

const Hero = () => {
  return (
    <section className="flex items-center justify-between px-24 py-16 bg-pink-50">
      <div className="flex-1">
        <h1 className="text-4xl font-bold text-pink-700 mb-4">
          Delicious Cakes, Freshly Baked
        </h1>
        <p className="text-lg text-brown-800 mb-6">
          Celebrate every moment with Cakesman Bakery
        </p>
        <button className="bg-pink-700 text-white px-8 py-3 rounded-full text-base transition-colors hover:bg-pink-800">
          Order Now
        </button>
      </div>
      <div>
        <img 
          src="/images/hero-cake.jpg" 
          alt="Hero Cake" 
          className="max-w-[400px]"
        />
      </div>
    </section>
  );
};

export default Hero;