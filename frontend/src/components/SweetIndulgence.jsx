import React, { useState } from "react";
import { Cake, Crown, Heart, Coffee, Leaf } from "lucide-react";
import heroCake from '../assets/images/hero-cake.jpg';

// Using placeholder image until more images are added to assets
const defaultImage = heroCake;

const categories = [
  { id: "all", label: "All Cakes", items: "150+", icon: <Cake size={32} /> },
  { id: "gourmet", label: "Gourmet Cakes", items: "25+", icon: <Crown size={32} /> },
  { id: "chocolate", label: "Chocolate", items: "40+", icon: <span className="text-3xl">🍫</span> },
  { id: "cheesecake", label: "Cheesecakes", items: "15+", icon: <span className="text-3xl">🧀</span> },
  { id: "butterscotch", label: "Butterscotch", items: "12+", icon: <span className="text-3xl">🍰</span> },
  { id: "pineapple", label: "Pineapple", items: "18+", icon: <span className="text-3xl">🍍</span> },
  { id: "fruit", label: "Fresh Fruit", items: "22+", icon: <span className="text-3xl">🍓</span> },
  { id: "redvelvet", label: "Red Velvet", items: "8+", icon: <Heart size={32} /> },
  { id: "cupcakes", label: "Cupcakes", items: "30+", icon: <span className="text-3xl">🧁</span> },
];

const featuredProducts = {
  all: [
    { id: 1, title: "All Cakes Cake", img: defaultImage },
    { id: 2, title: "Gourmet Cakes Cake", img: defaultImage },
    { id: 3, title: "Chocolate Cake", img: defaultImage },
    { id: 4, title: "Cheesecakes Cake", img: defaultImage },
  ],
  gourmet: [
    { id: 1, title: "Gourmet Chocolate Cake", img: defaultImage },
    { id: 2, title: "Luxury Red Velvet", img: defaultImage },
  ],
  chocolate: [
    { id: 1, title: "Dark Chocolate Cake", img: defaultImage },
    { id: 2, title: "Chocolate Truffle", img: defaultImage },
  ],
  // Add more categories as needed...
};

const styles = {
  section: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'linear-gradient(to bottom, #fff, #fdf3f3)',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#5a2d0c',
  },
  subtitle: {
    color: '#666',
    marginBottom: '30px',
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
    marginBottom: '40px',
  },
  categoryBtn: {
    background: 'white',
    border: '2px solid transparent',
    borderRadius: '12px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  categoryBtnHover: {
    transform: 'translateY(-5px)',
    borderColor: '#ff6b81',
  },
  categoryBtnActive: {
    borderColor: '#ff6b81',
    background: '#fff7f9',
  },
  icon: {
    fontSize: '2rem',
    marginBottom: '10px',
    color: '#ff6b81',
  },
  featuredSection: {
    textAlign: 'left',
  },
  featuredHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  featuredTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
  },
  viewAll: {
    color: '#ff6b81',
    textDecoration: 'none',
    fontWeight: '500',
    cursor: 'pointer',
  },
  featuredGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
  },
  featuredCard: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    transition: 'transform 0.3s ease',
    cursor: 'pointer',
  },
  featuredCardHover: {
    transform: 'translateY(-8px)',
  },
  cardImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
  },
  cardTitle: {
    margin: '10px',
    fontSize: '1.1rem',
    color: '#5a2d0c',
  },
  cardDescription: {
    margin: '0 10px 10px',
    color: '#777',
  },
};

function SweetIndulgence() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);

  return (
    <section style={styles.section}>
      <h2 style={styles.title}>Sweet Indulgence</h2>
      <p style={styles.subtitle}>
        Irresistible delights to elevate any celebration. Choose from our wide variety of flavors and styles.
      </p>

      {/* Category Buttons */}
      <div style={styles.categoryGrid}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            style={{
              ...styles.categoryBtn,
              ...(activeCategory === cat.id ? styles.categoryBtnActive : {}),
              ...(hoveredButton === cat.id ? styles.categoryBtnHover : {}),
            }}
            onClick={() => setActiveCategory(cat.id)}
            onMouseEnter={() => setHoveredButton(cat.id)}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <div style={styles.icon}>{cat.icon}</div>
            <h4>{cat.label}</h4>
            <p>{cat.items}</p>
          </button>
        ))}
      </div>

      {/* Featured Products */}
      <div style={styles.featuredSection}>
        <div style={styles.featuredHeader}>
          <h3 style={styles.featuredTitle}>
            Featured in {categories.find((c) => c.id === activeCategory)?.label}
          </h3>
          <span style={styles.viewAll}>View All →</span>
        </div>

        <div style={styles.featuredGrid}>
          {featuredProducts[activeCategory]?.map((prod) => (
            <div
              key={prod.id}
              style={{
                ...styles.featuredCard,
                ...(hoveredCard === prod.id ? styles.featuredCardHover : {}),
              }}
              onMouseEnter={() => setHoveredCard(prod.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <img style={styles.cardImage} src={prod.img} alt={prod.title} />
              <h4 style={styles.cardTitle}>{prod.title}</h4>
              <p style={styles.cardDescription}>Fresh & delicious</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SweetIndulgence;