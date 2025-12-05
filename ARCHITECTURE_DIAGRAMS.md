# 🎨 Visual Architecture & Flow Diagrams

## 1. Component Tree & Context

```
App.jsx
├─ AuthProvider (wraps entire app)
│  ├─ state: user, token, loading
│  ├─ methods: login(), register(), logout()
│  └─ exported: useAuth() hook
│
├─ CartProvider
│  └─ ...
│
└─ Router
   ├─ Layout
   │  ├─ Navbar (uses useAuth)
   │  │  ├─ Shows "Login" if !isAuthenticated
   │  │  ├─ Shows "Admin Panel" if isAdmin
   │  │  └─ Shows Avatar+Dropdown if authenticated
   │  │
   │  ├─ HomePage
   │  ├─ CategoryPage
   │  ├─ MenuPage
   │  │
   │  └─ Login.jsx (uses useAuth)
   │     ├─ Login form
   │     ├─ Register form
   │     └─ Redirects based on role
   │
   └─ Other routes...
```

---

## 2. Authentication Data Flow

```
                    ┌──────────────────────────┐
                    │   User Visits Website    │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │   AuthContext loads      │
                    │   from localStorage      │
                    └────────────┬─────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
            ┌──────────────┐         ┌────────────────┐
            │ Token found? │         │ No token       │
            │   YES        │         │ Show Login btn │
            └──────┬───────┘         └────────────────┘
                   │
                   ▼
        ┌─────────────────────────┐
        │ Restore user in state   │
        │ Show avatar in navbar   │
        └─────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
    ┌────────┐          ┌───────────┐
    │ Admin? │          │ Customer? │
    │  YES   │          │    YES    │
    └───┬────┘          └─────┬─────┘
        │                     │
        ▼                     ▼
   Admin Panel          Avatar+Dropdown
   Button (red)         - My Profile
                        - My Orders
                        - Logout
```

---

## 3. Login Process (Detailed)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          USER CLICKS LOGIN                              │
└─────────────────────┬───────────────────────────────────────────────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │   Login Modal/Page     │
         │   appears              │
         └────────────┬───────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │   User enters email    │
         │   and password         │
         └────────────┬───────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │   User clicks LOGIN    │
         └────────────┬───────────┘
                      │
                      ▼
     ┌────────────────────────────────────┐
     │  handleSubmit() in Login.jsx       │
     │  called with form data             │
     └────────────┬─────────────────────┘
                  │
                  ▼
     ┌────────────────────────────────────┐
     │  authContext.login(email, pwd)    │
     │  called (imported from useAuth)    │
     └────────────┬─────────────────────┘
                  │
                  ▼
     ┌────────────────────────────────────┐
     │  POST /api/auth/login              │
     │  { email, password }               │
     │  sent to backend                   │
     └────────────┬─────────────────────┘
                  │
      ┌───────────┴────────────┐
      │                        │
      ▼                        ▼
   Success              Error (wrong pwd)
      │                        │
      ▼                        ▼
  Backend returns       Backend returns
  {                     {
    token: "eyJ...",      message: "Invalid..."
    user: {               error: true
      id: "...",        }
      name: "John",
      email: "j@x.com",
      isAdmin: false
    }
  }
      │
      ├─▶ setToken(token)
      ├─▶ setUser(user)
      ├─▶ localStorage.authToken = token
      ├─▶ localStorage.user = JSON.stringify(user)
      │
      ▼
   Return { success: true, user }
      │
      ▼
   Login.jsx receives result
      │
      ├─▶ toast.success("✅ Login successful!")
      │
      ▼
   Check user.isAdmin
      │
   ┌──┴──┐
   │     │
   ▼     ▼
  TRUE FALSE
   │     │
   ▼     ▼
 /admin /profile
   │     │
   └──┬──┘
      │
      ▼
   Navbar automatically updates
   (because context state changed)
