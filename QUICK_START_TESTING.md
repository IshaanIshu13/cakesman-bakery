# ⚡ QUICK START - Test Your Auth Implementation

## 📋 Pre-Flight Checklist

Before testing, make sure:
- [ ] Backend is running: `npm start` in `/backend`
- [ ] Frontend is running: `npm start` in `/frontend`
- [ ] Backend is on port 5001
- [ ] Frontend is on port 3000
- [ ] MongoDB is connected
- [ ] `.env` file has `JWT_SECRET` in backend

---

## 🚀 5-Minute Quick Test

### 1️⃣ Test Login (3 minutes)

```
1. Open http://localhost:3000 in browser
2. Click "Login" button in navbar
3. Enter test credentials:
   Email: test@example.com
   Password: password123
4. Click "Login" button
5. EXPECTED: 
   ✅ Green success toast appears
   ✅ Navbar shows avatar with first letter
   ✅ Redirect to /profile
```

### 2️⃣ Test Navbar Update (1 minute)

```
1. Look at navbar
2. You should see:
   ✅ User avatar (pink circle with letter)
   ✅ First name visible on hover
   ✅ NO "Login" button
```

### 3️⃣ Test Page Refresh (1 minute)

```
1. Press F5 to refresh page
2. EXPECTED:
   ✅ User stays logged in
   ✅ Avatar still shows
   ✅ No login modal appears
   ✅ localStorage still has authToken
```

---

## 🔍 Verify in DevTools

### Check localStorage
```
1. Press F12 (DevTools)
2. Go to "Application" tab
3. Click "Local Storage" → http://localhost:3000
4. EXPECTED:
   ✅ authToken: (long string starting with "eyJ")
   ✅ user: {"id":"...", "name":"John", "email":"john@example.com", "isAdmin":false}
```

### Check API Requests
```
1. In DevTools, go to "Network" tab
2. Click avatar → click "My Orders"
3. Look for GET request to /api/orders
4. EXPECTED:
   ✅ Request Headers include: Authorization: Bearer eyJ...
```

---

## 🎯 Test Different User Types

### Test Customer (Regular User)
```
Email: customer@example.com
Password: password123

EXPECTED in Navbar:
✅ Shows avatar with first letter
✅ Clicking avatar shows dropdown:
   - My Profile
   - My Orders
   - Logout
✅ NO "Admin Panel" button
```

### Test Admin User
```
Email: admin@example.com
Password: password123

EXPECTED in Navbar:
✅ Shows RED "Admin Panel" button
✅ NO avatar/dropdown
✅ Clicking "Admin Panel" goes to /admin
```

### Test Not Logged In
```
1. Start fresh (private window or clear cache)
2. Go to http://localhost:3000

EXPECTED:
✅ Navbar shows "Login" button
✅ NO avatar
✅ localStorage is empty
```

---

## ✅ Full Test Checklist

### Login & Registration
- [ ] Can login with valid credentials
- [ ] Shows success toast
- [ ] Redirects correctly (admin/customer)
- [ ] Can register new account
- [ ] Token saved to localStorage
- [ ] User object saved to localStorage

### Navbar
- [ ] Not logged in: Shows "Login" button
- [ ] After login (customer): Shows avatar
- [ ] After login (admin): Shows "Admin Panel"
- [ ] Avatar shows user's first initial
- [ ] Avatar shows first name on hover
- [ ] Dropdown menu appears on click

### Persistence
- [ ] User stays logged in after F5 refresh
- [ ] localStorage data still there after refresh
- [ ] Token included in API requests
- [ ] No "Login" button shown when refreshed

### API Requests
- [ ] Add to cart shows Bearer token
- [ ] Checkout shows Bearer token
- [ ] Get orders shows Bearer token
- [ ] All requests succeed with 200/201

### Logout
- [ ] Click avatar → Logout
- [ ] Navbar shows "Login" button
- [ ] localStorage cleared
- [ ] Redirected to home

