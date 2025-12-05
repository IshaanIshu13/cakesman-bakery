# 🚀 Deployment Guide: GitHub + Vercel

This guide will help you upload your Cakesman Bakery website to GitHub and host it on Vercel.

## 📋 Prerequisites

You'll need:
1. **GitHub Account** - Sign up at https://github.com
2. **Vercel Account** - Sign up at https://vercel.com
3. **Backend Hosting** - Railway (recommended) or Render
4. **Git installed** - Already done! ✅

---

## 🔑 Step 1: Create GitHub Repository

### 1.1 Create on GitHub.com

1. Go to https://github.com/new
2. **Repository name:** `cakesman-bakery`
3. **Description:** MERN Stack Bakery Management System
4. **Visibility:** Public (for free Vercel hosting)
5. **Click "Create repository"**

### 1.2 Get Your Repository URL

After creation, you'll see:
```
https://github.com/YOUR_USERNAME/cakesman-bakery.git
```

Copy this URL - you'll need it next!

---

## 📤 Step 2: Push Code to GitHub

### 2.1 Add Remote Repository

Replace `YOUR_USERNAME` with your actual GitHub username:

```powershell
cd d:\Cakesman-Bakery
git remote add origin https://github.com/YOUR_USERNAME/cakesman-bakery.git
git branch -M main
git push -u origin main
```

### 2.2 Verify on GitHub

Visit your repo at:
```
https://github.com/YOUR_USERNAME/cakesman-bakery
```

You should see all your files! ✅

---

## 🛠️ Step 3: Prepare Backend for Deployment