```

---

## 4. Navbar State Machine

```
                    ┌──────────────────────┐
                    │   App initializes    │
                    │ AuthContext loads    │
                    └──────────┬───────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
            ┌──────────────┐      ┌──────────────┐
            │ Token found? │      │ No token     │
            └──┬───────┬──┘       └──────┬───────┘
               │       │                 │
               YES     NO                │
               │       │                 │
               ▼       │                 ▼
            Load user  │          ┌─────────────────┐
            from JSON  │          │ NAVBAR STATE:   │
               │       │          │ isAuth: false   │
               ▼       │          │ isAdmin: false  │
            ┌────────┐ │          └────────┬────────┘
            │Restore │ │                   │
            │in React│ │                   ▼
            │ state │ │          ┌──────────────────────┐
            └───┬────┘ │          │ RENDER: LOGIN BUTTON │
                │      │          └──────────────────────┘
                │      │                   │
                │      │         ┌─────────┴─────────┐
                │      └────────▶│                   │
                │                ▼                   ▼
                │        ┌──────────────┐    ┌──────────────────┐
                │        │Navbar needs  │    │User clicks       │
                │        │to re-render  │    │"Login" button    │
                │        │isAuth: false │    │(LoginModal opens)│
                │        └──────────────┘    └────────┬─────────┘
                │                                    │
                └────────────────────┬────────────────┘
                                     │
                         ┌───────────┴──────────────┐
                         │                          │
                         ▼                          ▼
                    ┌──────────┐          ┌────────────────┐
                    │user      │          │User submits    │
                    │object    │          │login form      │
                    │found in  │          └────────┬───────┘
                    │state?    │                   │
                    └──┬───┬──┘                    ▼
                       │   │          ┌──────────────────────┐
                       YES │          │AuthContext.login()   │
                       │   NO         │called                │
                       │   │          └────────┬─────────────┘
                       │   │                   │
                       │   ▼                   ▼
                       │ Check       ┌─────────────────────┐
                       │ isAdmin?    │POST /api/auth/login │
                       │             │returns {token, user}│
                       │             └────────┬────────────┘
                       │                      │
                       │         ┌────────────┴────────────┐
                       │         │                         │
                       │         ▼                         ▼
                       │     ┌────────┐            ┌───────────┐
                       │     │ setToken()           │ ERROR!    │
                       │     │ setUser()            │ Show msg  │
                       │     │ save to localStorage │ Try again │
                       │     └────────┬─────────────┘           │
                       │              │                         │
                       │              ▼                         │
                       │    ┌─────────────────────────┐         │
                       │    │Context state updated   │         │
                       │    │isAuth: true            │         │
                       │    │isAdmin: user.isAdmin   │         │
                       │    └─────┬───────────┬──────┘         │
                       │          │           │                │
                       │    ┌─────▼───┐  ┌───▼─────┐          │
                       │    │  TRUE   │  │  FALSE  │          │
                       │    │ (admin) │  │(customer)         │
                       │    └────┬────┘  └────┬────┘          │
                       │         │            │               │
                       ▼         ▼            ▼               │
                    ┌─────────────────────────────────────┐   │
                    │  NAVBAR RE-RENDERS (state changed)  │   │
                    │                                     │   │
                    │  isAuthenticated: true              │   │
                    │  isAdmin: true/false                │   │
                    └──┬──────────────────────────────┬───┘   │
                       │                              │        │
                    ┌──▼──┐                      ┌───▼──┐    │
                    │TRUE │                      │FALSE │    │
                    └──┬──┘                      └───┬──┘    │
                       │                            │        │
                       ▼                            ▼        │
                    ┌────────────────┐    ┌──────────────────┐
                    │ ADMIN PANEL    │    │ AVATAR + DROPDOWN    │
                    │ Button (red)   │    │                   │
                    │ onClick→/admin │    │ ┌──────────────┐ │
                    └────────────────┘    │ │ My Profile   │ │
                                          │ ├──────────────┤ │
                                          │ │ My Orders    │ │
                                          │ ├──────────────┤ │
                                          │ │ Logout       │ │
                                          │ └──────────────┘ │
                                          └──────────────────┘
