# 🧪 Product Testing Guide

## Quick Product Tests

### Test 1: View All Products
**Goal:** Verify all 100 products are in database

**Command:**
```bash
curl http://localhost:5001/api/products | jq '.data | length'
```

**Expected Output:** `100`

---

### Test 2: Verify Subcategory Products

#### Test Chocolate Cakes
```bash
curl "http://localhost:5001/api/products?category=flavor-station&subcategory=chocolate-cakes" | jq '.data | length'
```
**Expected:** 5 products

#### Test Vanilla Cakes
```bash
curl "http://localhost:5001/api/products?category=flavor-station&subcategory=vanilla-cakes" | jq '.data | length'
```
**Expected:** 5 products

#### Test Boy Squad
```bash
curl "http://localhost:5001/api/products?category=kids-themed&subcategory=boy-squad" | jq '.data | length'
```
**Expected:** 5 products

#### Test Girl Power
```bash
curl "http://localhost:5001/api/products?category=kids-themed&subcategory=girl-power" | jq '.data | length'
```
**Expected:** 5 products

#### Test Viral Meme Cakes
```bash
curl "http://localhost:5001/api/products?category=family-friends&subcategory=viral-meme-cakes" | jq '.data | length'
```
**Expected:** 5 products

#### Test Bachelor Bash
```bash
curl "http://localhost:5001/api/products?category=lets-party&subcategory=bachelor-bash" | jq '.data | length'
```
**Expected:** 5 products

---

### Test 3: View Sample Products

#### Get One Chocolate Cake
```bash
curl "http://localhost:5001/api/products?category=flavor-station&subcategory=chocolate-cakes&limit=1" | jq '.data[0]'
```

**Expected Output:**
```json
{
  "_id": "...",
  "name": "Classic Dark Chocolate",
  "description": "Rich dark chocolate with ganache frosting",
  "category": "flavor-station",
  "subcategory": "chocolate-cakes",
  "basePrice": 550,
  "isEggless": true,
  "available": true,
  "featured": true,
  "stock": 50,
  "flavors": [
    {
      "name": "Option 1",
      "priceMultiplier": 1
    },
    {
      "name": "Option 2",
      "priceMultiplier": 1.1
    }
  ],
  "sizes": [
    {
      "name": "4 inch",
      "servings": "2-4",
      "priceMultiplier": 0.8
    },
    {
      "name": "6 inch",
      "servings": "4-6",
      "priceMultiplier": 1
    },
    {
      "name": "8 inch",
      "servings": "8-10",
      "priceMultiplier": 1.3
    }
  ]
}
```

---

### Test 4: Verify All Categories

**Flavor Station (30 products)**
```bash
curl "http://localhost:5001/api/products?category=flavor-station" | jq '.data | length'
```
Expected: 30

**Kids & Themed (25 products)**
```bash
curl "http://localhost:5001/api/products?category=kids-themed" | jq '.data | length'
```
Expected: 25

**Family & Friends (15 products)**
```bash
curl "http://localhost:5001/api/products?category=family-friends" | jq '.data | length'
```
Expected: 15

**Let's Party (30 products)**
```bash
curl "http://localhost:5001/api/products?category=lets-party" | jq '.data | length'
```
Expected: 30

---

### Test 5: Verify All Products Are Eggless

```bash
curl "http://localhost:5001/api/products" | jq '.data | map(select(.isEggless == false)) | length'
```

**Expected Output:** `0` (zero non-eggless products)

---

### Test 6: Check Price Range

**Minimum Price:**
```bash
curl "http://localhost:5001/api/products" | jq '.data | min_by(.basePrice) | {name: .name, price: .basePrice}'
```
**Expected:** ~₹450 (Classic Vanilla)

**Maximum Price:**
```bash
curl "http://localhost:5001/api/products" | jq '.data | max_by(.basePrice) | {name: .name, price: .basePrice}'
```
**Expected:** ~₹900 (Black Forest Supreme)

---

### Test 7: Featured Products

```bash
curl "http://localhost:5001/api/products" | jq '[.data[] | select(.featured == true)] | length'
```

**Expected:** ~30 (approximately 30% of 100)

---

### Test 8: Browser Testing

#### Step 1: Visit Website
Open http://localhost:3000

#### Step 2: Test Category Navigation
1. Click "Flavor Station" in navbar
2. Verify dropdown shows 6 subcategories
3. Click "Chocolate Cakes"
4. Verify 5 chocolate cake products show
5. Click different subcategories
6. Verify products change

#### Step 3: Test Product Details
1. Click on any product
2. Verify name, description, price display
3. Check flavor selector
4. Check size selector
5. Verify prices update with selections

#### Step 4: Test Add to Cart
1. Select flavor
2. Select size
3. Click "Add to Cart"
4. Verify product added to cart
5. Check cart drawer updates

---

### Test 9: Admin Dashboard Testing

#### Login
- Email: admin@cakesman.com
- Password: admin123

#### Test Product Management
1. Go to "Products" section
2. Verify all 100 products list
3. Filter by "Flavor Station"
4. Verify 30 products show
5. Filter by "Chocolate Cakes"
6. Verify 5 products show
7. Click edit on a product
8. Verify all fields editable
9. Make a test edit and save
10. Verify changes saved

---

