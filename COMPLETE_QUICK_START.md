# 🚀 Complete Quick Start Guide - Cakesman Bakery

## Prerequisites

- **Node.js** (v14 or higher) - Download from [nodejs.org](https://nodejs.org)
- **MongoDB Account** - Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - Download from [git-scm.com](https://git-scm.com)
- **Code Editor** - VS Code recommended from [code.visualstudio.com](https://code.visualstudio.com)

---

## Step 1: Verify Installation

Open PowerShell and verify all tools are installed:

```powershell
# Check Node.js version (should be v14+)
node --version

# Check npm version
npm --version

# Check Git version
git --version
```

All should show version numbers without errors.

---

## Step 2: Navigate to Project Directory

```powershell
cd d:\Cakesman-Bakery
```

---

## Step 3: Set Up Backend

### 3.1 Navigate to Backend Directory

```powershell
cd backend
```

### 3.2 Install Dependencies

```powershell
npm install
```

**Expected output:** "added XXX packages" with no errors

### 3.3 Verify Backend Configuration

**The backend already has `.env` file configured with:**
- ✅ PORT=5001
- ✅ MONGO_URI=mongodb+srv://...
- ✅ JWT_SECRET=ishaan@132
- ✅ NODE_ENV=production
- ✅ FRONTEND_URL=https://cakesman-bakery-24bw.vercel.app

**No action needed** - backend is ready to run!

### 3.4 Start Backend Server

```powershell
npm start
```

**Expected output:**
```
[timestamp] 📨 Server running on port 5001
```

**Keep this terminal open and running.**

---

## Step 4: Set Up Frontend

### 4.1 Open a NEW PowerShell Window

- Click Start → PowerShell
- Or press `Ctrl + Shift + Esc` → Windows PowerShell

### 4.2 Navigate to Frontend Directory

```powershell
cd d:\Cakesman-Bakery\frontend
```

### 4.3 Install Dependencies

```powershell
npm install
```

**Expected output:** "added XXX packages" with no errors

### 4.4 Verify Frontend Configuration

**The frontend now has `.env.local` configured with:**
- ✅ REACT_APP_API_URL=http://localhost:5001/api
- ✅ REACT_APP_SOCKET_URL=http://localhost:5001

**No action needed** - frontend is ready to run!

### 4.5 Start Frontend Server

```powershell
npm start
```

**Expected output:**
```
On Your Network: http://localhost:3000
```

**Browser will automatically open to http://localhost:3000**

---

## Step 5: Test the Application

### 5.1 Login as Admin

1. Click on **"Admin"** tab at login page
2. Enter:
   - **Email:** `admin@cakesman.com`
   - **Password:** `admin123`
3. Click **Login**
4. Should redirect to **Admin Dashboard**

### 5.2 Login as Customer (Demo)

1. Click on **"Customer"** tab
2. Enter:
   - **Email:** `demo@test.com`
   - **Password:** `demo123`
3. Click **Login**
4. Should show **Home/Products page**

### 5.3 Create New Customer Account

1. Click **"Sign Up"** on Customer tab
2. Fill in:
   - **Name:** Your name
   - **Email:** your-email@example.com
   - **Password:** Your password
3. Click **Sign Up**
4. Should log in automatically

### 5.4 Test Admin Dashboard

After logging in as admin:
1. Should see **Admin Dashboard** with three tabs
2. **Products Tab:**
   - See list of products
   - Click "Add Product" to add new products
   - Click edit icon to edit products
   - Click delete icon to remove products
3. **Orders Tab:**
   - See all customer orders
4. **Customers Tab:**
   - See registered customers count

### 5.5 Open Browser Console

1. Press **F12** to open DevTools
2. Go to **Console** tab
3. You should see logs like:

```
🔗 POST http://localhost:5001/api/auth/login
✓ 200 http://localhost:5001/api/auth/login → {user: {...}}
```

These logs confirm:
- ✅ Frontend can reach backend
- ✅ API calls are working
- ✅ Backend responses are received

---

## Troubleshooting

### Issue: "Cannot GET /api/auth/login"

**Solution:**
1. Check backend is running in first terminal (should show port 5001)
2. Check REACT_APP_API_URL in frontend/.env.local is `http://localhost:5001/api`
3. Restart frontend: Press Ctrl+C and run `npm start` again

### Issue: Port Already in Use

**Solution 1 - Change Port:**
```powershell
# For frontend (use different port)
$env:PORT=3001; npm start

# For backend (change in .env)
# Edit backend/.env and change PORT=5002
```

**Solution 2 - Kill Process Using Port:**
```powershell
# Find process using port 5001
Get-NetTCPConnection -LocalPort 5001 | Stop-Process -Force

# Find process using port 3000
Get-NetTCPConnection -LocalPort 3000 | Stop-Process -Force
```

### Issue: "MONGO_URI is not defined"

**Solution:** Backend .env file is missing. Create one:

```powershell
cd backend
```

Create a file named `.env` with this content:
```
PORT=5001
MONGO_URI=mongodb+srv://gandhiishaan132_db_user:ishaan%40132@cluster0.jefmvix.mongodb.net/?appName=Cluster0
JWT_SECRET=ishaan@132
NODE_ENV=production
FRONTEND_URL=https://cakesman-bakery-24bw.vercel.app
```

### Issue: MongoDB Connection Failing

**Expected behavior:** Backend logs warning but continues with mock data.

This is normal for:
- Offline development
- Testing environment
- Network issues

App will work with mock data until MongoDB is available.

### Issue: npm ERR! code ERESOLVE

**Solution:**
```powershell
# Force npm to resolve dependencies
npm install --legacy-peer-deps
```

---

## System Architecture

```
┌─────────────────────┐
│   Browser (3000)    │
│   React Frontend    │
└──────────┬──────────┘
           │ HTTP Requests
           │ Socket.io Connection
           ↓
┌─────────────────────┐
│   Server (5001)     │
│   Express Backend   │
└──────────┬──────────┘
           │ DB Queries
           ↓
┌─────────────────────┐
│   MongoDB Atlas     │
│   Cloud Database    │
└─────────────────────┘
```

---

## API Endpoints Available

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /api/auth/register | Create customer account |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |
| GET | /api/products | Get all products |
| POST | /api/products | Create product (admin) |
| PUT | /api/products/:id | Update product (admin) |
| DELETE | /api/products/:id | Delete product (admin) |
| GET | /api/orders | Get user orders |
| POST | /api/orders | Create order |
| GET | /api/cart | Get cart items |
| POST | /api/cart | Add to cart |

---

## Demo Credentials

### Admin Login
```
Email: admin@cakesman.com
Password: admin123
```

### Demo Customer
```
Email: demo@test.com
Password: demo123
```

---

## Next Steps

1. ✅ **Verify Both Servers Running**
   - Backend: Check port 5001 logs
   - Frontend: Check http://localhost:3000 in browser

2. ✅ **Test Login Flow**
   - Admin login should work
   - Customer login should work
   - Signup should work

3. ✅ **Monitor Console**
   - Check browser DevTools Console
   - Watch backend terminal logs
   - Both should show activity on each request

4. ✅ **Test Products (Admin)**
   - Add a product
   - Edit the product
   - Delete the product
   - All changes should appear instantly

5. ✅ **Test Database**
   - If MongoDB is available, data persists
   - If MongoDB is down, app uses mock data
   - Both work seamlessly

---

## Key Information

| Item | Value |
|------|-------|
| Frontend Port | 3000 |
| Backend Port | 5001 |
| Frontend URL | http://localhost:3000 |
| Backend URL | http://localhost:5001 |
| API Base URL | http://localhost:5001/api |
| Database | MongoDB Atlas |
| Admin Dashboard | http://localhost:3000/admin |
| Product Management | Admin Dashboard → Products Tab |
| Order Management | Admin Dashboard → Orders Tab |

---

## Important Notes

- ✅ Both `.env` files are properly configured
- ✅ All dependencies are in package.json
- ✅ No additional setup required for environment variables
- ✅ Demo credentials available for quick testing
- ✅ Graceful fallback to mock data if MongoDB unavailable
- ✅ All API calls logged for debugging

---

## Getting Help

If something doesn't work:

1. **Check Terminal Output**
   - Backend terminal should show `[timestamp] 📨 POST /api/auth/login`
   - Frontend browser console should show `🔗 POST http://localhost:5001/api/login`

2. **Check Network Tab**
   - Browser DevTools → Network tab
   - Should see HTTP requests to `localhost:5001/api/...`

3. **Restart Servers**
   - Stop both servers (Ctrl+C in each terminal)
   - Restart in order: Backend first, then Frontend
   - Wait 5 seconds between starts

4. **Clear Browser Cache**
   - DevTools → Application tab → Clear Site Data
   - Reload page (Ctrl+Shift+R for hard reload)

---

**Ready to go! 🎉 Start with Step 1 above.**