```

---

## 5. Axios Interceptor Flow

```
┌──────────────────────────────────────────────────────────┐
│  Component wants to make API request                     │
│  Example: api.addToCart(...)                             │
└───────────────────┬──────────────────────────────────────┘
                    │
                    ▼
    ┌───────────────────────────────────────┐
    │ axiosInstance.post('/cart/add', ...)  │
    └───────────────┬───────────────────────┘
                    │
                    ▼
        ┌─────────────────────────────────┐
        │ REQUEST INTERCEPTOR RUNS        │
        │ config.headers.Authorization =  │
        │ "Bearer " + localStorage.authToken
        └──────────┬──────────────────────┘
                   │
                   ▼
       ┌─────────────────────────────┐
       │ GET /api/cart/add           │
       │ Headers: {                  │
       │   Authorization:            │
       │   "Bearer eyJ..."           │
       │ }                           │
       └──────────┬──────────────────┘
                  │
                  ▼
         (Sent to Backend)
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
    Success            Error (401)
        │                   │
        ▼                   ▼
    ┌─────────┐      ┌──────────────────┐
    │Status   │      │RESPONSE INTERCEPTOR│
    │200/201  │      │runs on 401        │
    └────┬────┘      └────┬─────────────┘
         │                 │
         ▼                 ▼
    Return data      ┌─────────────────┐
    to component     │localStorage:    │
    (API call       │removeItem(...)   │
    succeeds)       └────┬────────────┘
                         │
                         ▼
                    ┌──────────────────┐
                    │window.location   │
                    │.href = '/login'  │
                    └──────────────────┘
                         │
                         ▼
                   User redirected
                   to login page
```

---

## 6. localStorage Structure

```
Browser Local Storage for Cakes Man Bakery
├─ authToken
│  └─ Value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI..."
│     Purpose: JWT token for API authentication
│     Set by: AuthContext.login() and AuthContext.register()
│     Used by: Axios request interceptor
│     Cleared by: AuthContext.logout() or 401 response
│
└─ user
   └─ Value: "{\"id\":\"507f1f77bcf86cd799439011\",\"name\":\"John Doe\",\"email\":\"john@example.com\",\"isAdmin\":false}"
      Purpose: Current user object for UI rendering
      Set by: AuthContext.login() and AuthContext.register()
      Used by: Navbar (avatar name), Navbar (isAdmin check)
      Cleared by: AuthContext.logout() or 401 response
```

---

## 7. Role-Based Access Control

```
                    User Logged In?
                           │
                ┌──────────┴──────────┐
                │                     │
               NO                    YES
                │                     │
                ▼                     ▼
          ┌───────────┐        ┌─────────────┐
          │ Navbar    │        │ Check user  │
          │ shows:    │        │ .isAdmin    │
          │ "Login"   │        └──┬─────┬──┘
          │ button    │           │     │
          └───────────┘         TRUE   FALSE
                                 │      │
                                 ▼      ▼
                            ┌─────┐  ┌──────────┐
                            │Admin│  │Customer  │
                            └──┬──┘  └────┬─────┘
                               │          │
                    ┌──────────┬┴────┐     │
                    │          │     │     │
                    ▼          ▼     ▼     ▼
                  /admin    /orders /profile
                Navbar:    Navbar:  Navbar:
                Admin      Avatar + Avatar +
                Panel      Dropdown Dropdown
                (red)

Access Control Routes:
├─ /admin
│  └─ Protected: Admin only
│     Middleware: <AdminRoute><AdminDashboard /></AdminRoute>
│
├─ /profile
│  └─ Protected: Logged-in users only
│     Middleware: <ProtectedRoute><Profile /></ProtectedRoute>
│
├─ /orders
│  └─ Protected: Logged-in users only
│     Middleware: <ProtectedRoute><Orders /></ProtectedRoute>
│
└─ /login
   └─ Public: Anyone
      No protection needed
```

---

## 8. State Management Lifecycle

```
Timeline of Auth State

