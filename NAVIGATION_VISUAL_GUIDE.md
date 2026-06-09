# Navigation Structure - Visual Guide

## Complete Category Hierarchy

```
🏠 NAVBAR (Fixed Top)
│
├── 🎂 Simple Flavour Cakes (Category)
│   ├── Chocolate Cakes
│   ├── Vanilla Cakes
│   ├── Fruit Cakes
│   ├── Red Velvet
│   ├── Cheesecakes
│   └── Black Forest
│
├── 🎨 Cakes (Category)
│   ├── All
│   ├── Cakes for Boys
│   ├── Cakes for Girls
│   ├── Cakes for Colleges / Offices
│   ├── Anniversary / Wedding Cakes
│   └── Theme Based Cakes (Jungle / Ocean / Vacation)
│
├── ✨ Special Designs (Category)
│   ├── All
│   ├── Meme Cake
│   ├── Cake for Mom / Dad
│   └── Cake for Husband / Wife
│
├── 🎉 Cake by Occasion (Category)
│   ├── All
│   ├── Bachelor Party
│   ├── Engagement Cakes
│   ├── Retirement Cake
│   ├── Farewell Cake
│   ├── Baby Shower
│   ├── Mom To Be
│   └── Congratulations Cake
│
└── 🛠️ Custom Cake (ACTION - Shows Modal)
    ├── 📞 Call Button → tel:+918808140339
    ├── 💬 WhatsApp Button → Direct chat
    └── Message: "For custom designs and bulk orders..."
```

## Interactive Flow Chart

```
User opens navbar
│
├─→ Hovers over category
│   └─→ Dropdown appears with subcategories
│       └─→ Clicks subcategory
│           └─→ /products?category=X&subcategory=Y
│               └─→ ProductList shows filtered items
│
└─→ Clicks on category button directly
    ├─→ Regular category
    │   └─→ /category/{categoryId}
    │       └─→ CategoryPage loads all products
    │
    └─→ Custom Cake
        └─→ CustomCakeModal opens
            ├─→ Call Button
            │   └─→ Opens phone dialer
            └─→ WhatsApp Button
                └─→ Opens WhatsApp chat
```

## Component Architecture

```
Navbar.jsx (Main Navigation Component)
│
├── Logo Section
│   ├── Logo Image (SVG)
│   └── Brand Name
│
├── SearchBar Component
│   ├── Input Field
│   ├── Category Suggestions
│   └── Product Results
│
├── Top Right Section
│   ├── Cart Link
│   │   └── Cart Count Badge
│   │
│   └── User Profile
│       ├── Login Button (if not authenticated)
│       ├── Admin Panel (if admin)
│       └── Profile Dropdown (if customer)
│           ├── View Profile
│           ├── My Orders
│           └── Logout
│
└── Bottom Category Menu
    └── For each CATEGORY in CATEGORIES
        ├── Category Button
        │   ├── Emoji
        │   ├── Category Name
        │   └── Chevron Icon (if has subcategories)
        │
        └── On Hover: Dropdown Menu
            └── For each SUBCATEGORY
                └── Subcategory Link
                    └── Navigate to /products
```

## Data Flow Diagram

```
categories.js (Central Configuration)
│
├── CATEGORIES Array
│   ├── [0] Simple Flavour Cakes {id, name, emoji, description, subcategories[]}
│   ├── [1] Cakes {id, name, emoji, description, subcategories[]}
│   ├── [2] Special Designs {id, name, emoji, description, subcategories[]}
│   ├── [3] Cake by Occasion {id, name, emoji, description, subcategories[]}
│   └── [4] Custom Cake {id, name, emoji, description, isAction: true, subcategories: []}
│
├── Helper Functions
│   ├── getCategoryById(id)
│   └── getSubcategoryById(categoryId, subcategoryId)
│
├── Product Customization Data
│   ├── FLAVORS[] (Vanilla, Chocolate, Strawberry, etc.)
│   ├── SIZES[] (Small, Medium, Large, 2-Tier, 3-Tier, Sheet)
│   ├── EGG_OPTIONS[] (Regular, Egg-Free)
│   └── SAMPLE_PRODUCTS[] (Sample data for fallback)
│
└── Usage in Components
    ├── Navbar.jsx
    │   ├── Maps CATEGORIES to buttons
    │   ├── Renders dropdown menus from subcategories
    │   └── Handles custom-cake action
    │
    ├── CategoryPage.jsx
    │   ├── Gets categoryId from URL params
    │   ├── Finds category using getCategoryById()
    │   ├── Filters products by category.name
    │   └── Allows subcategory filtering
    │
    ├── SearchBar (in Navbar)
    │   ├── Extracts category names for search suggestions
    │   └── Shows matching categories in dropdown
    │
    └── CustomCakeModal.jsx
        ├── Shows phone number
        ├── Provides call button
        └── Provides WhatsApp link
```

