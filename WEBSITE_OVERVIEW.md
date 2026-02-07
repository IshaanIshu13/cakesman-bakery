# 🍰 Cakesman Bakery - Complete Website Overview

**A comprehensive guide to how the Cakesman Bakery website works, what it can do, and the technologies used.**

---

## 📖 Table of Contents

1. [High-Level Overview](#high-level-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Features & Capabilities](#features--capabilities)
5. [Frontend Details](#frontend-details)
6. [Backend Details](#backend-details)
7. [Database Structure](#database-structure)
8. [How It All Works Together](#how-it-all-works-together)
9. [Dependencies & Libraries](#dependencies--libraries)
10. [Project Structure](#project-structure)

---

## High-Level Overview

The **Cakesman Bakery** website is a full-stack web application designed to manage a bakery business. It provides:

- **Customer Interface:** Browse products, add to cart, place orders
- **Admin Dashboard:** Manage products, orders, and customer data
- **Real-time Updates:** Instant notifications via Socket.io
- **Secure Authentication:** JWT-based login system with role-based access

The system operates on a **client-server architecture** with:
- **Frontend:** React application running in the browser
- **Backend:** Express.js REST API server
- **Database:** MongoDB for data persistence
- **Real-time Layer:** Socket.io for live updates

---

## Technology Stack

### **Frontend Technologies**

| Technology | Version | Purpose |
|---|---|---|
| **React** | 18.3.1 | UI library for building user interfaces |
| **React Router** | 6.28.0 | Client-side routing and navigation |
| **Tailwind CSS** | Latest | Utility-first CSS framework for styling |
| **Axios** | Latest | HTTP client for API requests |
| **Socket.io Client** | Latest | Real-time bidirectional communication |
| **Lucide React** | Latest | Icon library for UI components |
| **Sonner** | Latest | Toast notifications for user feedback |

**Language:** JavaScript (JSX syntax for React components)

### **Backend Technologies**

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | Latest LTS | JavaScript runtime environment |
| **Express.js** | Latest | Web framework for building REST API |
| **Mongoose** | Latest | MongoDB ODM (Object Document Mapper) |
| **bcryptjs** | Latest | Password hashing for security |
| **jsonwebtoken (JWT)** | Latest | Token-based authentication |
| **Socket.io** | Latest | Real-time server-side communication |
| **CORS** | Latest | Cross-Origin Resource Sharing middleware |
| **dotenv** | Latest | Environment variable management |

**Language:** JavaScript (Node.js)

### **Database Technology**

| Technology | Provider | Purpose |
|---|---|---|
| **MongoDB** | MongoDB Atlas (Cloud) | NoSQL database for data storage |
| **Mongoose** | Node package | Schema validation and modeling |

**Data Format:** JSON documents

### **Development Tools**

| Tool | Purpose |
|---|---|
| **npm** | Package manager for dependencies |
| **craco** | Create React App configuration override |
| **PostCSS** | CSS processing for Tailwind |
| **Git** | Version control |
| **VS Code** | Code editor (recommended) |

---

## Architecture

### **System Architecture Diagram**

```
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                          │
│            (Runs React Frontend on Port 3000)            │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │         React App (frontend/)                   │   │
│  │  • Login/Signup Pages                           │   │
│  │  • Home/Products Page                           │   │
│  │  • Admin Dashboard                              │   │
│  │  • Cart & Checkout                              │   │
│  │  • Orders Page                                  │   │
│  └─────────────────────────────────────────────────┘   │
│              ↓ HTTP Requests (REST API)                 │
│              ↓ WebSocket Connection (Socket.io)         │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ↓
┌──────────────────────────────────────────────────────────┐
│         EXPRESS.JS BACKEND (Port 5001)                   │
│  backend/server.js runs Node.js server                   │
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │  REST API Endpoints (/api/...)                     │ │
│  │  • /auth (login, signup, getMe)                    │ │
│  │  • /products (CRUD operations)                     │ │
│  │  • /orders (create, view, update status)           │ │
│  │  • /cart (add, remove, view items)                 │ │
│  │  • /customers (admin analytics)                    │ │
│  └────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Controllers (Request Handlers)                    │ │
│  │  • authController.js                              │ │
│  │  • productController.js                           │ │
│  │  • orderController.js                             │ │
│  │  • cartController.js                              │ │
│  │  • customerController.js                          │ │
│  └────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Middleware (Processing)                           │ │
│  │  • Authentication (JWT verification)               │ │
│  │  • CORS handling                                   │ │
│  │  • Request logging                                │ │
│  │  • Error handling                                 │ │
│  └────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Socket.io Server                                  │ │
│  │  • Real-time product updates                       │ │
│  │  • Order status notifications                      │ │
│  │  • Room-based messaging                            │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────┬───────────────────────────────────────┘
                   │ Mongoose Driver
                   ↓
┌──────────────────────────────────────────────────────────┐
│           MONGODB ATLAS (Cloud Database)                 │
│      cluster0.jefmvix.mongodb.net/cakesman-bakery       │
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Collections (Tables)                              │ │
│  │  • users (customer & admin accounts)               │ │
│  │  • products (bakery items catalog)                 │ │
│  │  • orders (customer purchase records)              │ │
│  │  • carts (temporary shopping carts)                │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### **Data Flow Example: Customer Login**

```
1. User enters email/password in Login form
   ↓
2. Frontend sends POST request to /api/auth/login
   {email: "user@example.com", password: "password123"}
   ↓
3. Backend receives request in authController
   ↓
4. Queries MongoDB users collection for matching email
   ↓
5. Compares password using bcryptjs
   ↓
6. If correct, generates JWT token and returns user data
   {token: "eyJhbGciOiJIUzI1NiIs...", user: {_id, name, email}}
   ↓
7. Frontend stores token in localStorage
   ↓
8. Frontend includes token in all future API requests
   Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
   ↓
9. Backend verifies token before processing requests
   ↓
10. User is authenticated and can access protected pages
```

---

## Features & Capabilities

### **Customer Features**

#### 🛍️ **Product Browsing**
- View all available bakery products
- See product details (name, price, category, discount)
- Filter by category
- Real-time updates when products change (via Socket.io)

#### 👤 **Account Management**
- Sign up with email and password
- Secure login with JWT tokens
- View profile information
- Automatic session persistence (stays logged in after page reload)

#### 🛒 **Shopping Cart**
- Add products to cart
- View cart contents
- Remove items from cart
- See total price and item count

#### 📦 **Order Management**
- Create orders from cart items
- View order history
- See order status (pending, accepted, baking, out for delivery, completed)
- Real-time order status updates

#### 💳 **Checkout**
- Specify delivery address
- Add delivery time preference
- Add special instructions/notes
- Confirm order with total price

### **Admin Features**

#### 🏪 **Product Management**
- View all products in inventory
- Add new products with details (name, price, category, discount, stock status)
- Edit existing products
- Delete products
- Real-time product list updates (auto-refresh when other admins make changes)
- Manage categories and subcategories

#### 📊 **Order Management**
- View all customer orders
- Filter orders by status
- Update order status (pending → accepted → baking → out for delivery → completed)
- See detailed order information (items, total, customer, delivery address)
- Track delivery information

#### 👥 **Customer Analytics**
- View total number of registered customers
- See customer list with account details
- Search for specific customers
- View customer order history

#### 🔐 **Admin Dashboard Access**
- Secure admin login
- Admin-only access control
- Session verification
- Logout functionality

### **System Features**

#### 🔐 **Security**
- Password hashing using bcryptjs (10 salt rounds)
- JWT token-based authentication
- Bearer token format for secure API requests
- 7-day token expiration
- Protected routes that require authentication
- Admin route verification (isAdmin flag)
- CORS enabled for frontend only
- Error messages that don't expose sensitive data

#### 📡 **Real-time Updates (Socket.io)**
- Product changes broadcast to all connected users
- Order status updates sent in real-time
- Admin notifications for new orders
- Room-based messaging (admin/customer/specific user)
- Automatic connection/disconnection handling
- Fallback to polling if WebSocket unavailable

#### 📝 **Logging & Debugging**
- Request/response logging in backend terminal
- API call logging in browser console
- Timestamp for each log entry
- Shows request method, path, and HTTP status
- Error logging with full stack traces
- Auth status tracking

#### 💾 **Data Persistence**
- MongoDB stores all data persistently
- Automatic backups via MongoDB Atlas
- Data validation with Mongoose schemas
- Transaction support for complex operations
- Fallback to mock data if database unavailable

#### ⚡ **Performance**
- Frontend build optimized for production
- Lazy loading of components
- Efficient database queries with indexes
- Socket.io room-based optimization
- Request debouncing and throttling
- Caching strategies implemented

---

## Frontend Details

### **Frontend Technologies Used**

#### **React (UI Library)**
- Version 18.3.1
- Component-based architecture
- Functional components with hooks
- State management with Context API (useContext)
- Lifecycle management with useEffect

#### **React Router (Navigation)**
- Version 6.28.0
- Client-side routing without page reloads
- Route protection for authenticated pages
- Programmatic navigation (useNavigate)
- URL-based page management

#### **Tailwind CSS (Styling)**
- Utility-first CSS framework
- Pre-built responsive design system
- Dark mode support
- Mobile-first approach
- Customizable theme configuration

#### **Axios (HTTP Client)**
- Promise-based HTTP requests
- Request/response interceptors
- Automatic token injection in headers
- Error handling and retry logic
- Request cancellation support

#### **Socket.io Client (Real-time)**
- WebSocket connections
- Event-based communication
- Room joining/leaving
- Automatic reconnection
- Fallback to long-polling

### **Frontend Project Structure**

```
frontend/
├── public/
│   ├── index.html          # Main HTML file
│   ├── manifest.json       # PWA manifest
│   └── images/             # Static images
│
├── src/
│   ├── App.jsx             # Main app component with routing
│   ├── index.js            # React entry point
│   ├── index.css           # Global styles
│   │
│   ├── pages/              # Full page components
│   │   ├── LoginPage.jsx   # Login/Signup page with tabs
│   │   ├── HomePage.jsx    # Product listing
│   │   ├── AdminDashboard.jsx  # Admin panel (3 tabs)
│   │   ├── CartPage.jsx    # Shopping cart
│   │   ├── OrderPage.jsx   # Order history
│   │   └── ProfilePage.jsx # User profile
│   │
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.jsx      # Top navigation bar
│   │   ├── ProductCard.jsx # Product display card
│   │   ├── ProductManagement.jsx # Admin product CRUD
│   │   ├── OrderManagement.jsx   # Admin order management
│   │   ├── CustomerManagement.jsx # Admin customer view
│   │   └── FormInputs.jsx  # Reusable form fields
│   │
│   ├── context/            # Global state management
│   │   ├── AuthContext.js  # Authentication state & methods
│   │   └── SocketContext.js # Socket.io state
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.js      # Access auth context
│   │   ├── useSocket.js    # Socket.io setup
│   │   └── useLocalStorage.js # Local storage management
│   │
│   └── utils/              # Utility functions
│       ├── axiosInstance.js # Axios setup with interceptors
│       ├── api.js          # API function wrappers
│       └── helpers.js      # General helper functions
│
├── .env.local              # Environment variables
├── package.json            # Dependencies list
├── tailwind.config.js      # Tailwind configuration
├── craco.config.js         # Create React App override
└── postcss.config.js       # PostCSS configuration
```

### **Key Frontend Components**

#### **AuthContext.js**
Purpose: Global authentication state management

```javascript
{
  user: { _id, name, email, isAdmin },
  token: "JWT token string",
  login(email, password),    // Customer login
  register(name, email, password), // New account
  loginAdmin(email),         // Admin login
  logout(),                  // Clear auth
  isAdmin: boolean,
  useAuth hook for access
}
```

#### **App.jsx**
Purpose: Main routing and app structure

```
Routes:
  / → HomePage (public, shows products)
  /login → LoginPage (public, signup/login)
  /admin → AdminDashboard (private, admin only)
  /cart → CartPage (private, authenticated)
  /orders → OrderPage (private, authenticated)
  /profile → ProfilePage (private, authenticated)
```

#### **API Calls (api.js)**
All backend communication goes through:

```javascript
api.register(name, email, password)
api.login(email, password)
api.getMe()
api.logout()
api.getAllProducts()
api.createProduct(data)
api.updateProduct(id, data)
api.deleteProduct(id)
api.getCart()
api.addToCart(productId, quantity)
api.createOrder(items, address, time)
api.getOrders()
api.getAllOrders()  // Admin only
api.updateOrderStatus(id, status)  // Admin only
api.getCustomers()  // Admin only
api.getCustomerDetails(id)  // Admin only
```

---

## Backend Details

### **Backend Technologies Used**

#### **Node.js**
- JavaScript runtime environment
- Non-blocking, event-driven architecture
- Single-threaded with event loop
- npm package management

#### **Express.js**
- Minimalist web framework
- Routing for different endpoints
- Middleware support (CORS, logging, auth)
- Request/response handling
- Error handling and status codes

#### **MongoDB with Mongoose**
- NoSQL document database
- Mongoose for schema validation
- Object modeling
- Query building
- Hooks for data processing

#### **JWT (JSON Web Tokens)**
- Stateless authentication
- Token generation and verification
- Payload contains user data
- Expiration (7 days)
- Secure transmission via Bearer tokens

#### **bcryptjs**
- Password hashing library
- 10 salt rounds (secure)
- One-way encryption
- Can't decrypt, only verify

#### **Socket.io**
- Real-time bidirectional communication
- Event-based messaging
- Room-based broadcasting
- Fallback to HTTP long-polling
- Connection state management

### **Backend Project Structure**

```
backend/
├── server.js              # Main server entry point
├── .env                   # Environment variables
├── package.json           # Dependencies
│
├── config/
│   └── db.js              # MongoDB connection setup
│
├── middleware/
│   └── auth.js            # JWT verification middleware
│
├── models/                # Mongoose data schemas
│   ├── User.js            # User account schema
│   ├── Product.js         # Product catalog schema
│   ├── Order.js           # Order history schema
│   └── Cart.js            # Shopping cart schema
│
├── controllers/           # Request handlers/business logic
│   ├── authController.js  # Login, signup, getMe
│   ├── productController.js # Product CRUD
│   ├── orderController.js # Order management
│   ├── cartController.js  # Cart operations
│   └── customerController.js # Admin customer data
│
├── routes/                # API endpoint definitions
│   ├── authRoutes.js      # /api/auth/*
│   ├── productRoutes.js   # /api/products/*
│   ├── orderRoutes.js     # /api/orders/*
│   ├── cartRoutes.js      # /api/cart/*
│   └── customerRoutes.js  # /api/customers/*
│
└── services/
    └── socketService.js   # Socket.io event handlers
```

### **API Endpoints (REST)**

#### **Authentication (`/api/auth`)**
```
POST /auth/register
  Body: { name, email, password }
  Returns: { success: true, data: { _id, name, email, isAdmin }, token }

POST /auth/login
  Body: { email, password }
  Returns: { success: true, data: { _id, name, email, isAdmin }, token }

GET /auth/me (requires token)
  Returns: { success: true, data: { _id, name, email, isAdmin } }

PUT /auth/update (requires token)
  Body: { name, email }
  Returns: Updated user data
```

#### **Products (`/api/products`)**
```
GET /products
  Returns: Array of all products
  
POST /products (admin only)
  Body: { name, category, price, discount, inStock, description, image }
  Returns: Created product

GET /products/:id
  Returns: Single product details

PUT /products/:id (admin only)
  Body: Updated product fields
  Returns: Updated product

DELETE /products/:id (admin only)
  Returns: Success message
```

#### **Orders (`/api/orders`)**
```
GET /orders (requires token)
  Returns: Current user's orders

POST /orders (requires token)
  Body: { items, totalPrice, deliveryAddress, deliveryTime, notes }
  Returns: Created order

GET /orders/:id (requires token)
  Returns: Order details

PATCH /orders/:id/status (admin only)
  Body: { status }
  Returns: Updated order

GET /orders/admin/all (admin only)
  Returns: All orders in system
```

#### **Cart (`/api/cart`)**
```
GET /cart (requires token)
  Returns: Current user's cart items

POST /cart (requires token)
  Body: { productId, quantity }
  Returns: Updated cart

DELETE /cart/:itemId (requires token)
  Returns: Updated cart after removal

PUT /cart/:itemId (requires token)
  Body: { quantity }
  Returns: Updated item
```

#### **Customers (`/api/customers`)**
```
GET /customers (admin only)
  Returns: All customers

GET /customers/:id (admin only)
  Returns: Specific customer details

GET /customers/search?query=... (admin only)
  Returns: Customers matching search
```

### **Server.js Explained**

```javascript
// 1. Load environment variables from .env
const PORT = process.env.PORT || 5001
const MONGO_URI = process.env.MONGO_URI
const JWT_SECRET = process.env.JWT_SECRET

// 2. Create Express app
const app = express()

// 3. Setup middleware
app.use(cors({origin: "http://localhost:3000"}))  // Allow frontend
app.use(express.json())  // Parse JSON requests
app.use(requestLogger)   // Log all requests

// 4. Connect to MongoDB
connectDB()  // In db.js

// 5. Setup routes
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/customers", customerRoutes)

// 6. Setup Socket.io for real-time
const io = require("socket.io")(server, {cors: {origin: "http://localhost:3000"}})
io.on("connection", (socket) => {
  socket.emit("user_role", {role, userId})
  socket.on("user_role", handleUserRole)
})

// 7. Start server
server.listen(PORT, () => console.log(`Server on port ${PORT}`))
```

---

## Database Structure

### **MongoDB Collections**

#### **Users Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed with bcryptjs),
  isAdmin: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}

Example:
{
  _id: "507f1f77bcf86cd799439011",
  name: "John Doe",
  email: "john@example.com",
  password: "$2a$10$encrypted...",  // hashed
  isAdmin: false,
  createdAt: 2024-01-15T10:30:00Z,
  updatedAt: 2024-01-15T10:30:00Z
}
```

#### **Products Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  category: String,
  subcategory: String,
  price: Number,
  discount: Number (0-100),
  inStock: Boolean,
  image: String (URL),
  description: String,
  createdAt: Date,
  updatedAt: Date
}

Example:
{
  _id: "507f1f77bcf86cd799439012",
  name: "Chocolate Cake",
  category: "Cakes",
  subcategory: "Chocolate",
  price: 450,
  discount: 10,
  inStock: true,
  image: "https://...",
  description: "Rich chocolate cake",
  createdAt: 2024-01-10T08:00:00Z,
  updatedAt: 2024-01-10T08:00:00Z
}
```

#### **Orders Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (reference to Users),
  items: [
    {
      productId: ObjectId (reference to Products),
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  total: Number,
  status: String (pending|accepted|baking|out_for_delivery|completed|cancelled),
  deliveryAddress: String,
  deliveryTime: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}

Example:
{
  _id: "507f1f77bcf86cd799439013",
  userId: "507f1f77bcf86cd799439011",
  items: [
    {productId: "507f1f77bcf86cd799439012", name: "Chocolate Cake", price: 405, quantity: 1}
  ],
  total: 405,
  status: "out_for_delivery",
  deliveryAddress: "123 Main St, City",
  deliveryTime: "6:00 PM",
  notes: "Please ring doorbell",
  createdAt: 2024-01-20T14:00:00Z,
  updatedAt: 2024-01-20T18:00:00Z
}
```

#### **Carts Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (reference to Users),
  items: [
    {
      productId: ObjectId (reference to Products),
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  createdAt: Date,
  updatedAt: Date
}

Example:
{
  _id: "507f1f77bcf86cd799439014",
  userId: "507f1f77bcf86cd799439011",
  items: [
    {productId: "507f1f77bcf86cd799439012", name: "Chocolate Cake", price: 405, quantity: 2},
    {productId: "507f1f77bcf86cd799439015", name: "Vanilla Cupcake", price: 50, quantity: 6}
  ],
  createdAt: 2024-01-20T15:00:00Z,
  updatedAt: 2024-01-20T15:30:00Z
}
```

### **Data Relationships**

```
Users
  ├── has many Orders (via userId)
  ├── has many Carts (via userId)
  └── can be Admin (isAdmin flag)

Products
  ├── referenced in Orders items
  ├── referenced in Carts items
  └── has category/subcategory

Orders
  └── belongs to User (via userId)
  └── contains Products (via productId in items)

Carts
  └── belongs to User (via userId)
  └── contains Products (via productId in items)
```

---

## How It All Works Together

### **Complete User Flow: Customer Signup & Order**

```
1. SIGNUP
   User opens http://localhost:3000
   Sees LoginPage with two tabs: Customer | Admin
   
   Fills form: Name, Email, Password
   Clicks "Sign Up"
   
   Frontend:
   - Validates input
   - Calls api.register(name, email, password)
   - Sends POST /api/auth/register to backend
   
   Backend:
   - Receives request in authController.register()
   - Validates email doesn't exist
   - Hashes password with bcryptjs
   - Creates new User document in MongoDB
   - Generates JWT token (expires in 7 days)
   - Returns {token, user: {_id, name, email, isAdmin}}
   
   Frontend:
   - Receives token and user data
   - Stores token in localStorage
   - Updates AuthContext state
   - Navigates to HomePage

2. BROWSE PRODUCTS
   User sees list of all products
   Data comes from: /api/products endpoint
   
   Frontend:
   - On mount, calls api.getAllProducts()
   - Sends GET /api/products to backend
   
   Backend:
   - authController calls productController.getAllProducts()
   - Queries MongoDB products collection
   - Returns array of all products
   - Frontend displays with images, prices, categories

3. ADD TO CART
   User clicks "Add to Cart" on product
   
   Frontend:
   - Calls api.addToCart(productId, quantity)
   - Sends POST /api/cart with {productId, quantity}
   - Includes Authorization: Bearer token in header
   
   Backend auth.js middleware:
   - Extracts token from Authorization header
   - Verifies JWT signature using JWT_SECRET
   - Decodes token to get userId
   - Attaches user to request (req.user)
   
   Backend cartController.addToCart():
   - Finds or creates cart for user
   - Adds product to cart items
   - Saves to MongoDB
   - Returns updated cart
   
   Frontend:
   - Updates cart state
   - Shows notification "Added to cart"
   - Increments cart count icon

4. CHECKOUT
   User clicks cart icon, reviews items
   Enters delivery address and time
   Clicks "Place Order"
   
   Frontend:
   - Validates address and time
   - Calls api.createOrder({items, address, time, total})
   - Sends POST /api/orders
   
   Backend orderController.createOrder():
   - Validates all items in stock
   - Calculates total price
   - Creates Order document in MongoDB
   - Clears user's cart
   - Broadcasts order via Socket.io to admin
   - Returns order confirmation
   
   Frontend:
   - Shows success message
   - Navigates to Orders page
   - Socket.io receives update, shows notification

5. REAL-TIME ORDER UPDATE (Socket.io)
   Admin goes to dashboard and updates order status
   Changes status from "pending" to "accepted"
   
   Frontend admin:
   - Clicks status button
   - Calls api.updateOrderStatus(orderId, "accepted")
   
   Backend:
   - Updates order in MongoDB
   - Emits Socket.io event: "order_status_changed"
   - Sends to rooms: admin, customer:{userId}
   
   Frontend customer:
   - Receives Socket.io event
   - Updates order status in real-time
   - Shows notification "Order accepted!"
   - No page refresh needed
```

### **Authentication Token Flow**

```
1. LOGIN
   POST /api/auth/login {email, password}
   ↓
   Backend hashes password, compares with DB
   ↓
   Generates JWT token:
   Header: {alg: "HS256", typ: "JWT"}
   Payload: {userId, email, isAdmin, iat, exp}
   Signature: HMAC(header.payload, JWT_SECRET)
   ↓
   Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ↓
   Returns token to frontend

2. STORE TOKEN
   Frontend stores in localStorage:
   localStorage.setItem("token", token)
   localStorage.setItem("user", JSON.stringify(user))

3. USE TOKEN
   Frontend includes in all requests:
   axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
   ↓
   Every API call adds header:
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

4. VERIFY TOKEN
   Backend middleware (auth.js):
   1. Extracts token from Authorization header
   2. Verifies signature using JWT_SECRET
   3. Checks if expired (exp vs current time)
   4. Decodes payload to get userId
   5. Attaches user to request (req.user)
   6. If invalid, returns 401 Unauthorized

5. LOGOUT
   Frontend:
   - Removes token from localStorage
   - Clears user data
   - Updates AuthContext
   - Backend has no logout (stateless)
   - Token expires after 7 days anyway
```

### **How Socket.io Works**

```
SETUP:
1. User opens browser to http://localhost:3000
2. React app mounts, calls useSocket hook
3. Socket.io client connects to backend (ws:// or fallback)
4. Emits event: "user_role" with {role, userId}

PRODUCT UPDATE (Admin):
1. Admin clicks "Update Product"
2. Frontend sends PUT /api/products/:id
3. Backend updates MongoDB
4. Backend Socket.io broadcasts: "product_updated" to all clients
5. All users see product update instantly (no refresh needed)

ORDER UPDATE (Real-time):
1. Admin changes order status
2. Backend updates MongoDB and broadcasts "order_status_changed"
3. Event sent to rooms: "admin" and "customer:{userId}"
4. Only relevant users receive notification
5. Frontend updates order status immediately

ROOM-BASED MESSAGING:
- Every user joins rooms when they connect
- Admin joins: "admin" room
- Customer joins: "customer" and "customer:{userId}" rooms
- Messages targeted to specific users (not global broadcast)
- Reduces network traffic and database queries
```

---

## Dependencies & Libraries

### **Frontend Dependencies (package.json)**

```json
{
  "dependencies": {
    "react": "^18.3.1",           // UI library
    "react-dom": "^18.3.1",       // React DOM rendering
    "react-router-dom": "^6.28.0", // Routing
    "axios": "^latest",            // HTTP client
    "socket.io-client": "^latest", // Real-time client
    "tailwindcss": "^latest",      // Styling
    "lucide-react": "^latest",     // Icons
    "sonner": "^latest",           // Notifications
    "craco": "^latest"             // Create React App config
  },
  "devDependencies": {
    "tailwindcss": "^latest",
    "postcss": "^latest",
    "autoprefixer": "^latest"
  }
}
```

### **Backend Dependencies (package.json)**

```json
{
  "dependencies": {
    "express": "^latest",         // Web framework
    "mongoose": "^latest",        // MongoDB ODM
    "mongodb": "^latest",         // MongoDB driver
    "bcryptjs": "^latest",        // Password hashing
    "jsonwebtoken": "^latest",    // JWT tokens
    "socket.io": "^latest",       // Real-time server
    "cors": "^latest",            // Cross-origin
    "dotenv": "^latest",          // Environment variables
    "body-parser": "^latest"      // JSON parsing
  }
}
```

### **How Dependencies Work Together**

```
Frontend:
  React renders components
    ↓ useContext
  AuthContext stores user & token
    ↓ useEffect
  useSocket initializes Socket.io connection
    ↓ socket.on("events")
  Listens for real-time updates
    ↓ axios interceptor
  Adds token to all requests
    ↓ api.js functions
  Calls backend endpoints
    ↓
  Display data with Tailwind + Lucide icons
    ↓
  Show notifications with Sonner
    ↓
  Navigate between pages with React Router

Backend:
  Node.js server runs Express app
    ↓ middleware
  CORS allows frontend requests
  Body-parser parses JSON
  Auth middleware verifies tokens
    ↓ routes
  Route handlers call controllers
    ↓ controllers
  Business logic validates data
    ↓ models
  Mongoose validates schema
    ↓ driver
  MongoDB driver sends DB queries
    ↓ MongoDB Atlas
  Cloud database stores/retrieves data
    ↓ Socket.io
  Broadcasts updates to all connected clients
```

---

## Project Structure (Complete)

```
d:\Cakesman-Bakery/
│
├── 📁 backend/
│   ├── server.js                      # Main server file
│   ├── .env                           # Database & JWT config
│   ├── package.json                   # Backend dependencies
│   ├── railway.toml                   # Railway deployment config
│   │
│   ├── 📁 config/
│   │   └── db.js                      # MongoDB connection
│   │
│   ├── 📁 middleware/
│   │   └── auth.js                    # JWT verification
│   │
│   ├── 📁 models/
│   │   ├── User.js                    # User schema
│   │   ├── Product.js                 # Product schema
│   │   ├── Order.js                   # Order schema
│   │   └── Cart.js                    # Cart schema
│   │
│   ├── 📁 controllers/
│   │   ├── authController.js          # Auth logic
│   │   ├── productController.js       # Product CRUD
│   │   ├── orderController.js         # Order management
│   │   ├── cartController.js          # Cart operations
│   │   └── customerController.js      # Admin customer data
│   │
│   ├── 📁 routes/
│   │   ├── authRoutes.js              # /api/auth endpoints
│   │   ├── productRoutes.js           # /api/products endpoints
│   │   ├── orderRoutes.js             # /api/orders endpoints
│   │   ├── cartRoutes.js              # /api/cart endpoints
│   │   └── customerRoutes.js          # /api/customers endpoints
│   │
│   └── 📁 services/
│       └── socketService.js           # Socket.io handlers
│
├── 📁 frontend/
│   ├── 📁 public/
│   │   ├── index.html                 # Main HTML
│   │   ├── manifest.json              # PWA config
│   │   └── 📁 images/                 # Static images
│   │
│   ├── 📁 src/
│   │   ├── App.jsx                    # Main app & routing
│   │   ├── index.js                   # React entry point
│   │   ├── index.css                  # Global styles
│   │   │
│   │   ├── 📁 pages/
│   │   │   ├── LoginPage.jsx          # Signup & login
│   │   │   ├── HomePage.jsx           # Products listing
│   │   │   ├── AdminDashboard.jsx     # Admin panel
│   │   │   ├── CartPage.jsx           # Shopping cart
│   │   │   ├── OrderPage.jsx          # Order history
│   │   │   └── ProfilePage.jsx        # User profile
│   │   │
│   │   ├── 📁 components/
│   │   │   ├── Navbar.jsx             # Top navigation
│   │   │   ├── ProductCard.jsx        # Product display
│   │   │   ├── ProductManagement.jsx  # Admin product tab
│   │   │   ├── OrderManagement.jsx    # Admin order tab
│   │   │   ├── CustomerManagement.jsx # Admin customer tab
│   │   │   └── FormInputs.jsx         # Reusable forms
│   │   │
│   │   ├── 📁 context/
│   │   │   ├── AuthContext.js         # Auth state
│   │   │   └── SocketContext.js       # Socket state
│   │   │
│   │   ├── 📁 hooks/
│   │   │   ├── useAuth.js             # Access AuthContext
│   │   │   ├── useSocket.js           # Socket.io setup
│   │   │   └── useLocalStorage.js     # Local storage helper
│   │   │
│   │   └── 📁 utils/
│   │       ├── axiosInstance.js       # Axios with interceptors
│   │       ├── api.js                 # API function wrappers
│   │       └── helpers.js             # Helper functions
│   │
│   ├── .env.local                     # Frontend config
│   ├── package.json                   # Frontend dependencies
│   ├── tailwind.config.js             # Tailwind config
│   ├── craco.config.js                # CRA override config
│   ├── postcss.config.js              # PostCSS config
│   └── vercel.json                    # Vercel deployment
│
├── 📁 Documentation Files/
│   ├── START_HERE.md                  # Main documentation index
│   ├── LAUNCH_QUICK_GUIDE.md          # 2-minute launch
│   ├── COMPLETE_QUICK_START.md        # Detailed setup
│   ├── PRE_LAUNCH_CHECKLIST.md        # Verification
│   ├── ENV_SETUP_GUIDE.md             # Environment setup
│   ├── WEBSITE_OVERVIEW.md            # This file
│   ├── SYSTEM_DIAGNOSIS.md            # Architecture details
│   ├── PROJECT_STATUS_REPORT.md       # Current status
│   ├── DEVELOPER_QUICK_REFERENCE.md   # Dev reference
│   └── 15+ other documentation files
│
├── render.yaml                        # Render.com deployment
├── vercel.json                        # Vercel deployment
├── README.md                          # Project overview
└── .gitignore                         # Git ignore rules
```

---

## Summary

### **What This Website Does**

The **Cakesman Bakery** is a complete e-commerce platform for a bakery business that allows:

1. **Customers** to browse bakery products, add to cart, and place orders
2. **Admins** to manage products, track orders, and view customer analytics
3. **Everyone** to experience real-time updates without page refreshes
4. **Secure** login/signup with password hashing and JWT tokens

### **Technology Stack Summary**

| Layer | Technology | Language |
|---|---|---|
| **Frontend** | React 18 + Router v6 + Tailwind CSS | JavaScript (JSX) |
| **Backend** | Express.js + Node.js | JavaScript |
| **Database** | MongoDB Atlas + Mongoose | JSON documents |
| **Real-time** | Socket.io | JavaScript |
| **Security** | JWT + bcryptjs | JavaScript |
| **Deployment** | Vercel (frontend) + Railway/Render (backend) | - |

### **Key Features**

✅ User authentication (signup/login)  
✅ Product browsing with filters  
✅ Shopping cart functionality  
✅ Order placement and tracking  
✅ Admin dashboard for management  
✅ Real-time updates via Socket.io  
✅ Secure password hashing  
✅ Role-based access control  
✅ Responsive mobile design  
✅ Error handling and logging  

### **File Count**

- **Frontend:** ~10 pages/components + utilities
- **Backend:** ~5 controllers + 5 routes + 4 models
- **Database:** 4 collections
- **Documentation:** 10+ comprehensive guides

---

**This website is a complete, production-ready full-stack application! 🎉**
