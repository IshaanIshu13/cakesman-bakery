# Complete Deployment Guide: Vercel + Render + MongoDB Atlas

## Current Status
- **Frontend**: Vercel (https://vercel.com)
- **Backend**: Render (https://render.com)
- **Database**: MongoDB Atlas (Cloud)

---

## STEP 1: Verify Backend is Ready

Your backend should have:
- ✅ `.env` file with MongoDB URI (URL-encoded)
- ✅ `render.yaml` configuration
- ✅ All routes configured (products, orders, cart, auth)
- ✅ CORS configured for frontend URL

**Current .env settings:**
```
PORT=5001
MONGO_URI=mongodb+srv://gandhiishaan132_db_user:ishaan%40132@cluster0.jefmvix.mongodb.net/?appName=Cluster0
JWT_SECRET=ishaan@132
NODE_ENV=production
FRONTEND_URL=https://your-vercel-frontend.vercel.app
```

---

## STEP 2: Deploy Backend on Render

### 2.1 Create Render Account
- Go to https://render.com
- Sign up or log in
- Connect your GitHub account

### 2.2 Deploy Backend Service
1. Click **"New +"** → **"Web Service"**
2. Select your repository: **IshaanIshu13/cakesman-bakery**
3. Fill in settings:
   - **Name**: `cakesman-bakery-backend`
   - **Environment**: `Node`
   - **Region**: `Singapore` (closest to Asia) or `Oregon`
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free` (for testing)

### 2.3 Add Environment Variables in Render
Click **"Environment"** and add:

| Key | Value |
|-----|-------|
| PORT | 5001 |
| NODE_ENV | production |
| MONGO_URI | mongodb+srv://gandhiishaan132_db_user:ishaan%40132@cluster0.jefmvix.mongodb.net/?appName=Cluster0 |
| JWT_SECRET | ishaan@132 |
| FRONTEND_URL | https://your-vercel-frontend.vercel.app |

⚠️ **Replace `FRONTEND_URL`** with your actual Vercel URL (you'll get it in Step 4)

### 2.4 Deploy
- Click **"Create Web Service"**
- Wait 3-5 minutes for deployment
- **Copy your Render URL** (e.g., `https://cakesman-bakery-backend.onrender.com`)

### 2.5 Test Backend is Working
Open in browser:
```
https://cakesman-bakery-backend.onrender.com/api/health
```

Should show:
```json
{
  "message": "Backend is running"
}
```

---

## STEP 3: Frontend Environment Setup

### 3.1 Update Frontend Environment Variables
In `frontend/.env.local` (create if doesn't exist), add:

```env
REACT_APP_API_URL=https://cakesman-bakery-backend.onrender.com/api
```

Replace with your actual Render backend URL.

### 3.2 Verify API Configuration
Check `frontend/src/utils/axiosInstance.js` uses:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
```

---

## STEP 4: Deploy Frontend on Vercel

### 4.1 Vercel Setup
1. Go to https://vercel.com/dashboard
2. Click **"Add New"** → **"Project"**
3. Select **"Import Git Repository"**
4. Choose: `IshaanIshu13/cakesman-bakery`

### 4.2 Configure Vercel Project
- **Framework Preset**: Select `Other` (auto-detect)
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `build`

### 4.3 Add Environment Variables in Vercel
Click **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| REACT_APP_API_URL | https://cakesman-bakery-backend.onrender.com/api |

⚠️ **Use your actual Render backend URL from Step 2.4**

### 4.4 Deploy
- Click **"Deploy"**
- Wait 2-3 minutes
- **Copy your Vercel URL** (e.g., `https://cakesman-bakery.vercel.app`)

---

## STEP 5: Update Backend with Frontend URL

### 5.1 Update Render Environment
1. Go back to Render dashboard
2. Open your backend service: `cakesman-bakery-backend`
3. Click **"Environment"**
4. Edit **`FRONTEND_URL`** and set it to your Vercel URL
5. Click **"Save"**
6. Service will auto-redeploy

---

## STEP 6: Verification Checklist

Test each feature:

### Backend Health
```bash
# Should return {"message": "Backend is running"}
curl https://cakesman-bakery-backend.onrender.com/api/health
```

### Get Products
```bash
# Should return array of products
curl https://cakesman-bakery-backend.onrender.com/api/products
```

### Frontend Load
- Open: `https://cakesman-bakery.vercel.app`
- Check console for no CORS errors
- Should load products from backend

### Test CRUD Operations

**1. Products**
- [ ] Homepage loads with products from database
- [ ] Click on product → product detail page loads
- [ ] Admin can create new product
- [ ] Admin can edit product
- [ ] Admin can delete product

**2. Cart**
- [ ] Add product to cart
- [ ] Cart displays correct items
- [ ] Can change quantity
- [ ] Can remove item
- [ ] Cart total calculates correctly

**3. Orders**
- [ ] Login/Register works
- [ ] Can checkout
- [ ] Order saved to database
- [ ] Admin can see orders in dashboard

**4. Authentication**
- [ ] Sign up creates user
- [ ] Login works
- [ ] Logout works
- [ ] Token stored in localStorage

---

## TROUBLESHOOTING

### CORS Error in Frontend Console
**Problem**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
1. Check `FRONTEND_URL` is set in Render environment
2. Verify it matches your Vercel URL exactly
3. Redeploy Render backend

### API Requests Return 404
**Problem**: Frontend can't find backend endpoints

**Solution**:
1. Check `REACT_APP_API_URL` in Vercel environment
2. Make sure it ends with `/api`
3. Test with: `curl https://your-render-url/api/health`

### MongoDB Connection Error
**Problem**: Backend can't connect to MongoDB

**Solution**:
1. Verify `MONGO_URI` in Render is URL-encoded (`@` = `%40`)
2. Check MongoDB Atlas IP whitelist allows all (0.0.0.0/0)
3. Check database user credentials are correct

### Free Tier Spindown
**Problem**: Backend takes 30 seconds to respond after inactivity

**Solution**:
- This is normal on Render free tier
- Upgrade to Paid tier for instant response
- Or use a monitoring service to keep it alive

---

## Production Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables set on both platforms
- [ ] CORS configured correctly
- [ ] All CRUD operations working
- [ ] Admin dashboard functional
- [ ] Shopping cart working
- [ ] Checkout/Orders working
- [ ] Authentication working
- [ ] No errors in browser console
- [ ] Database seeded with products
- [ ] Mobile responsive verified

---

## Quick Links

| Service | Link |
|---------|------|
| Render Dashboard | https://render.com/dashboard |
| Vercel Dashboard | https://vercel.com/dashboard |
| MongoDB Atlas | https://cloud.mongodb.com |
| Your Frontend | https://cakesman-bakery.vercel.app |
| Your Backend | https://cakesman-bakery-backend.onrender.com |

---

## Support

If you encounter issues:
1. Check Render logs: Service Dashboard → "Logs"
2. Check Vercel logs: Project → "Deployments"
3. Check browser console: F12 → Console tab
4. Test API directly: Use curl or Postman