## State Management

```
Navbar Component State:
├── isLoginModalOpen (boolean)
├── isCustomCakeModalOpen (boolean)
├── isProfileMenuOpen (boolean)
├── activeCategory (string | null)
└── hoveredCategory (string | null)
    └── Used to show/hide dropdown on hover

SearchBar State:
├── searchQuery (string)
├── searchResults (array)
├── isDropdownOpen (boolean)
└── isLoading (boolean)
```

## Styling Details

### Category Button States
```
Normal State:
- Color: text-gray-700
- Background: transparent
- Hover: text-pink-600, bg-pink-50

Custom Cake State:
- Color: text-white
- Background: bg-rose-600
- Hover: bg-rose-700
```

### Dropdown Menu
```
Position: absolute left-0 top-100
Width: w-56
Background: white with border
Shadow: shadow-xl
Animation: opacity and translate transitions
Border: border-gray-200
```

### Subcategory Links
```
Padding: px-4 py-2
Text: text-sm, text-gray-700
Hover: bg-pink-50, text-pink-600
Rounded: rounded corners
```

## Mobile Responsiveness

### Breakpoints
```
sm (640px):
- Brand name hidden on mobile
- Search bar maintains full width
- Navbar stacks vertically

md (768px):
- All elements visible
- Full horizontal layout
- Dropdown menus centered

lg (1024px) and above:
- Optimal spacing
- Full feature set
```

## Category IDs & Routes

```
Category ID              Route                          Modal?
─────────────────────────────────────────────────────────────
simple-flavour-cakes    /category/simple-flavour-cakes No
cakes                   /category/cakes                No
special-designs         /category/special-designs      No
cake-by-occasion        /category/cake-by-occasion     No
custom-cake             (No route)                     Yes → Modal

Subcategory Filtering:
/products?category={categoryId}&subcategory={subcategoryId}
```

## Event Handlers

### Category Button Click
```javascript
function handleCategoryClick(categoryId) {
  if (isAction) {
    // Custom Cake
    setIsCustomCakeModalOpen(true)
  } else {
    // Regular Category
    navigate(`/category/${categoryId}`)
  }
}
```

### Hover Effects
```javascript
onMouseEnter={() => !category.isAction && setHoveredCategory(category.id)}
onMouseLeave={() => setHoveredCategory(null)}
```

### Modal Toggle
```javascript
<CustomCakeModal 
  isOpen={isCustomCakeModalOpen} 
  onClose={() => setIsCustomCakeModalOpen(false)} 
/>
```

## Accessibility Features

✅ **Keyboard Navigation**
- Tab through categories
- Enter to select
- Escape to close modal

✅ **Semantic HTML**
- Link elements for navigation
- Button elements for actions
- Proper heading hierarchy

✅ **ARIA Labels** (can be enhanced)
- aria-label on buttons
- role="navigation" on nav element
- aria-expanded for dropdowns

✅ **Color Contrast**
- Meets WCAG AA standards
- Text readable on all backgrounds

## Performance Optimizations

✅ **No Unnecessary Re-renders**
- Categories loaded from static data
- Memoized functions
- Conditional rendering

✅ **Smooth Animations**
- CSS transitions (200ms)
- No layout thrashing
- Hardware-accelerated transforms

✅ **Lightweight Components**
- CustomCakeModal lazy-loaded
- No heavy dependencies
- Efficient state management

---

**Navigation Structure Version**: 2.0
**Status**: ✅ Production Ready
**Last Updated**: Navigation Restructure Complete
