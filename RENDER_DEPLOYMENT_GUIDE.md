# Render Backend Deployment Guide

## Prerequisites
- GitHub repository with backend code pushed
- MongoDB Atlas cluster and connection string
- Vercel frontend URL
- Render account (https://render.com)

## Step-by-Step Deployment on Render

### Step 1: Connect GitHub to Render
1. Go to https://render.com/dashboard
2. Click **"New +"** → **"Web Service"**
3. Select **"Connect a repository"**
4. Choose your GitHub account and authorize
5. Select repository: `IshaanIshu13/cakesman-bakery`
6. Click **"Connect"**

### Step 2: Configure Service Settings
1. **Name**: `cakesman-bakery-backend`
2. **Environment**: `Node`
3. **Region**: `Oregon` (free tier)
4. **Branch**: `main`
5. **Root Directory**: `backend`
6. **Build Command**: `npm install`
7. **Start Command**: `npm start`
8. **Instance Type**: `Free` (optional for production use paid tier)

### Step 3: Add Environment Variables
In the **"Environment Variables"** section, add:

```
PORT=5001
NODE_ENV=production
MONGO_URI=mongodb+srv://gandhiishaan132_db_user:ishaan@132@cluster0.jefmvix.mongodb.net/?appName=Cluster0
JWT_SECRET=ishaan@132
FRONTEND_URL=https://your-vercel-frontend-url.vercel.app
```

Replace `FRONTEND_URL` with your actual Vercel frontend URL (e.g., https://cakesman-bakery.vercel.app)

### Step 4: Deploy
1. Click **"Create Web Service"**
2. Render will build and deploy your backend
3. Wait for deployment to complete (usually 2-3 minutes)
4. Copy your Render URL (e.g., `https://cakesman-bakery-backend.onrender.com`)

### Step 5: Update Frontend with Backend URL
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add/Update:
   ```
   REACT_APP_API_URL=https://cakesman-bakery-backend.onrender.com/api
   ```
4. Click **"Save"**
5. Redeploy frontend (click "Redeploy" button)

### Step 6: Test Backend Health
Open in your browser:
```
https://cakesman-bakery-backend.onrender.com/api/health
```

You should see:
```json
{
  "message": "Backend is running"
}
```

### Step 7: Verify CRUD Operations

**Test API with Products:**
```bash
# Get all products
curl https://cakesman-bakery-backend.onrender.com/api/products

# Create a product (requires auth)
curl -X POST https://cakesman-bakery-backend.onrender.com/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Cake", "price": 500}'
```

## Important Notes

⚠️ **Free Tier Limitations:**
- Free tier services spin down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- For production, upgrade to Paid tier

✅ **Production Checklist:**
- [ ] Backend deployed on Render
- [ ] MongoDB Atlas URI in environment variables
- [ ] FRONTEND_URL updated to Vercel URL
- [ ] Frontend has REACT_APP_API_URL set
- [ ] Health check endpoint works
- [ ] CRUD operations working (test in frontend)
- [ ] Admin dashboard creating/editing products
- [ ] Shopping cart adding items
- [ ] Orders being created

## Troubleshooting

**Connection Timeout:**
- Check MongoDB URI is correct
- Verify IP whitelist in MongoDB Atlas (allow all: 0.0.0.0/0)

**CORS Errors:**
- Verify FRONTEND_URL is set correctly in Render environment
- Check frontend REACT_APP_API_URL matches Render backend URL

**Build Failures:**
- Check build logs in Render dashboard
- Ensure all dependencies in `package.json` are installed
- Verify `backend/` folder has `package.json`

## Useful Links
- Render Dashboard: https://render.com/dashboard
- MongoDB Atlas: https://mongodb.com/cloud/atlas
- Vercel Dashboard: https://vercel.com/dashboard
- Render Logs: Check real-time logs in service dashboard
