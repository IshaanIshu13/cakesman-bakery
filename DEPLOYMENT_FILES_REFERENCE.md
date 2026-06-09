# 📁 Deployment Files Reference

## Generated Configuration Files

This document explains all the files created for Firebase Hosting + Cloud Run deployment.

---

## 🔧 Core Configuration Files

### 1. `firebase.json`
**Location**: `d:\Cakesman-Bakery\firebase.json`

**Purpose**: Configures Firebase Hosting behavior

```json
{
  "hosting": {
    "public": "frontend/build",        // Where built React app is
    "ignore": [...],                   // Files to ignore during deploy
    "rewrites": [                      // URL routing rules
      {
        "source": "/api/**",           // /api/* routes → Cloud Run
        "function": "api"
      },
      {
        "source": "**",                // All other routes → index.html (SPA)
        "destination": "/index.html"
      }
    ],
    "cleanUrls": true,                 // Don't require .html extension
    "trailingSlashBehavior": "REMOVE"  // /page/ → /page
  }
}
```

**What It Does**:
- ✅ Routes requests properly
- ✅ Enables SPA routing (React Router)
- ✅ Redirects API calls to Cloud Run
- ✅ Removes trailing slashes

**When Used**: Every time you deploy frontend

---

### 2. `.firebaserc`
**Location**: `d:\Cakesman-Bakery\.firebaserc`

**Purpose**: Stores Firebase project configuration

```json
{
  "projects": {
    "default": "cakesman-bakery"  // Your Firebase project ID
  },
  "targets": {},
  "etags": {}
}
```

**What It Does**:
- ✅ Tells Firebase CLI which project to use
- ✅ Prevents deploying to wrong project

**When Used**: Every Firebase CLI command

**Never Commit**: This file is safe to commit (no secrets)

---

### 3. `backend/Dockerfile`
**Location**: `d:\Cakesman-Bakery\backend\Dockerfile`

**Purpose**: Defines Docker container for backend

```dockerfile
FROM node:18-alpine              # Base image (lightweight)
WORKDIR /app                     # Container working directory
COPY package*.json ./            # Copy dependencies list
RUN npm ci --only=production     # Install only production deps
COPY . .                         # Copy all code
EXPOSE 5001                      # Expose port (informational)
ENV NODE_ENV=production          # Set production mode
CMD ["npm", "start"]             # Run the app
```

**What It Does**:
- ✅ Creates a containerized version of your backend
- ✅ Installs production dependencies only
- ✅ Runs `npm start` when container starts

**When Used**: 
- Building: `docker build -t image .`
- Pushing: `docker push gcr.io/project/image`
- Deploying: Cloud Run pulls this image

**Key Points**:
- Uses `node:18-alpine` (small, fast)
- Uses `npm ci` (safer than npm install)
- Only installs production dependencies

---

### 4. `backend/.dockerignore`
**Location**: `d:\Cakesman-Bakery\backend\.dockerignore`

**Purpose**: Exclude files from Docker build

```
node_modules          # Don't copy, will install fresh
npm-debug.log        # Remove clutter
.git                 # Not needed in container
.gitignore           # Not needed in container
.env                 # Use Cloud Run env vars instead
.env.local           # Not needed
.DS_Store            # macOS files
*.md                 # Documentation
coverage             # Test coverage
dist                 # Build artifacts
build                # Build artifacts
```

**What It Does**:
- ✅ Reduces Docker image size
- ✅ Speeds up build process
- ✅ Excludes sensitive files

**Size Benefit**: Reduces final image from ~500MB to ~150MB

---

## 🔐 Environment Configuration Files

### 5. `backend/.env.production`
**Location**: `d:\Cakesman-Bakery\backend\.env.production`

**Purpose**: Production environment variables for backend

```env
NODE_ENV=production
PORT=5001
MONGO_URI=mongodb+srv://...     # MongoDB connection string
JWT_SECRET=...                  # Secret for JWT tokens
FRONTEND_URL=...                # Frontend domain
CORS_ORIGIN=...                 # CORS allowed origin
```

**What It Does**:
- ✅ Configures backend for production
- ✅ Sets MongoDB connection
- ✅ Sets JWT security
- ✅ Configures CORS

**How It Works**:
1. Local `.env` (ignored by git) - for testing
2. `backend/server.js` reads with `require("dotenv").config()`
3. Cloud Run reads from environment variables (not this file)