### Error Handling
- [ ] Wrong password shows error
- [ ] Wrong email shows error
- [ ] 401 errors redirect to login
- [ ] Toast shows error messages

---

## 🐛 Quick Troubleshooting

### "Login button still shows after login"
```
STEP 1: Check DevTools Console
- Press F12, go to Console
- Look for any red errors
- If error visible, that's the problem

STEP 2: Verify AuthProvider in App.jsx
- Open frontend/src/App.jsx
- Should have: <AuthProvider><CartProvider>...

STEP 3: Check localStorage
- Go to Application tab
- Look for authToken and user
- Both should be present
```

### "No Bearer token in requests"
```
STEP 1: Check axiosInstance.js exists
- File: frontend/src/utils/axiosInstance.js
- Should be 40 lines with interceptors

STEP 2: Check api.js uses axiosInstance
- File: frontend/src/utils/api.js
- First line: import axiosInstance

STEP 3: Check getCartCount/addToCart use api module
- Should use: import { api } from '../utils/api'
- Should call: api.addToCart(...)
```

### "401 errors or token rejected"
```
STEP 1: Check JWT_SECRET in backend .env
- JWT_SECRET should be set
- NOT empty

STEP 2: Check backend is running
- Should see "Server running on 5001"
- Should see "MongoDB connected"

STEP 3: Check token format
- In localStorage, authToken should start with "eyJ"
- That's valid JWT format

STEP 4: Restart both frontend and backend
- Kill both processes
- npm start in both folders
```

---

## 📊 Status Indicators

### ✅ Everything Working
- Navbar shows avatar when logged in
- localStorage has authToken
- API requests have Bearer token
- Page refresh keeps login
- Logout clears everything

### ⚠️ Partially Working (some features missing)
- Can login but navbar doesn't update
- Token not in requests
- Auth lost on refresh

### ❌ Not Working (needs investigation)
- Login button disabled
- Can't login at all
- 401 errors on every request

---

## 🎓 Understanding the Flow

```
┌─────────────────────────────────────────┐
│  User visits http://localhost:3000      │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  App.jsx loads (has AuthProvider)       │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  AuthContext useEffect runs             │
│  Checks localStorage for authToken      │
└────────────┬────────────────────────────┘
             │
        ┌────┴─────┐
        │           │
        ▼           ▼
    Token?       No Token?
        │           │
        ▼           ▼
    Restore      Show Login
     User         Button
        │           │
        └─────┬─────┘
              │
              ▼
         Navbar Renders
              │
        ┌─────┴──────┐
        │            │
        ▼            ▼
   Show Avatar   Show "Login"
   + Dropdown    Button
```

---

## 📞 Still Having Issues?

### Check These Files Exist
- [ ] `frontend/src/context/AuthContext.js` - 127 lines
- [ ] `frontend/src/utils/axiosInstance.js` - 40 lines
- [ ] `frontend/src/pages/Login.jsx` - Updated with useAuth
- [ ] `frontend/src/components/Navbar.jsx` - Updated with dropdown

### Verify These Imports
```javascript
// In Navbar.jsx:
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// In Login.jsx:
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

// In api.js:
import axiosInstance from './axiosInstance';
```

### Check Environment
```
Backend .env:
- JWT_SECRET=your_secret_here
- MONGODB_URI=mongodb://...
- PORT=5001

Frontend .env (optional):
- REACT_APP_API_URL=http://localhost:5001/api
```

---

## 🎯 Success Criteria

Your implementation is **COMPLETE** when:

✅ Login works with success toast
✅ Navbar updates with avatar  
✅ User stays logged in after refresh
✅ Bearer token in all API requests
✅ Admin sees "Admin Panel" button
✅ Customer sees profile dropdown
✅ Logout works and clears everything
✅ 401 errors redirect to login

---

**Ready? Start testing now!** 🚀

Check TESTING_CHECKLIST.md for detailed test steps.
