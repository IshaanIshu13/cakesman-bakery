export interface Category {
  id: string
  name: string
  icon: string
  description: string
  subcategories: Subcategory[]
}

export interface Subcategory {
  id: string
  name: string
  description?: string
}

export const categories: Category[] = [
  {
    id: 'birthday-cakes',
    name: 'Birthday Cakes',
    icon: '🎂',
    description: 'Celebrate special moments with creative birthday cakes',
    subcategories: [
      { id: 'cartoon-theme', name: 'Cartoon Theme', description: 'Doraemon, Barbie, Avengers, Shinchan' },
      { id: 'photo-print', name: 'Photo Print Cake', description: 'Personalized photo cakes' },
      { id: 'confetti-sprinkle', name: 'Confetti / Sprinkle Cake', description: 'Colorful celebration' },
      { id: 'number-shape', name: 'Number Shape Cake', description: '1, 18, 21, 50 etc.' },
      { id: 'gaming-theme', name: 'Gaming Theme', description: 'PUBG, Free Fire, PlayStation' },
      { id: 'emoji-face', name: 'Emoji Face Cake', description: 'Fun emoji designs' },
      { id: 'balloon-burst', name: 'Balloon Burst / Explosion Box Cake', description: 'Surprise inside' }
    ]
  },
  {
    id: 'baby-kids-cakes',
    name: 'Baby & Kids Cakes',
    icon: '👶',
    description: 'Adorable cakes for little ones',
    subcategories: [
      { id: 'baby-shower', name: 'Baby Shower Belly Cake', description: 'Pregnancy celebration' },
      { id: 'unicorn-rainbow', name: 'Unicorn / Rainbow Cake', description: 'Magical designs' },
      { id: 'jungle-animal', name: 'Jungle Animal Theme', description: 'Safari adventure' },
      { id: 'baby-accessories', name: 'Baby Shoes / Feeding Bottle Cake', description: 'Cute accessories' },
      { id: 'mickey-minnie', name: 'Minnie / Mickey Mouse Cake', description: 'Disney favorites' },
      { id: 'cloud-star', name: 'Cloud & Star Dream Theme', description: 'Dreamy designs' },
      { id: 'teddy-bear', name: 'Teddy Bear Cake', description: 'Cuddly bear cakes' }
    ]
  },
  {
    id: 'engagement-wedding-cakes',
    name: 'Engagement & Wedding Cakes',
    icon: '💍',
    description: 'Elegant cakes for your special day',
    subcategories: [
      { id: 'multi-tier', name: 'Multi-Tier Royal Cake', description: '2–5 tiers' },
      { id: 'floral-theme', name: 'Floral Theme', description: 'Fresh Flowers / Sugar Flowers' },
      { id: 'gold-marble', name: 'Gold Leaf Marble Cake', description: 'Luxury marble design' },
      { id: 'rustic-naked', name: 'Rustic Naked Cake', description: 'Natural beauty' },
      { id: 'heart-double', name: 'Heart Double Layer Cake', description: 'Romantic heart shape' },
      { id: 'bow-pearl', name: 'Bow & Pearl Elegant Cake', description: 'Classic elegance' },
      { id: 'mirror-glaze', name: 'Mirror Glaze Luxury Cake', description: 'Glossy perfection' }
    ]
  },
  {
    id: 'anniversary-cakes',
    name: 'Anniversary Cakes',
    icon: '🌸',
    description: 'Celebrate love and togetherness',
    subcategories: [
      { id: 'heart-pinata', name: 'Heart Piñata Cake', description: 'Surprise inside' },
      { id: 'couple-silhouette', name: 'Couple Silhouette Cake', description: 'Romantic couple design' },
      { id: 'metallic-drip', name: 'Metallic / Gold Drip Cake', description: 'Luxury gold drip' },
      { id: 'rose-swirl', name: 'Rose Swirl Cake', description: 'Beautiful rose patterns' },
      { id: 'name-initial', name: 'Name Initial Cake', description: 'Personalized initials' },
      { id: 'love-infinity', name: 'Love Infinity Theme Cake', description: 'Eternal love symbol' },
      { id: 'photo-collage', name: 'Photo Collage Cake', description: 'Memory collection' }
    ]
  },
  {
    id: 'corporate-office-cakes',
    name: 'Corporate / Office Cakes',
    icon: '💼',
    description: 'Professional cakes for workplace celebrations',
    subcategories: [
      { id: 'company-logo', name: 'Company Logo Print Cake', description: 'Brand customization' },
      { id: 'laptop-keyboard', name: 'Laptop / Keyboard Theme Cake', description: 'Tech inspired' },
      { id: 'office-table', name: 'Office Table Cake', description: 'Workspace theme' },
      { id: 'success-kpi', name: 'Success / Target / KPI Theme', description: 'Achievement celebration' },
      { id: 'appreciation-farewell', name: 'Appreciation / Farewell Theme', description: 'Employee recognition' },
      { id: 'minimal-professional', name: 'Minimal Elegant Professional Cake', description: 'Sophisticated design' },
      { id: 'tie-shirt-badge', name: 'Tie, Shirt & Badge Theme Cake', description: 'Business attire' }
    ]
  },
  {
    id: 'designer-luxury-cakes',
    name: 'Designer / Luxury Cakes',
    icon: '🧁',
    description: 'Premium artistic creations',
    subcategories: [
      { id: 'geode-crystal', name: 'Geode Crystal Cake', description: 'Crystal formations' },
      { id: 'isomalt-sugar', name: 'Isomalt / Sugar Art Cake', description: 'Sugar artistry' },
      { id: 'fault-line', name: 'Fault Line Cake', description: 'Modern fault line design' },
      { id: 'crown-royal', name: 'Crown / Royal Queen Cake', description: 'Regal elegance' },
      { id: 'butterfly-theme', name: 'Butterfly Theme Cake', description: 'Delicate butterflies' },
      { id: 'textured-minimal', name: 'Textured & Minimal Aesthetic Cake', description: 'Modern minimalism' },
      { id: 'floating-gravity', name: 'Floating or Anti-Gravity Cake', description: 'Gravity-defying design' }
    ]
  },
  {
    id: 'custom-theme-cakes',
    name: 'Custom Theme Cakes',
    icon: '🎉',
    description: 'Unique personalized themes',
    subcategories: [
      { id: 'travel-theme', name: 'Travel Theme', description: 'Passport, Airplane, Globe' },
      { id: 'gym-fitness', name: 'Gym / Fitness', description: 'Dumbbells, Treadmill' },
      { id: 'makeup-fashion', name: 'Makeup / Fashion', description: 'Shoes, Lipstick, Bag' },
      { id: 'professional-career', name: 'Doctor / Nurse / Engineer Theme', description: 'Career celebration' },
      { id: 'sports-theme', name: 'Sports', description: 'Football, Cricket, Formula-1' },
      { id: 'vehicle-theme', name: 'Car / Bike / Superbike Theme', description: 'Automotive passion' },
      { id: 'movie-character', name: 'Movie / OTT / Character Theme', description: 'Entertainment inspired' }
    ]
  }
]

