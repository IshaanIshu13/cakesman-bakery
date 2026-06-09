// New Navigation Structure for Bakery Website
export const CATEGORIES = [
  {
    id: "flavor-station",
    name: "Flavor Station",
    emoji: "🎂",
    description: "Classic flavored cakes",
    subcategories: [
      { id: "chocolate-cakes", name: "Chocolate Cakes" },
      { id: "fruit-cakes", name: "Fruit Cakes" },
      { id: "special-cakes", name: "Special Cakes" },
      { id: "classic-flavours", name: "Classic Flavours" }
    ]
  },
  {
    id: "kids-themed",
    name: "Kids & Themed Collections",
    emoji: "🎈",
    description: "Fun cakes for kids and themed celebrations",
    subcategories: [
      { id: "boy-squad", name: "Boy Squad" },
      { id: "girl-power", name: "Girl Power" },
      { id: "office-party", name: "Office Party" },
      { id: "love-anniversaries", name: "Love & Anniversaries" },
      { id: "theme-parks", name: "Theme Parks (Jungle / Ocean)" }
    ]
  },
  {
    id: "family-friends",
    name: "Just For Family & Friends",
    emoji: "❤️",
    description: "Special cakes for loved ones",
    subcategories: [
      { id: "viral-meme-cakes", name: "Viral & Meme Cakes" },
      { id: "mom-dad", name: "Mom & Dad" },
      { id: "hubby-wifey", name: "Hubby & Wifey" }
    ]
  },
  {
    id: "lets-party",
    name: "Let's Party (Occasions)",
    emoji: "🎉",
    description: "Celebrate every special moment",
    subcategories: [
      { id: "bachelor-bash", name: "Bachelor Bash" },
      { id: "she-said-yes", name: "She Said Yes (Engagement)" },
      { id: "happy-retirement", name: "Happy Retirement" },
      { id: "well-miss-you", name: "We'll Miss You (Farewell)" },
      { id: "baby-on-board", name: "Baby on Board (Shower)" },
      { id: "big-wins", name: "Big Wins (Congratulations)" }
    ]
  },
  {
    id: "custom-cake",
    name: "Create Your Own",
    emoji: "✨",
    description: "Design your dream cake",
    isAction: true,
    subcategories: []
  }
];

// Helper function to get category by id
export const getCategoryById = (id) => {
  return CATEGORIES.find(cat => cat.id === id);
};

// Helper function to get subcategory by parent id and subcategory id
export const getSubcategoryById = (categoryId, subcategoryId) => {
  const category = getCategoryById(categoryId);
  if (!category) return null;
  return category.subcategories.find(sub => sub.id === subcategoryId);
};

// Flavor options for customization
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

// Size options for cakes
export const SIZES = [
  { id: "small", name: "Small (4 inch)", servings: "2-4 servings", priceMultiplier: 1 },
  { id: "medium", name: "Medium (6 inch)", servings: "4-6 servings", priceMultiplier: 1.5 },
  { id: "large", name: "Large (8 inch)", servings: "8-12 servings", priceMultiplier: 2.5 },
  { id: "xlarge", name: "Extra Large (10 inch)", servings: "12-16 servings", priceMultiplier: 3.5 },
  { id: "2tier", name: "2-Tier (6+8 inch)", servings: "16-20 servings", priceMultiplier: 4.5 },
  { id: "3tier", name: "3-Tier (6+8+10 inch)", servings: "20-30 servings", priceMultiplier: 6.5 },
  { id: "sheet", name: "Sheet Cake (12x18)", servings: "24-30 servings", priceMultiplier: 5 }
];

// Egg options for dietary preferences
export const EGG_OPTIONS = [
  { id: "regular", name: "Regular (Contains Eggs)", priceMultiplier: 1 },
  { id: "eggfree", name: "Egg-Free", priceMultiplier: 1.1 }
];

// Sample products for display
export const SAMPLE_PRODUCTS = [
  {
    id: "1",
    name: "Classic Chocolate Cake",
    category: "cakes",
    subcategory: "chocolate-cakes",
    basePrice: 399,
    image: "🍫",
    description: "Rich and moist chocolate cake with chocolate frosting",
    flavors: FLAVORS,
    sizes: SIZES,
    eggOptions: EGG_OPTIONS,
    rating: 4.8,
    reviews: 234,
    discount: 10,
    featured: true,
    deliveryTime: "Same Day",
    tags: ["Chocolate", "Eggless Available"]
  },
  {
    id: "2",
    name: "Vanilla Dream Cake",
    category: "cakes",
    subcategory: "vanilla-cakes",
    basePrice: 349,
    image: "🍰",
    description: "Fluffy vanilla cake with vanilla buttercream and fruit toppings",
    flavors: FLAVORS,
    sizes: SIZES,
    eggOptions: EGG_OPTIONS,
    rating: 4.6,
    reviews: 189,
    discount: 5,
    featured: true,
    deliveryTime: "Same Day",
    tags: ["Vanilla", "Popular"]
  },
  {
    id: "3",
    name: "Strawberry Delight Cake",
    category: "cakes",
    subcategory: "fruit-cakes",
    basePrice: 449,
    image: "🍓",
    description: "Fresh strawberry cake with whipped cream and real strawberries",
    flavors: FLAVORS,
    sizes: SIZES,
    eggOptions: EGG_OPTIONS,
    rating: 4.7,
    reviews: 156,
    discount: 15,
    featured: true,
    deliveryTime: "Same Day",
    tags: ["Strawberry", "Fresh Fruits"]
  },
  {
    id: "4",
    name: "Caramel Fusion Cake",
    category: "cakes",
    subcategory: "special-cakes",
    basePrice: 499,
    image: "🎂",
    description: "Decadent caramel cake with salted caramel frosting and crunch",
    flavors: FLAVORS,
    sizes: SIZES,
    eggOptions: EGG_OPTIONS,
    rating: 4.9,
    reviews: 267,
    discount: 12,
    featured: true,
    deliveryTime: "Same Day",
    tags: ["Caramel", "Premium"]
  }
];
