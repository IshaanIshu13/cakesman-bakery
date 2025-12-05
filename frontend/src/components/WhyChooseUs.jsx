import React from "react";

function WhyChooseUs() {
  const features = [
    {
      icon: "🍞",
      title: "Freshly Baked Everyday",
      description: "We bake every cake fresh, using the finest ingredients."
    },
    {
      icon: "🎂",
      title: "Custom Cake Designs",
      description: "Your imagination is our inspiration — unique cakes for your celebrations."
    },
    {
      icon: "💎",
      title: "Affordable Luxury",
      description: "Premium cakes at prices that make every occasion sweet and stress-free."
    }
  ];

  return (
    <section className="py-16 px-6 text-center">
      <h2 className="text-2xl font-bold text-pink-500 mb-8">
        Why Choose Our Bakery?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-pink-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="text-3xl mb-3">{feature.icon}</div>
            <h3 className="text-lg font-semibold text-pink-500 mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-600">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WhyChooseUs;