Your backend needs to be hosted separately (Vercel doesn't support Node.js servers long-term).

### Option A: Deploy to Railway (Recommended) ⭐

Railway is the easiest and most reliable option.

#### 3A.1 Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"

#### 3A.2 Deploy Backend

1. **New Project** → **Deploy from GitHub**
2. **Select repository:** `cakesman-bakery`
3. **Select root directory:** `backend`
4. Railway will auto-detect `package.json`

#### 3A.3 Configure Environment Variables

In Railway dashboard:
1. Go to your project
2. **Variables** tab
3. Add these variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5001
```

Get MongoDB URI:
- Go to https://cloud.mongodb.com
- Create/use existing cluster
- Get connection string
- Replace username/password

#### 3A.4 Get Your Backend URL

After deployment, Railway gives you a URL like:
```
https://your-project-name.railway.app
```

**Save this URL!** You'll need it for the frontend.

---

### Option B: Deploy to Render.com

If you prefer Render:

1. Go to https://render.com
2. **New Web Service** → **Connect from GitHub**
3. Select your repository
4. Set **Root Directory:** `backend`
5. Add environment variables (same as above)
6. Deploy!

---

## ⚛️ Step 4: Deploy Frontend to Vercel

### 4.1 Connect Vercel to GitHub

1. Go to https://vercel.com
2. **New Project**
3. **Import Git Repository**
4. Select `cakesman-bakery`
5. Click **Import**

### 4.2 Configure Vercel Project

**Framework:** React
**Root Directory:** `frontend`
**Build Command:** `npm run build`
**Output Directory:** `build`

### 4.3 Environment Variables for Frontend

In Vercel Dashboard → Your Project → **Settings** → **Environment Variables**

Add:
```
REACT_APP_API_URL=https://your-backend-url.railway.app
```

Example:
```
REACT_APP_API_URL=https://cakesman-api.railway.app
```

### 4.4 Deploy!

1. Click **Deploy**
2. Wait 2-5 minutes
3. You'll get a URL like: `https://cakesman-bakery.vercel.app`

---

## 🔗 Step 5: Update Frontend API Calls

Your frontend needs to use the deployed backend URL.

### 5.1 Update `frontend/src/utils/api.js`

Replace:
```javascript
const API_BASE_URL = "http://localhost:5001/api";
```

With:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
```

### 5.2 Update Backend Server URL (Socket.io)

In `frontend/src/context/SocketContext.jsx`, find:
```javascript
const socket = io("http://localhost:5001");
```

Replace with:
```javascript
const backendURL = process.env.REACT_APP_API_URL 
  ? process.env.REACT_APP_API_URL.replace("/api", "")
  : "http://localhost:5001";
const socket = io(backendURL);
```

### 5.3 Commit and Push Changes

```powershell
cd d:\Cakesman-Bakery
git add .
git commit -m "Update API URLs for production deployment"
git push origin main
```

Vercel will **auto-redeploy** when you push! ✅

---

## 🌐 Step 6: Configure Backend CORS

Update `backend/server.js` to allow requests from Vercel:

Find:
```javascript
const cors = require("cors");

app.use(cors());
```

Replace with:
```javascript
const cors = require("cors");

const allowedOrigins = [
  "http://localhost:3000",
  "https://cakesman-bakery.vercel.app", // Your Vercel URL
  "https://your-domain.com" // If you have a custom domain
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
```

Then:
```powershell
git add .
git commit -m "Update CORS for production deployment"
git push origin main
```

---

## ✅ Final Checklist

- [ ] GitHub repository created
- [ ] Code pushed to GitHub (`main` branch)
- [ ] Backend deployed to Railway/Render
- [ ] Backend URL obtained and copied
- [ ] Frontend environment variables configured
- [ ] Frontend API URLs updated
- [ ] CORS configured on backend
- [ ] Final commit pushed to GitHub
- [ ] Frontend auto-deployed on Vercel
- [ ] Website accessible at Vercel URL

---

## 🧪 Testing Your Deployed Site

1. Visit: `https://cakesman-bakery.vercel.app` (or your custom domain)
2. Test features:
   - ✅ Browse products
   - ✅ Add to cart
   - ✅ Login/Signup
   - ✅ Checkout
   - ✅ Admin dashboard
   - ✅ Order management
   - ✅ Customer management

---

## 🔧 Troubleshooting

### Issue: "Cannot fetch from backend"

**Solution:**
- Check Railway/Render deployment is active
- Verify backend URL in environment variables
- Check CORS configuration on backend
- Look at browser Console (F12) for exact error

### Issue: "502 Bad Gateway"

**Solution:**
- Backend might be cold-starting
- Click "Redeploy" in Railway/Render
- Wait 30 seconds for it to warm up

### Issue: "Build failed on Vercel"

**Solution:**
- Check Vercel build logs (click on deployment)
- Common cause: Wrong root directory (should be `frontend`)
- Ensure `REACT_APP_API_URL` is set in Environment Variables

### Issue: "Socket.io connection failed"

**Solution:**
- Backend URL must NOT have `/api` at the end
- Should be: `https://your-backend.railway.app`
- NOT: `https://your-backend.railway.app/api`

---

## 📱 Getting Custom Domain (Optional)

### With Vercel:
1. Vercel Dashboard → Project Settings → Domains
2. Add your domain
3. Follow DNS instructions
4. Cost: ~$12/year domain + free on Vercel

### With Railway:
1. Railway has free subdomains
2. Or use your own domain with DNS CNAME

---

## 💰 Estimated Costs

| Service | Free Tier | Paid |
|---------|-----------|------|
| **GitHub** | Unlimited ✅ | - |
| **Vercel** | 100GB/month ✅ | $20/month |
| **Railway** | $5/month ✅ | Pay as you go |
| **MongoDB Atlas** | 512MB ✅ | $57/month |
| **Custom Domain** | - | ~$12/year |

**Total Monthly Cost:** $0-5 (with free tiers)

---

## 📞 Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://railway.app/docs
- **GitHub Docs:** https://docs.github.com
- **MongoDB Atlas:** https://docs.mongodb.com/atlas/

---

## 🎉 You're Done!

Your website is now:
- ✅ On GitHub (version control)
- ✅ Deployed to Vercel (frontend)
- ✅ Deployed to Railway (backend)
- ✅ Live on the internet!

Share your link: `https://cakesman-bakery.vercel.app`

Happy baking! 🍰
