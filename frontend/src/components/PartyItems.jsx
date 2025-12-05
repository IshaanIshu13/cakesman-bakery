import React from "react";

function PartyItems() {
  const items = [
    { emoji: "🎇", name: "Sparkle Candles" },
    { emoji: "🎈", name: "Balloons" },
    { emoji: "🎉", name: "Party Poppers" },
    { emoji: "🎂", name: "Birthday Caps" }
  ];

  return (
    <section className="py-16 px-4 bg-pink-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Make Your Celebration Extra Special!
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-4xl mb-3">{item.emoji}</div>
              <div className="text-gray-700 font-medium">{item.name}</div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button className="bg-pink-600 text-white py-3 px-8 rounded-full hover:bg-pink-700 transition-colors duration-200">
            Shop Party Items
          </button>
        </div>
      </div>
    </section>
  );
}

export default PartyItems;