export const flavors = [
  { id: 'vanilla', name: 'Vanilla', price: 0 },
  { id: 'chocolate', name: 'Chocolate', price: 0 },
  { id: 'strawberry', name: 'Strawberry', price: 50 },
  { id: 'butterscotch', name: 'Butterscotch', price: 50 },
  { id: 'red-velvet', name: 'Red Velvet', price: 100 },
  { id: 'black-forest', name: 'Black Forest', price: 100 },
  { id: 'pineapple', name: 'Pineapple', price: 50 },
  { id: 'mango', name: 'Mango', price: 50 },
  { id: 'coffee', name: 'Coffee', price: 100 },
  { id: 'mixed-fruit', name: 'Mixed Fruit', price: 100 }
]

export const sizes = [
  { id: '0.5kg', name: '0.5 Kg', servings: '4-6 people', multiplier: 0.5 },
  { id: '1kg', name: '1 Kg', servings: '8-10 people', multiplier: 1.0 },
  { id: '1.5kg', name: '1.5 Kg', servings: '12-15 people', multiplier: 1.5 },
  { id: '2kg', name: '2 Kg', servings: '16-20 people', multiplier: 2.0 },
  { id: '3kg', name: '3 Kg', servings: '24-30 people', multiplier: 3.0 },
  { id: '4kg', name: '4 Kg', servings: '32-40 people', multiplier: 4.0 },
  { id: '5kg', name: '5 Kg', servings: '40-50 people', multiplier: 5.0 }
]

export const eggOptions = [
  { id: 'eggless', name: 'Eggless', price: 0 },
  { id: 'with-egg', name: 'With Egg', price: 0 }
]

export interface Product {
  id: string
  name: string
  description: string
  basePrice: number
  category: string
  categoryId: string
  subcategoryId: string
  image: string
  inStock: boolean
  featured: boolean
  discount: number
  rating: number
  reviews: number
  deliveryTime: string
  tags?: string[]
}

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Classic Chocolate Cake',
    description: 'Rich, moist chocolate cake with velvety frosting',
    basePrice: 500,
    category: 'Birthday Cakes',
    categoryId: 'birthday-cakes',
    subcategoryId: 'cartoon-theme',
    image: '🎂',
    inStock: true,
    featured: true,
    discount: 10,
    rating: 4.8,
    reviews: 245,
    deliveryTime: '2-3 hours',
    tags: ['Chocolate', 'Bestseller', 'Premium']
  },
  {
    id: '2',
    name: 'Vanilla Dream Cake',
    description: 'Fluffy vanilla sponge with cream cheese frosting',
    basePrice: 450,
    category: 'Birthday Cakes',
    categoryId: 'birthday-cakes',
    subcategoryId: 'confetti-sprinkle',
    image: '🧁',
    inStock: true,
    featured: true,
    discount: 0,
    rating: 4.6,
    reviews: 189,
    deliveryTime: '2-3 hours',
    tags: ['Vanilla', 'Classic', 'Popular']
  },
  {
    id: '3',
    name: 'Strawberry Delight',
    description: 'Fresh strawberry layers with whipped cream',
    basePrice: 600,
    category: 'Baby & Kids Cakes',
    categoryId: 'baby-kids-cakes',
    subcategoryId: 'unicorn-rainbow',
    image: '🍓',
    inStock: true,
    featured: false,
    discount: 15,
    rating: 4.7,
    reviews: 156,
    deliveryTime: 'Same Day',
    tags: ['Fruit', 'Festive', 'Fresh']
  }
]
