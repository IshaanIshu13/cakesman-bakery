// src/components/Testimonials.js
import React, { useState, useEffect } from "react";

// Auto-import all review images in the folder
const importAll = (r) => r.keys().map(r);
const images = importAll(
  require.context("../assets/reviews", false, /\.(png|jpe?g|svg)$/)
);

function Testimonials() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000); // rotate every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section style={{ textAlign: "center", padding: "40px 20px" }}>
      <h2 style={{ color: "#6d3300", marginBottom: "20px" }}>
        What Our Customers Say
      </h2>

      <div
        style={{
          position: "relative",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <img
          src={images[current]}
          alt={`Customer Review ${current + 1}`}
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "12px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            transition: "opacity 0.5s ease-in-out",
          }}
        />
      </div>
    </section>
  );
}

export default Testimonials;