### Test 10: Specific Product Names

**Verify you can find these products:**

Flavor Station:
- [ ] Classic Dark Chocolate
- [ ] Chocolate Truffle
- [ ] Classic Vanilla
- [ ] Strawberry Cake
- [ ] Classic Red Velvet
- [ ] New York Cheesecake
- [ ] Classic Black Forest

Kids & Themed:
- [ ] Sports Theme Cake
- [ ] Princess Tiara
- [ ] Corporate Blue
- [ ] Love at First Bite
- [ ] Jungle Adventure

Family & Friends:
- [ ] LOL Meme Master
- [ ] Super Mom
- [ ] Hubby Special

Let's Party:
- [ ] Last Night Out
- [ ] She Said Yes
- [ ] Welcome to Freedom
- [ ] Farewell Friend
- [ ] Baby on Board
- [ ] You Did It!

---

### Test 11: Pricing Multipliers

**Test Price Calculations**

Choose any product, example: "Classic Dark Chocolate" (Base: ₹550)

**Test Size Multipliers:**
- 4 inch: 550 × 0.8 = ₹440
- 6 inch: 550 × 1.0 = ₹550
- 8 inch: 550 × 1.3 = ₹715

**Verify:**
1. Click product
2. Select different sizes
3. Verify prices update correctly
4. Compare with calculations above

---

### Test 12: Search & Discovery

**Via Navigation:**
- [ ] Navigate to Flavor Station → Chocolate Cakes → Find "Classic Dark Chocolate"
- [ ] Navigate to Kids & Themed → Boy Squad → Find "Superhero Cake"
- [ ] Navigate to Family & Friends → Mom & Dad → Find "Super Mom"
- [ ] Navigate to Let's Party → Baby on Board → Find "Baby on Board"

**Via Admin:**
- [ ] Filter products by category
- [ ] Filter products by subcategory
- [ ] Sort by price
- [ ] Sort by featured
- [ ] Search by name

---

### Test 13: Mobile Responsiveness

**Desktop:** http://localhost:3000
**Mobile:** http://localhost:3000 (on phone or mobile view)

**Check:**
- [ ] Products display correctly
- [ ] Category dropdown works
- [ ] Product cards stack nicely
- [ ] Add to cart button visible
- [ ] Product detail page readable
- [ ] Admin dashboard usable

---

### Test 14: Database Integrity

**MongoDB Queries:**

```javascript
// Total products
db.products.countDocuments()
// Expected: 100

// Products by category
db.products.aggregate([
  {$group: {_id: '$category', count: {$sum: 1}}},
  {$sort: {count: -1}}
])

// Products by subcategory
db.products.aggregate([
  {$group: {_id: '$subcategory', count: {$sum: 1}}},
  {$sort: {count: -1}}
])

// Non-eggless products
db.products.find({isEggless: false}).count()
// Expected: 0

// Price statistics
db.products.aggregate([
  {$group: {
    _id: null,
    minPrice: {$min: '$basePrice'},
    maxPrice: {$max: '$basePrice'},
    avgPrice: {$avg: '$basePrice'}
  }}
])

// Featured product count
db.products.find({featured: true}).count()
// Expected: ~30
```

---

### Test 15: Performance

**Load Testing:**

```bash
# Get all products (measure response time)
time curl http://localhost:5001/api/products > /dev/null

# Get category (measure response time)
time curl "http://localhost:5001/api/products?category=flavor-station" > /dev/null

# Get subcategory (measure response time)
time curl "http://localhost:5001/api/products?category=flavor-station&subcategory=chocolate-cakes" > /dev/null
```

**Expected:**
- All queries < 500ms
- Most queries < 200ms

---

## ✅ Test Checklist

Complete these tests in order:

- [ ] Test 1: View all 100 products
- [ ] Test 2: Verify 5 products in each subcategory
- [ ] Test 3: View sample product details
- [ ] Test 4: Verify all 5 categories
- [ ] Test 5: Verify all products are eggless
- [ ] Test 6: Check price range (450-900)
- [ ] Test 7: Check featured products (~30)
- [ ] Test 8: Browser navigation and display
- [ ] Test 9: Admin dashboard functionality
- [ ] Test 10: Find specific products by name
- [ ] Test 11: Verify price multipliers
- [ ] Test 12: Search and discovery
- [ ] Test 13: Mobile responsiveness
- [ ] Test 14: Database integrity
- [ ] Test 15: Performance metrics

---

## 🎯 Success Criteria

If all tests pass:
✅ Product system is fully operational
✅ 100 products properly stored
✅ All categories and subcategories working
✅ Frontend displays products correctly
✅ Admin can manage products
✅ Pricing calculations accurate
✅ Performance acceptable
✅ Ready for production

---

## 🐛 Troubleshooting

**If tests fail:**

1. Check backend is running
   ```bash
   curl http://localhost:5001/
   ```

2. Check MongoDB is connected
   ```bash
   mongo
   > use cakesman_bakery
   > db.products.countDocuments()
   ```

3. Check frontend is running
   ```
   http://localhost:3000
   ```

4. Check for errors in browser console (F12)

5. Check backend logs for errors

6. Re-run seed script
   ```bash
   npm run seed
   ```

---

**All tests should take about 15-20 minutes to complete!**
