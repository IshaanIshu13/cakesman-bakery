export const CATEGORIES = [
  {
    id: "cakes",
    name: "Cakes",
    emoji: "🎂",
    description: "Delicious cakes for every occasion",
    subcategories: [
      { id: "chocolate-cakes", name: "Chocolate Cakes" },
      { id: "vanilla-cakes", name: "Vanilla Cakes" },
      { id: "fruit-cakes", name: "Fruit Cakes" },
      { id: "red-velvet", name: "Red Velvet" },
      { id: "cheesecakes", name: "Cheesecakes" },
      { id: "black-forest", name: "Black Forest" }
    ]
  },
  {
    id: "cupcakes",
    name: "Cupcakes",
    emoji: "🧁",
    description: "Individual sized sweet treats",
    subcategories: [
      { id: "chocolate-cupcakes", name: "Chocolate Cupcakes" },
      { id: "vanilla-cupcakes", name: "Vanilla Cupcakes" },
      { id: "red-velvet-cupcakes", name: "Red Velvet Cupcakes" },
      { id: "strawberry-cupcakes", name: "Strawberry Cupcakes" },
      { id: "carrot-cupcakes", name: "Carrot Cupcakes" },
      { id: "lemon-cupcakes", name: "Lemon Cupcakes" }
    ]
  },
  {
    id: "pastries",
    name: "Pastries",
    emoji: "🥐",
    description: "Fresh and flaky pastry delights",
    subcategories: [
      { id: "croissants", name: "Croissants" },
      { id: "danishes", name: "Danish Pastries" },
      { id: "eclairs", name: "Éclairs" },
      { id: "macarons", name: "Macarons" },
      { id: "puff-pastries", name: "Puff Pastries" },
      { id: "tarts", name: "Fruit Tarts" },
      { id: "donuts", name: "Donuts" }
    ]
  },
  {
    id: "breads",
    name: "Breads",
    emoji: "🍞",
    description: "Freshly baked artisan breads",
    subcategories: [
      { id: "sourdough", name: "Sourdough" },
      { id: "whole-wheat", name: "Whole Wheat" },
      { id: "ciabatta", name: "Ciabatta" },
      { id: "focaccia", name: "Focaccia" },
      { id: "baguettes", name: "Baguettes" },
      { id: "rye-bread", name: "Rye Bread" },
      { id: "multigrain", name: "Multigrain" }
    ]
  },
  {
    id: "cookies",
    name: "Cookies",
    emoji: "🍪",
    description: "Homemade cookies and biscuits",
    subcategories: [
      { id: "chocolate-chip", name: "Chocolate Chip" },
      { id: "sugar-cookies", name: "Sugar Cookies" },
      { id: "oatmeal-cookies", name: "Oatmeal Cookies" },
      { id: "peanut-butter", name: "Peanut Butter" },
      { id: "shortbread", name: "Shortbread" },
      { id: "macaroons", name: "Macaroons" },
      { id: "ginger-snaps", name: "Ginger Snaps" }
    ]
  },
  {
    id: "specialty",
    name: "Specialty",
    emoji: "✨",
    description: "Special occasion and custom cakes",
    subcategories: [
      { id: "wedding-cakes", name: "Wedding Cakes" },
      { id: "birthday-cakes", name: "Birthday Cakes" },
      { id: "anniversary-cakes", name: "Anniversary Cakes" },
      { id: "custom-cakes", name: "Custom Cakes" },
      { id: "themed-cakes", name: "Themed Cakes" },
      { id: "tiered-cakes", name: "Tiered Cakes" }
    ]
  },
  {
    id: "desserts",
    name: "Desserts",
    emoji: "🍰",
    description: "Sweet treats and miniatures",
    subcategories: [
      { id: "brownies", name: "Brownies" },
      { id: "mousse-cakes", name: "Mousse Cakes" },
      { id: "tiramisu", name: "Tiramisu" },
      { id: "dessert-bars", name: "Dessert Bars" },
      { id: "petit-fours", name: "Petit Fours" },
      { id: "fudge", name: "Fudge" },
      { id: "truffles", name: "Chocolate Truffles" }
    ]
  }
];

export const FLAVORS = [
  { id: "vanilla", name: "Vanilla", priceMultiplier: 1 },
  { id: "chocolate", name: "Chocolate", priceMultiplier: 1.1 },
  { id: "strawberry", name: "Strawberry", priceMultiplier: 1.15 },
  { id: "caramel", name: "Caramel", priceMultiplier: 1.2 },
  { id: "mint", name: "Mint Chocolate", priceMultiplier: 1.15 },
  { id: "lemon", name: "Lemon", priceMultiplier: 1.1 },
  { id: "pistachio", name: "Pistachio", priceMultiplier: 1.25 },
  { id: "coffee", name: "Coffee", priceMultiplier: 1.15 },
  { id: "banana", name: "Banana", priceMultiplier: 1.1 },
  { id: "red-velvet", name: "Red Velvet", priceMultiplier: 1.2 }
];

export const SIZES = [
  { id: "small", name: "Small (4 inch)", servings: "2-4 servings", priceMultiplier: 1 },
  { id: "medium", name: "Medium (6 inch)", servings: "4-6 servings", priceMultiplier: 1.5 },
  { id: "large", name: "Large (8 inch)", servings: "8-12 servings", priceMultiplier: 2.5 },
  { id: "xlarge", name: "Extra Large (10 inch)", servings: "12-16 servings", priceMultiplier: 3.5 },
  { id: "2tier", name: "2-Tier (6+8 inch)", servings: "16-20 servings", priceMultiplier: 4.5 },
  { id: "3tier", name: "3-Tier (6+8+10 inch)", servings: "20-30 servings", priceMultiplier: 6.5 },
  { id: "sheet", name: "Sheet Cake (12x18)", servings: "24-30 servings", priceMultiplier: 5 }
];

export const EGG_OPTIONS = [
  { id: "regular", name: "Regular (Contains Eggs)", priceMultiplier: 1 },
  { id: "eggfree", name: "Egg-Free", priceMultiplier: 1.1 }
];

export const SAMPLE_PRODUCTS = [
  {
    id: "1",
    name: "Classic Chocolate Cake",
    category: "cakes",
    subcategory: "chocolate-cakes",
    basePrice: 35,
    image: "/images/placeholder.jpg",
    description: "Rich and moist chocolate cake with chocolate frosting",
    flavors: FLAVORS,
    sizes: SIZES,
    eggOptions: EGG_OPTIONS,
    rating: 4.8,
    featured: true
  },
  {
    id: "2",
    name: "Vanilla Dream Cake",
    category: "cakes",
    subcategory: "vanilla-cakes",
    basePrice: 30,
    image: "/images/placeholder.jpg",
    description: "Fluffy vanilla cake with vanilla buttercream",
    flavors: FLAVORS,
    sizes: SIZES,
    eggOptions: EGG_OPTIONS,
    rating: 4.6,
    featured: true
  },
  {
    id: "3",
    name: "Assorted Cupcakes",
    category: "cupcakes",
    subcategory: "chocolate-cupcakes",
    basePrice: 20,
    image: "/images/placeholder.jpg",
    description: "Box of 6 assorted gourmet cupcakes",
    flavors: FLAVORS,
    sizes: [{ id: "6pack", name: "6-Pack", servings: "6", priceMultiplier: 1 }],
    eggOptions: EGG_OPTIONS,
    rating: 4.7,
    featured: true
  }
];
