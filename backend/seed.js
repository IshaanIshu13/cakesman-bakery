const mongoose = require('mongoose')
const User = require('./models/User')
const Product = require('./models/Product')
require('dotenv').config()

const seedDatabase = async () => {
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

    // Clear old products to avoid duplicates
    await Product.deleteMany({})
    console.log('Cleared old products')

    // Create products function
    const createProduct = (name, desc, category, subcategory, price, featured = false) => ({
      name,
      description: desc,
      category,
      subcategory,
      basePrice: price,
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500",
      featured,
      stock: 50,
      isEggless: true,
      available: true,
      flavors: [
        { name: "Option 1", priceMultiplier: 1 },
        { name: "Option 2", priceMultiplier: 1.1 }
      ],
      sizes: [
        { name: "4 inch", servings: "2-4", priceMultiplier: 0.8 },
        { name: "6 inch", servings: "4-6", priceMultiplier: 1 },
        { name: "8 inch", servings: "8-10", priceMultiplier: 1.3 }
      ]
    })

    // Product list
    const demoProducts = [
      // FLAVOR STATION - Chocolate Cakes
      createProduct("Chocochip Cake", "Delicious chocolate cake with chocolate chips", "flavor-station", "chocolate-cakes", 550, true),
      createProduct("Brownie Cake", "Rich fudgy brownie with dense chocolate layers", "flavor-station", "chocolate-cakes", 600),
      createProduct("Choco Coffee Cake", "Smooth chocolate with aromatic coffee notes", "flavor-station", "chocolate-cakes", 580, true),
      createProduct("Choco Truffle Cake", "Premium chocolate truffle with ganache", "flavor-station", "chocolate-cakes", 650),
      createProduct("Devil's Favourite", "Ultra-dark chocolate fudge cake", "flavor-station", "chocolate-cakes", 620),

      // FLAVOR STATION - Fruit Cakes
      createProduct("Mix Fruit Cake", "Assorted fresh fruits with cream", "flavor-station", "fruit-cakes", 600, true),
      createProduct("Fresh Fruit Cake", "Premium fresh seasonal fruits", "flavor-station", "fruit-cakes", 620),
      createProduct("Pineapple Cake", "Classic pineapple upside-down", "flavor-station", "fruit-cakes", 550),

      // FLAVOR STATION - Special Cakes
      createProduct("Kit Kat Cake", "Delightful Kit Kat chocolate cake", "flavor-station", "special-cakes", 680, true),
      createProduct("Red Velvet Cake", "Elegant red velvet with cream cheese", "flavor-station", "special-cakes", 700),

      // FLAVOR STATION - Classic Flavours
      createProduct("Vanilla Cake", "Timeless vanilla sponge with buttercream", "flavor-station", "classic-flavours", 450, true),
      createProduct("Pineapple Cake", "Tropical pineapple flavor cake", "flavor-station", "classic-flavours", 520),
      createProduct("Black Currant Cake", "Tangy black currant delights", "flavor-station", "classic-flavours", 550),
      createProduct("Black Forest Cake", "German Black Forest with cherries", "flavor-station", "classic-flavours", 800, true),
      createProduct("White Forest Cake", "White chocolate with fruits and cream", "flavor-station", "classic-flavours", 780),

      // KIDS & THEMED - Boy Squad
      createProduct("Sports Theme Cake", "Football, soccer, basketball themed", "kids-themed", "boy-squad", 700, true),
      createProduct("Superhero Cake", "Batman, Superman, Spider-Man themed", "kids-themed", "boy-squad", 750),
      createProduct("Race Car Cake", "Fast cars and racing themed", "kids-themed", "boy-squad", 720, true),
      createProduct("Video Game Cake", "Gaming with popular characters", "kids-themed", "boy-squad", 780),
      createProduct("Dinosaur Cake", "Roaring dino theme for dino lovers", "kids-themed", "boy-squad", 740),

      // KIDS & THEMED - Girl Power
      createProduct("Princess Tiara", "Elegant princess with sparkly tiara", "kids-themed", "girl-power", 750, true),
      createProduct("Butterfly Magic", "Colorful butterflies with flowers", "kids-themed", "girl-power", 770),
      createProduct("Unicorn Dream", "Magical unicorn with rainbow colors", "kids-themed", "girl-power", 800, true),
      createProduct("Superhero Girl", "Powerful superhero girl theme", "kids-themed", "girl-power", 780),
      createProduct("Fairy Tale", "Enchanted fairy tale theme", "kids-themed", "girl-power", 760),

      // KIDS & THEMED - Office Party
      createProduct("Corporate Blue", "Professional blue and white design", "kids-themed", "office-party", 680, true),
      createProduct("Team Success", "Motivational team achievement cake", "kids-themed", "office-party", 700),
      createProduct("Promotion Celebration", "Elegant promotion cake", "kids-themed", "office-party", 720, true),
      createProduct("Project Launch", "Success project launch celebration", "kids-themed", "office-party", 710),
      createProduct("Work Anniversary", "Celebrating years of service", "kids-themed", "office-party", 690),

      // KIDS & THEMED - Love & Anniversaries
      createProduct("Love at First Bite", "Romantic with red velvet layers", "kids-themed", "love-anniversaries", 750, true),
      createProduct("Anniversary Dream", "Elegant multi-layer celebration", "kids-themed", "love-anniversaries", 800),
      createProduct("Cupids Arrow", "Whimsical love-themed cake", "kids-themed", "love-anniversaries", 780, true),
      createProduct("Golden Celebration", "Luxurious golden anniversary cake", "kids-themed", "love-anniversaries", 820),
      createProduct("Sweet Sixteen", "Celebrating 16 years together", "kids-themed", "love-anniversaries", 760),

      // KIDS & THEMED - Theme Parks
      createProduct("Jungle Adventure", "Wild jungle with animals", "kids-themed", "theme-parks", 780, true),
      createProduct("Ocean Expedition", "Underwater with sea creatures", "kids-themed", "theme-parks", 800),
      createProduct("Safari Paradise", "African safari wildlife theme", "kids-themed", "theme-parks", 820, true),
      createProduct("Tropical Beach", "Beach vacation with tropical fruits", "kids-themed", "theme-parks", 790),
      createProduct("Magical Forest", "Enchanted forest with magic", "kids-themed", "theme-parks", 810),

      // FAMILY & FRIENDS - Viral & Meme
      createProduct("LOL Meme Master", "Hilarious meme jokes", "family-friends", "viral-meme-cakes", 700, true),
      createProduct("Viral Sensation", "Trendy viral moment cake", "family-friends", "viral-meme-cakes", 720),
      createProduct("Epic Meme", "Collection of epic memes", "family-friends", "viral-meme-cakes", 740, true),
      createProduct("Roast Special", "Funny roast cake for friends", "family-friends", "viral-meme-cakes", 710),
      createProduct("TikTok Trends", "Latest TikTok dance moves", "family-friends", "viral-meme-cakes", 730),

      // FAMILY & FRIENDS - Mom & Dad
      createProduct("Super Mom", "Honoring mothers everywhere", "family-friends", "mom-dad", 680, true),
      createProduct("Dad's Hero", "For the best dads", "family-friends", "mom-dad", 700, true),
      createProduct("Best Mom & Dad", "Dual celebration split cake", "family-friends", "mom-dad", 750),
      createProduct("Mom's Day Special", "Flowers and pearls design", "family-friends", "mom-dad", 720),
      createProduct("Dad's Favourite", "Bold masculine theme", "family-friends", "mom-dad", 710),

      // FAMILY & FRIENDS - Hubby & Wifey
      createProduct("Hubby Special", "Romantic for special husband", "family-friends", "hubby-wifey", 720, true),
      createProduct("Wifey's Dream", "Elegant for special wife", "family-friends", "hubby-wifey", 740, true),
      createProduct("His & Hers", "Split design for couples", "family-friends", "hubby-wifey", 800),
      createProduct("Love Forever", "Eternal love with quotes", "family-friends", "hubby-wifey", 760),
      createProduct("Sweethearts Special", "Ultimate sweethearts cake", "family-friends", "hubby-wifey", 780),

      // LET'S PARTY - Bachelor Bash
      createProduct("Last Night Out", "Epic bachelor party cake", "lets-party", "bachelor-bash", 750, true),
      createProduct("Groom to Be", "Masculine groom celebration", "lets-party", "bachelor-bash", 780),
      createProduct("Freedom Party", "Final freedom celebration", "lets-party", "bachelor-bash", 770, true),
      createProduct("Bachelor Bash Deluxe", "Luxurious bachelor party", "lets-party", "bachelor-bash", 820),
      createProduct("Best Man Winner", "Honoring the best man", "lets-party", "bachelor-bash", 760),

      // LET'S PARTY - She Said Yes
      createProduct("She Said Yes", "Engagement announcement cake", "lets-party", "she-said-yes", 800, true),
      createProduct("Engaged & Blessed", "Beautiful proposal celebration", "lets-party", "she-said-yes", 820),
      createProduct("Diamond Ring", "Elegant diamond ring design", "lets-party", "she-said-yes", 850, true),
      createProduct("Bridal Bliss", "Romantic bridal theme", "lets-party", "she-said-yes", 830),
      createProduct("Wedding Countdown", "Journey to wedding day", "lets-party", "she-said-yes", 810),

      // LET'S PARTY - Happy Retirement
      createProduct("Welcome to Freedom", "Welcome to next chapter", "lets-party", "happy-retirement", 720, true),
      createProduct("Happy Retirement", "Gold elegant celebration", "lets-party", "happy-retirement", 750),
      createProduct("Enjoy the Journey", "Inspirational adventure cake", "lets-party", "happy-retirement", 740, true),
      createProduct("Dream Vacation", "Celebrating retirement plans", "lets-party", "happy-retirement", 760),
      createProduct("Time for Me", "Self-care celebration", "lets-party", "happy-retirement", 730),

      // LET'S PARTY - We'll Miss You
      createProduct("Farewell Friend", "Emotional farewell cake", "lets-party", "well-miss-you", 700, true),
      createProduct("Goodbye & Good Luck", "New beginnings cake", "lets-party", "well-miss-you", 720),
      createProduct("Happy Trails", "Moving on adventure cake", "lets-party", "well-miss-you", 740, true),
      createProduct("Job Well Done", "Years of dedication", "lets-party", "well-miss-you", 730),
      createProduct("Best Wishes Always", "Heartfelt farewell", "lets-party", "well-miss-you", 710),

      // LET'S PARTY - Baby on Board
      createProduct("Baby on Board", "Baby shower celebration", "lets-party", "baby-on-board", 680, true),
      createProduct("Baby Shower Bliss", "Pastel celebration cake", "lets-party", "baby-on-board", 700),
      createProduct("Stork Special", "Stork announces baby", "lets-party", "baby-on-board", 720, true),
      createProduct("Welcome Baby", "Sweet welcome cake", "lets-party", "baby-on-board", 690),
      createProduct("Little Miracles", "Miracle of life cake", "lets-party", "baby-on-board", 710),

      // LET'S PARTY - Big Wins
      createProduct("You Did It!", "Any major achievement", "lets-party", "big-wins", 700, true),
      createProduct("Congrats Champion", "Gold celebration cake", "lets-party", "big-wins", 750),
      createProduct("Goal Crushed", "Breaking records cake", "lets-party", "big-wins", 730, true),
      createProduct("Winner's Circle", "Victory celebration", "lets-party", "big-wins", 760),
      createProduct("Success Celebration", "Premium achievement", "lets-party", "big-wins", 780)
    ]

    // Insert all products
    const result = await Product.insertMany(demoProducts)
    console.log(`✅ ${result.length} products created successfully!`)
    console.log('\n📊 Summary:')
    console.log('- Flavor Station: 15 products (4 subcategories)')
    console.log('  • Chocolate Cakes: 5 products')
    console.log('  • Fruit Cakes: 3 products')
    console.log('  • Special Cakes: 2 products')
    console.log('  • Classic Flavours: 5 products')
    console.log('- Kids & Themed Collections: 25 products (5 subcategories × 5)')
    console.log('- Just For Family & Friends: 15 products (3 subcategories × 5)')
    console.log('- Let\'s Party (Occasions): 30 products (6 subcategories × 5)')
    console.log('- Total: 85 eggless cake products')
    console.log('\n✅ All products are EGGLESS and properly mapped to subcategories!')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error.message)
    process.exit(1)
  }
}

seedDatabase()