APP LOADS
│
├─ AuthProvider mounts
│  ├─ user = null
│  ├─ token = null
│  ├─ loading = true
│  │
│  └─ useEffect runs (check localStorage)
│     ├─ Found authToken? YES → setToken()
│     ├─ Found user? YES → setUser()
│     └─ loading = false ✓
│
├─ Navbar renders
│  ├─ isAuthenticated = !!user && !!token
│  ├─ isAdmin = user?.isAdmin === true
│  │
│  └─ Render based on values
│     ├─ NOT auth → "Login" button
│     ├─ IS admin → "Admin Panel"
│     └─ IS customer → Avatar+Dropdown
│
├─ USER CLICKS LOGIN
│  │
│  ├─ AuthContext.login() called
│  ├─ POST /api/auth/login
│  ├─ Receives { token, user }
│  ├─ setToken(token)
│  ├─ setUser(user)
│  ├─ localStorage.setItem('authToken', token)
│  ├─ localStorage.setItem('user', JSON.stringify(user))
│  │
│  └─ Navbar detects state change → RE-RENDER ✓
│     (now shows avatar instead of Login button)
│
├─ USER NAVIGATES
│  │
│  ├─ Axios interceptor active
│  ├─ Reads authToken from localStorage
│  ├─ Adds to request header
│  ├─ Backend verifies token
│  └─ API call succeeds ✓
│
├─ USER REFRESHES PAGE
│  │
│  ├─ AuthProvider mounts again
│  ├─ useEffect checks localStorage
│  ├─ Finds authToken → setToken()
│  ├─ Finds user → setUser()
│  ├─ loading = false
│  │
│  └─ User still logged in ✓
│     (avatar still shows)
│
├─ USER CLICKS LOGOUT
│  │
│  ├─ AuthContext.logout() called
│  ├─ localStorage.removeItem('authToken')
│  ├─ localStorage.removeItem('user')
│  ├─ setToken(null)
│  ├─ setUser(null)
│  │
│  └─ Navbar detects state change → RE-RENDER ✓
│     (now shows "Login" button instead of avatar)
│
└─ TOKEN EXPIRES (or 401 error)
   │
   ├─ API request returns 401
   ├─ Response interceptor catches it
   ├─ localStorage.removeItem('authToken')
   ├─ localStorage.removeItem('user')
   ├─ window.location.href = '/login'
   │
   └─ User sent to login page ✓
      (must log in again)
```

---

## 9. Network Request Examples

### Successful Login Request
```
POST /api/auth/login HTTP/1.1
Host: localhost:5001
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

─────────────────────────────────────────

HTTP/1.1 200 OK
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false
  }
}
```

### Authenticated API Request
```
GET /api/orders HTTP/1.1
Host: localhost:5001
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

─────────────────────────────────────────

HTTP/1.1 200 OK
Content-Type: application/json

{
  "orders": [
    { "id": "...", "total": 1500, "status": "delivered" },
    { "id": "...", "total": 2000, "status": "pending" }
  ]
}
```

### Unauthorized Request (401)
```
GET /api/orders HTTP/1.1
Host: localhost:5001
Authorization: Bearer expired_or_invalid_token
Content-Type: application/json

─────────────────────────────────────────

HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "message": "Invalid token"
}

→ Browser clears localStorage
→ Browser redirects to /login
```

---

## 10. Component Hierarchy with Data Flow

```
App.jsx (has AuthProvider)
│
└─ AuthProvider
   │ Provides: { user, token, loading, isAuthenticated, isAdmin, login, logout, register }
   │
   └─ Layout
      │
      ├─ Navbar (consumes useAuth)
      │  └─ Uses: isAuthenticated, isAdmin, user.name, logout()
      │
      ├─ CartLink (consumes CartContext)
      │  └─ Uses: cartCount
      │
      ├─ LoginModal
      │  └─ Has: login form
      │
      ├─ Routes
      │  │
      │  ├─ Home (no auth needed)
      │  ├─ Menu (no auth needed)
      │  ├─ Category (no auth needed)
      │  │
      │  ├─ Login (public page, consumes useAuth for redirect)
      │  ├─ Cart (uses cart context)
      │  ├─ Checkout (uses cart context + API)
      │  │
      │  ├─ /profile (should be protected, consumes useAuth)
      │  ├─ /orders (should be protected, consumes useAuth)
      │  │
      │  └─ /admin (protected by AdminRoute, consumes useAuth)
      │     └─ Only accessible if user.isAdmin === true
      │
      └─ Footer (no auth needed)

Data Flow:
- Any component can call useAuth() to get auth state
- Any component can call api.getToken() to get token
- Axios automatically adds token to requests
- Navbar watches context, re-renders on state change
- Login page uses context, redirects on success
```

---

**These diagrams show the complete architecture and data flow of your authentication system!**
