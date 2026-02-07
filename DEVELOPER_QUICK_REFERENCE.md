# 🔧 Developer Quick Reference Guide

A quick reference for developers working on the Cakesman Bakery project.

---

## 📋 Quick Navigation

### Essential Commands

**Start Backend:**
```powershell
cd d:\Cakesman-Bakery\backend
npm install  # First time only
npm start    # Start server
```

**Start Frontend:**
```powershell
cd d:\Cakesman-Bakery\frontend
npm install  # First time only
npm start    # Start dev server
```

**Build Frontend for Production:**
```powershell
npm run build  # Creates build/ directory
```

---

## 🔌 API Endpoints Quick Reference

### Authentication
```
POST   /api/auth/register     - Create customer account
POST   /api/auth/login        - Login (customer or admin)
GET    /api/auth/me           - Get current user
PUT    /api/auth/update       - Update user profile
```

### Products (Admin)
```
GET    /api/products          - Get all products
POST   /api/products          - Create product (admin)
GET    /api/products/:id      - Get product details
PUT    /api/products/:id      - Update product (admin)
DELETE /api/products/:id      - Delete product (admin)
```

### Orders
```
GET    /api/orders            - Get user's orders
POST   /api/orders            - Create new order
GET    /api/orders/:id        - Get order details
PATCH  /api/orders/:id/status - Update order status (admin)
GET    /api/orders/admin/all  - Get all orders (admin)
```

### Cart
```
GET    /api/cart              - Get user's cart
POST   /api/cart              - Add item to cart
DELETE /api/cart/:itemId      - Remove from cart
PUT    /api/cart/:itemId      - Update cart item
```

### Customers (Admin)
```
GET    /api/customers         - Get all customers
GET    /api/customers/:id     - Get customer details
GET    /api/customers/search?query=... - Search customers
```

---

## 🔐 Authentication

### Token Format
```javascript
// Request Header
Authorization: Bearer <JWT_TOKEN>

// Token expires in 7 days
// JWT_SECRET: ishaan@132 (from .env)
```

### Admin Check
```javascript
// In components
if (!user || !user.isAdmin) {
  navigate("/login");
}

// Or with hook
const { user, isAdmin } = useAuth();
```

---

## 🗄️ Database Schema Quick Reference

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  isAdmin: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model
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
```

### Order Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  items: [{
    productId: ObjectId,
    name: String,
    price: Number,
    quantity: Number
  }],
  total: Number,
  status: String (pending|accepted|baking|out_for_delivery|completed|cancelled),
  deliveryAddress: String,
  deliveryTime: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Cart Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  items: [{
    productId: ObjectId,
    name: String,
    price: Number,
    quantity: Number
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎯 Common Patterns

### Making API Calls
```javascript
// Using axiosInstance (recommended)
import { api } from "../utils/api.js";

const response = await api.getAllProducts();

// Or direct with token
import axiosInstance from "../utils/axiosInstance";

const response = await axiosInstance.get("/products");
```

### Authentication State
```javascript
import { useAuth } from "../hooks/useAuth";

const { user, login, logout, isAdmin } = useAuth();

// Check if admin
if (isAdmin) {
  // Admin features
}
```

### Socket.io Events
```javascript
import { useSocket } from "../hooks/useSocket";

const socket = useSocket();

// Listen for product updates
socket?.on("product_updated", (data) => {
  // Handle update
});

// Listen for order updates
socket?.on("order_status_changed", (data) => {
  // Handle update
});
```

### Error Handling
```javascript
try {
  const response = await api.login(email, password);
  // Success
} catch (error) {
  // Error is logged automatically
  // Show user-friendly message
  toast.error(error.message);
}
```

---

## 🐛 Debugging Tips

### View API Logs
```
// Backend terminal shows:
[HH:MM:SS] 📨 POST /api/auth/login [Auth]
[HH:MM:SS] ✓ POST /api/auth/login → 200

// Browser console (F12) shows:
🔗 POST http://localhost:5001/api/auth/login {hasToken: false, hasData: true}
✓ 200 http://localhost:5001/api/auth/login → {user: {...}}
```

### Check Environment Variables
```powershell
# Frontend
cd frontend
type .env.local

# Backend
cd backend
type .env
```

### Clear Caches
```powershell
# Clear npm cache
npm cache clean --force

# Clear browser cache
# DevTools → Application → Clear Site Data

# Or hard refresh
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

### Check Network Issues
```
DevTools → Network tab → Make request
Should see request with status 200/201/400 etc
Check Request/Response headers for auth
```

---

## 📁 File Organization

### Frontend Components
```
src/
├── pages/          - Full page components
├── components/     - Reusable components
├── context/        - State management (AuthContext)
├── hooks/          - Custom hooks (useSocket, useAuth)
├── utils/          - Utility functions (api.js, axiosInstance.js)
└── styles/         - CSS files
```

### Backend Structure
```
backend/
├── config/         - Database config
├── controllers/    - Request handlers
├── models/         - Database schemas
├── middleware/     - Express middleware
├── routes/         - Route definitions
├── services/       - Business logic
└── server.js       - Main entry point
```

---

## 🔄 Common Workflows

### Adding New Product (Admin)
1. Navigate to Admin Dashboard → Products tab
2. Click "Add Product"
3. Fill in:
   - Name
   - Category
   - Price
   - Discount (0-100)
   - Stock status (in/out of stock)
   - Description
4. Click "Save Product"
5. Product appears instantly (real-time via Socket.io)

