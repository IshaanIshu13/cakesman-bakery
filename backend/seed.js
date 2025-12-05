const mongoose = require('mongoose')
const User = require('./models/User')
const Product = require('./models/Product')
require('dotenv').config()

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    console.log('Connected to MongoDB')

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@cakesman.com' })
    if (!adminExists) {
      // Create admin user
      const adminUser = new User({
        name: 'Admin',
        email: 'admin@cakesman.com',
        password: 'admin123',
        phone: '+91 9999999999',
        isAdmin: true
      })
      await adminUser.save()
      console.log('✅ Admin user created successfully!')
      console.log('Email: admin@cakesman.com')
      console.log('Password: admin123')
    } else {
      console.log('Admin user already exists')
    }

    // Check if products already exist
    const productCount = await Product.countDocuments()
    if (productCount > 0) {
      console.log('Products already exist in database')
      process.exit(0)
    }

    // Seed demo products
    const demoProducts = [
      {
        name: "Chocolate Cake",
        description: "Rich and moist chocolate cake with dark chocolate frosting",
        category: "Cakes",
        subcategory: "Chocolate Cakes",
        basePrice: 500,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500",
        featured: true,
        flavors: [
          { name: "Dark Chocolate", priceMultiplier: 1 },
          { name: "Milk Chocolate", priceMultiplier: 0.9 }
        ],
        sizes: [
          { name: "Small", servings: "4-6", priceMultiplier: 0.8 },
          { name: "Medium", servings: "8-10", priceMultiplier: 1 },
          { name: "Large", servings: "12-15", priceMultiplier: 1.3 }
        ]
      },
      {
        name: "Vanilla Cake",
        description: "Classic vanilla sponge cake with vanilla buttercream",
        category: "Cakes",
        subcategory: "Vanilla Cakes",
        basePrice: 400,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500",
        featured: true,
        flavors: [
          { name: "Classic Vanilla", priceMultiplier: 1 },
          { name: "French Vanilla", priceMultiplier: 1.1 }
        ],
        sizes: [
          { name: "Small", servings: "4-6", priceMultiplier: 0.8 },
          { name: "Medium", servings: "8-10", priceMultiplier: 1 },
          { name: "Large", servings: "12-15", priceMultiplier: 1.3 }
        ]
      },
      {
        name: "Red Velvet Cake",
        description: "Elegant red velvet cake with cream cheese frosting",
        category: "Cakes",
        subcategory: "Specialty Cakes",
        basePrice: 600,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500",
        featured: true,
        flavors: [
          { name: "Classic", priceMultiplier: 1 }
        ],
        sizes: [
          { name: "Small", servings: "4-6", priceMultiplier: 0.8 },
          { name: "Medium", servings: "8-10", priceMultiplier: 1 },
          { name: "Large", servings: "12-15", priceMultiplier: 1.3 }
        ]
      },
      {
        name: "Strawberry Cake",
        description: "Fresh strawberry cake with whipped cream and real strawberries",
        category: "Cakes",
        subcategory: "Fruit Cakes",
        basePrice: 550,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500",
        featured: true,
        flavors: [
          { name: "Fresh Strawberry", priceMultiplier: 1 }
        ],
        sizes: [
          { name: "Small", servings: "4-6", priceMultiplier: 0.8 },
          { name: "Medium", servings: "8-10", priceMultiplier: 1 },
          { name: "Large", servings: "12-15", priceMultiplier: 1.3 }
        ]
      },
      {
        name: "Black Forest Cake",
        description: "Classic German Black Forest cake with cherries and whipped cream",
        category: "Cakes",
        subcategory: "Specialty Cakes",
        basePrice: 700,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500",
        featured: false,
        flavors: [
          { name: "Original", priceMultiplier: 1 }
        ],
        sizes: [
          { name: "Small", servings: "4-6", priceMultiplier: 0.8 },
          { name: "Medium", servings: "8-10", priceMultiplier: 1 },
          { name: "Large", servings: "12-15", priceMultiplier: 1.3 }
        ]
      },
      {
        name: "Cheesecake",
        description: "New York style cheesecake with graham cracker crust",
        category: "Cakes",
        subcategory: "Specialty Cakes",
        basePrice: 650,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500",
        featured: false,
        flavors: [
          { name: "Plain", priceMultiplier: 1 },
          { name: "Berry", priceMultiplier: 1.1 }
        ],
        sizes: [
          { name: "Small", servings: "4-6", priceMultiplier: 0.8 },
          { name: "Medium", servings: "8-10", priceMultiplier: 1 },
          { name: "Large", servings: "12-15", priceMultiplier: 1.3 }
        ]
      },
      {
        name: "Carrot Cake",
        description: "Moist carrot cake with cream cheese frosting and walnuts",
        category: "Cakes",
        subcategory: "Fruit Cakes",
        basePrice: 480,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500",
        featured: false,
        flavors: [
          { name: "Classic", priceMultiplier: 1 }
        ],
        sizes: [
          { name: "Small", servings: "4-6", priceMultiplier: 0.8 },
          { name: "Medium", servings: "8-10", priceMultiplier: 1 },
          { name: "Large", servings: "12-15", priceMultiplier: 1.3 }
        ]
      },
      {
        name: "Chocolate Cupcakes",
        description: "Individual chocolate cupcakes with chocolate frosting (6 pack)",
        category: "Cupcakes",
        subcategory: "Chocolate Cupcakes",
        basePrice: 300,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500",
        featured: true,
        flavors: [
          { name: "Chocolate", priceMultiplier: 1 }
        ],
        sizes: [
          { name: "6 Pack", servings: "6", priceMultiplier: 1 },
          { name: "12 Pack", servings: "12", priceMultiplier: 1.8 }
        ]
      },
      {
        name: "Vanilla Cupcakes",
        description: "Classic vanilla cupcakes with vanilla frosting (6 pack)",
        category: "Cupcakes",
        subcategory: "Vanilla Cupcakes",
        basePrice: 250,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500",
        featured: true,
        flavors: [
          { name: "Vanilla", priceMultiplier: 1 }
        ],
        sizes: [
          { name: "6 Pack", servings: "6", priceMultiplier: 1 },
          { name: "12 Pack", servings: "12", priceMultiplier: 1.8 }
        ]
      }
    ]

    await Product.insertMany(demoProducts)
    console.log(`✅ ${demoProducts.length} demo products created successfully!`)

    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error.message)
    process.exit(1)
  }
}

seedDatabase()
