const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

/**
 * MongoDB Migration Script for Products
 * 
 * This script:
 * 1. Removes eggOptions field from all products
 * 2. Adds price = basePrice if missing
 * 3. Sets inStock = stock > 0
 * 4. Sets isEggless = true for all products
 * 5. Ensures available field is consistent
 * 
 * Run with: npm run migrate-products
 */

async function migrateProducts() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    console.log('\n📊 Analyzing existing products...');
    const allProducts = await Product.find({});
    console.log(`Found ${allProducts.length} products`);

    if (allProducts.length === 0) {
      console.log('No products to migrate');
      process.exit(0);
    }

    // Analyze what needs to be fixed
    let productsWithEggOptions = 0;
    let productsWithoutPrice = 0;
    let productsWithoutInStock = 0;

    for (const product of allProducts) {
      if (product.eggOptions) productsWithEggOptions++;
      if (!product.price) productsWithoutPrice++;
      if (product.inStock === undefined) productsWithoutInStock++;
    }

    console.log(`\n📋 Issues found:`);
    console.log(`  - Products with eggOptions: ${productsWithEggOptions}`);
    console.log(`  - Products without price field: ${productsWithoutPrice}`);
    console.log(`  - Products without inStock field: ${productsWithoutInStock}`);

    // Migrate products one by one to ensure proper updates
    console.log('\n🔧 Starting migration...');

    let updateCount = 0;
    for (const product of allProducts) {
      const updates = {
        isEggless: true,
        price: product.basePrice, // Set price = basePrice
        inStock: product.stock > 0, // Derive inStock from stock
        available: product.available !== false ? true : product.available
      };

      // Remove eggOptions if it exists
      const unsetFields = {};
      if (product.eggOptions) {
        unsetFields.eggOptions = 1;
      }

      await Product.updateOne(
        { _id: product._id },
        {
          $set: updates,
          ...(Object.keys(unsetFields).length > 0 && { $unset: unsetFields })
        }
      );
      updateCount++;
    }

    console.log(`✅ Updated ${updateCount} products`);

    // Verify migration
    console.log('\n✔️ Verifying migration...');
    const migratedProducts = await Product.find({});

    let migratedCount = 0;
    let stillHasEggOptions = 0;

    for (const product of migratedProducts) {
      if (product.price === product.basePrice && product.isEggless && !product.eggOptions) {
        migratedCount++;
      }
      if (product.eggOptions) {
        stillHasEggOptions++;
        console.log(`⚠️ Product ${product._id} still has eggOptions`);
      }
    }

    console.log(`\n📊 Migration Results:`);
    console.log(`  - Successfully migrated: ${migratedCount}/${migratedProducts.length}`);
    console.log(`  - Still has eggOptions: ${stillHasEggOptions}`);
    console.log(`\n🎉 Migration complete!`);

    // Show sample of migrated data
    console.log('\n📝 Sample migrated product:');
    const sample = migratedProducts[0];
    console.log(`  Name: ${sample.name}`);
    console.log(`  basePrice: ${sample.basePrice}`);
    console.log(`  price: ${sample.price}`);
    console.log(`  stock: ${sample.stock}`);
    console.log(`  inStock: ${sample.inStock}`);
    console.log(`  isEggless: ${sample.isEggless}`);
    console.log(`  hasEggOptions: ${!!sample.eggOptions}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

// Run migration
migrateProducts();