### Creating Order (Customer)
1. Browse products on home page
2. Click "Add to Cart"
3. Go to cart (top right icon)
4. Review items
5. Click "Checkout"
6. Fill delivery address
7. Click "Place Order"
8. Order appears in admin dashboard instantly

### Checking Order Status (Admin)
1. Go to Admin Dashboard → Orders tab
2. Click order to expand
3. See order status (pending → accepted → baking → out_for_delivery → completed)
4. Click status to update
5. Customer sees update in real-time

---

## 🧪 Testing Workflow

### Unit Test Pattern
```javascript
// Test API endpoint
const response = await api.login("admin@cakesman.com", "admin123");
expect(response.user._id).toBeDefined();
expect(response.user.isAdmin).toBe(true);
```

### Integration Test Pattern
```javascript
// 1. Login as admin
await api.login("admin@cakesman.com", "admin123");

// 2. Create product
const product = await api.createProduct({...});

// 3. Verify on customer side
const products = await api.getAllProducts();
expect(products).toContainEqual(product);
```

---

## 📊 Environment Variables

### Frontend (.env.local)
```
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_SOCKET_URL=http://localhost:5001
```

### Backend (.env)
```
PORT=5001
MONGO_URI=mongodb+srv://...
JWT_SECRET=ishaan@132
NODE_ENV=production
FRONTEND_URL=http://localhost:3000
```

---

## 🔐 Security Reminders

- ✅ Always use HTTPS in production
- ✅ Keep JWT_SECRET secret (in .env)
- ✅ Never hardcode API URLs
- ✅ Always validate user input
- ✅ Check isAdmin flag for admin operations
- ✅ Use Bearer tokens in Authorization header
- ✅ Handle 401 errors properly (redirect to login)
- ✅ Never expose sensitive data in error messages

---

## 🚀 Deployment Checklist

Before deploying to production:
- [ ] Update REACT_APP_API_URL to production backend
- [ ] Update JWT_SECRET to secure value
- [ ] Update MONGO_URI to production database
- [ ] Update FRONTEND_URL in backend CORS
- [ ] Run `npm run build` for frontend
- [ ] Test all features on staging
- [ ] Check logs for errors
- [ ] Set up error tracking (Sentry)
- [ ] Set up monitoring
- [ ] Have rollback plan ready

---

## 📚 Quick Links

**Documentation:**
- [COMPLETE_QUICK_START.md](COMPLETE_QUICK_START.md)
- [SYSTEM_DIAGNOSIS.md](SYSTEM_DIAGNOSIS.md)
- [IMPROVEMENTS_SUMMARY.md](IMPROVEMENTS_SUMMARY.md)

**Guides:**
- [ENV_SETUP_GUIDE.md](ENV_SETUP_GUIDE.md)
- [DEPLOYMENT_COMPLETE_GUIDE.md](DEPLOYMENT_COMPLETE_GUIDE.md)
- [PRE_LAUNCH_CHECKLIST.md](PRE_LAUNCH_CHECKLIST.md)

---

## ⌚ Time Estimates

| Task | Time |
|------|------|
| Initial setup | 10 minutes |
| Launch both servers | 2 minutes |
| Run full test suite | 15 minutes |
| Add new feature | 30-60 minutes |
| Deploy to production | 20 minutes |

---

## 🎯 Performance Tips

- **Frontend:** Use React DevTools Profiler to identify slow renders
- **Backend:** Check request logs to identify slow endpoints
- **Database:** Use MongoDB indexes for frequent queries
- **API:** Implement pagination for large datasets
- **Socket.io:** Use room-based broadcasting, not global broadcast

---

## 🆘 Emergency Troubleshooting

### Server won't start
```powershell
# Check if port is in use
netstat -ano | findstr :5001

# Kill process on port
taskkill /PID <PID> /F

# Or change port in .env
PORT=5002
```

### Can't connect to MongoDB
- App will use mock data (graceful fallback)
- Check MONGO_URI in .env
- Check network/firewall
- Check MongoDB Atlas whitelist

### API calls failing
- Check backend is running
- Check REACT_APP_API_URL in frontend/.env.local
- Check browser console (F12)
- Check backend terminal logs

### Session lost on page reload
- Clear browser cache (Ctrl+Shift+Delete)
- Check localStorage (DevTools → Application)
- Check token isn't expired

---

## 📈 Monitoring Commands

**Monitor Backend:**
```powershell
# Keep terminal open and watch logs
npm start
```

**Monitor Frontend:**
```powershell
# Keep terminal open and watch build
npm start
```

**Monitor Database:**
```
MongoDB Atlas Dashboard:
- View query analytics
- Check index usage
- Monitor storage
```

---

## 🎓 Code Style

### Frontend
- Use functional components with hooks
- Use camelCase for variables
- Use PascalCase for components
- Add comments for complex logic
- Use const/let, avoid var

### Backend
- Use async/await (not callbacks)
- Use consistent error handling
- Add request validation
- Log important operations
- Use descriptive variable names

---

## 🔗 Socket.io Events Reference

### Client → Server
```javascript
socket.emit('user_role', { role: 'admin', userId: '...' })
```

### Server → Client
```javascript
socket.on('product_updated', (product) => {...})
socket.on('order_status_changed', (order) => {...})
```

---

**Last Updated:** 2024  
**Quick Reference v1.0**

---

**Pro Tip:** Bookmark this page for quick access while developing! 🔖