**Important**:
- ❌ Don't commit `.env` (has secrets!)
- ✅ Do commit `.env.example` (template only)
- Cloud Run gets values from `--set-env-vars` flag

---

### 6. `frontend/.env.production`
**Location**: `d:\Cakesman-Bakery\frontend\.env.production`

**Purpose**: Production environment variables for frontend

```env
REACT_APP_API_URL=https://cakesman-backend-[id].run.app/api
```

**What It Does**:
- ✅ Tells React where backend API is
- ✅ Used during `npm run build`
- ✅ Built into React app (not changeable after build)

**Why**:
- React is static HTML/JS (can't read env vars at runtime)
- Environment variables are baked into the build
- Must rebuild when URL changes

**Usage**:
```javascript
// In React components:
const API_URL = process.env.REACT_APP_API_URL;
fetch(`${API_URL}/products`);
```

---

## 📋 Deployment Scripts

### 7. `deploy.ps1`
**Location**: `d:\Cakesman-Bakery\deploy.ps1`

**Purpose**: Automated deployment script (PowerShell)

**What It Does**:
1. ✅ Verifies all prerequisites
2. ✅ Builds frontend
3. ✅ Deploys frontend to Firebase
4. ✅ Builds Docker image
5. ✅ Pushes to Container Registry
6. ✅ Deploys to Cloud Run
7. ✅ Gets Cloud Run URL
8. ✅ Updates frontend environment
9. ✅ Redeploys frontend with new URL
10. ✅ Tests everything

**How to Run**:
```powershell
cd d:\Cakesman-Bakery
.\deploy.ps1
```

**Output**: Success summary with all URLs

---

## 📚 Documentation Files

### 8. `DEPLOYMENT_QUICK_START.md`
Quick overview (5 min read)
- High-level steps
- Architecture diagram
- Quick troubleshooting

### 9. `FIREBASE_SETUP_GUIDE.md`
Detailed setup instructions (20 min)
- Create Firebase project
- Create MongoDB Atlas
- Install tools
- Pre-deployment checklist

### 10. `FIREBASE_CLOUD_RUN_DEPLOYMENT_GUIDE.md`
Step-by-step deployment (30 min)
- Every step explained
- Why each step matters
- Common errors & fixes

### 11. `ARCHITECTURE_OVERVIEW.md`
System design explanation (15 min)
- Component details
- Request flow
- Scaling strategy
- Cost breakdown

### 12. `TROUBLESHOOTING_GUIDE.md`
Problem solving reference
- Common issues
- Debugging commands
- Quick fixes

### 13. `DEPLOYMENT_ROADMAP.md`
Complete journey map
- Document index
- Complete checklist
- Command reference
- Update workflows

---

## 📂 File Structure After Deployment

```
d:\Cakesman-Bakery\
├── .firebaserc                                    ✅ Firebase config
├── firebase.json                                  ✅ Hosting rules
├── deploy.ps1                                     ✅ Automated script
│
├── DEPLOYMENT_ROADMAP.md                         📖 Start here
├── DEPLOYMENT_QUICK_START.md                     📖 Quick guide
├── FIREBASE_SETUP_GUIDE.md                       📖 Setup steps
├── FIREBASE_CLOUD_RUN_DEPLOYMENT_GUIDE.md        📖 Main guide
├── ARCHITECTURE_OVERVIEW.md                      📖 System design
├── TROUBLESHOOTING_GUIDE.md                      📖 Problem solving
│
├── frontend/
│   ├── .env                                      (dev environment)
│   ├── .env.local                                (local overrides)
│   ├── .env.production                           ✅ Prod API URL
│   ├── package.json
│   ├── src/
│   ├── public/
│   └── build/                                    ✅ Generated by npm run build
│       └── (compiled React app)
│
└── backend/
    ├── .env                                      (dev environment)
    ├── .env.example                              (template)
    ├── .env.production                           ✅ Prod vars
    ├── .dockerignore                             ✅ Docker settings
    ├── Dockerfile                                ✅ Container image definition
    ├── package.json
    ├── server.js
    ├── routes/
    ├── models/
    ├── controllers/
    ├── middleware/
    └── config/
```

---

## 🔄 Deployment Flow (Using Files)

```
1. Developer makes changes
         │
         ▼
2. Build frontend
   npm run build
   → Uses frontend/.env.production
   → Outputs to frontend/build/
         │
         ▼
3. Deploy frontend
   firebase deploy --only hosting
   → Uses firebase.json (routing rules)
   → Uses .firebaserc (project ID)
   → Uploads frontend/build/ to Firebase
         │
         ▼
4. Build Docker image
   docker build -t image .
   → Uses backend/Dockerfile
   → Uses .dockerignore (exclude files)
   → Outputs Docker image
         │
         ▼
5. Push Docker image
   docker push gcr.io/project/image
   → Uploads to Google Container Registry
         │
         ▼
6. Deploy to Cloud Run
   gcloud run deploy ...
   → Pulls Docker image
   → Uses env vars (from .env.production)
   → Starts container
         │
         ▼
LIVE! Users access both frontend and backend
```

---

## 🚀 Key Environment Variables Explained

### Backend Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `PORT` | Port app listens on | `5001` |
| `NODE_ENV` | Environment mode | `production` |
| `MONGO_URI` | Database connection | `mongodb+srv://...` |
| `JWT_SECRET` | Token signing key | `abc123...xyz` |
| `FRONTEND_URL` | Frontend domain | `https://...web.app` |
| `CORS_ORIGIN` | Allowed CORS origin | `https://...web.app` |

### Frontend Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `REACT_APP_API_URL` | Backend API URL | `https://...run.app/api` |

**Note**: React variables must start with `REACT_APP_` to be accessible in code

---

## 📊 File Dependency Graph

```
User's Browser
      │
      ▼
firebase.json ──────────────────── Routes requests
      │                                │
      ├─ /api/** ─────────────────────┼──→ Cloud Run
      │                                │     (Docker image)
      └─ /** ──────────────────────────┘─→ frontend/build/
                                            (React app)
                                            

Cloud Run Service
      │
      ├─ Uses backend/Dockerfile ──→ Docker image
      │
      ├─ Uses env vars ──────────→ backend/.env.production
      │                            (via gcloud --set-env-vars)
      │
      └─ Connects to ─────────────→ MongoDB Atlas
                                    (via MONGO_URI)


Frontend/build
      │
      ├─ Uses API URL ──────────────→ frontend/.env.production
      │                               (baked into build)
      │
      └─ Calls backend API ─────────→ https://...run.app/api
```

---

## 🎯 Which File To Edit When

| Need | Edit This |
|------|-----------|
| Change CORS settings | `firebase.json` (routing) + `backend/.env.production` |
| Change API endpoint | `frontend/.env.production` + rebuild |
| Change MongoDB connection | `backend/.env.production` (then update in Cloud Run) |
| Change JWT secret | `backend/.env.production` (regenerate with Node crypto) |
| Add Route | `backend/routes/` + redeploy backend |
| Fix CORS error | `backend/server.js` CORS config + redeploy |
| Add React component | `frontend/src/` + rebuild + redeploy |
| Change database schema | `backend/models/` + redeploy backend |
| Update frontend styling | `frontend/src/` + rebuild + redeploy |
| Add API endpoint | `backend/routes/` + `backend/controllers/` + redeploy |

---

## ✅ Configuration Checklist

Before deploying:
- [ ] `firebase.json` exists and has correct paths
- [ ] `.firebaserc` has correct project ID
- [ ] `backend/Dockerfile` exists
- [ ] `backend/.env.production` is filled in
- [ ] `frontend/.env.production` is created
- [ ] `frontend/build/` exists (run `npm run build`)
- [ ] `deploy.ps1` exists
- [ ] All documentation files present

After deploying:
- [ ] Firebase Hosting URL works
- [ ] Cloud Run service is running
- [ ] MongoDB cluster is accessible
- [ ] Frontend loads API data
- [ ] No CORS errors

---

## 🆘 File-Related Troubleshooting

| Issue | Check File |
|-------|-----------|
| Routes returning 404 | `firebase.json` routing rules |
| CORS errors | `backend/server.js` + `backend/.env.production` |
| API not found | `frontend/.env.production` (API URL) |
| Docker build fails | `backend/Dockerfile` + `backend/.dockerignore` |
| MongoDB connection fails | `backend/.env.production` (MONGO_URI) |
| Firebase deploy fails | `.firebaserc` (project ID) + `firebase.json` |
| Wrong environment vars | `backend/.env.production` vs Cloud Run env vars |

---

**All files are ready! Proceed with [DEPLOYMENT_ROADMAP.md](./DEPLOYMENT_ROADMAP.md)**
