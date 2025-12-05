import React from "react";

function Reviews() {
  const reviews = [
    { id: 1, text: "Great cakes and service!", rating: 5 },
    { id: 2, text: "Affordable and delicious!", rating: 5 },
    { id: 3, text: "Custom designs are amazing!", rating: 5 }
  ];

  return (
    <section className="py-16 px-24 bg-white">
      <h2 className="text-3xl font-bold text-pink-700 text-center mb-10">
        Customer Reviews & Wishes
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((review) => (
          <div 
            key={review.id}
            className="bg-pink-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="text-yellow-400 mb-3">
              {"⭐".repeat(review.rating)}
            </div>
            <p className="text-gray-700 font-medium">"{review.text}"</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Reviews;