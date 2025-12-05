# Cakesman Bakery - GitHub & Deployment Guide

## Step 1: Create a GitHub Repository

### 1.1 Go to GitHub and create a new repository
1. Visit https://github.com/new
2. **Repository name**: `Cakesman-Bakery`
3. **Description**: "A full-stack MERN bakery e-commerce website"
4. **Visibility**: Public (so you can deploy for free)
5. Click **Create repository**

### 1.2 Copy the repository URL
After creating, GitHub will show you:
```
https://github.com/YOUR_USERNAME/Cakesman-Bakery.git
```

---

## Step 2: Push Your Project to GitHub

Run these commands in PowerShell (from `d:\Cakesman-Bakery`):

```powershell
# Configure your GitHub credentials (one-time setup)
git config --global user.name "Your Name"
git config --global user.email "your.email@gmail.com"

# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/Cakesman-Bakery.git

# Rename branch to main (optional, but recommended)
git branch -M main

# Push to GitHub
git push -u origin main
```

### Replace:
- `YOUR_USERNAME` with your actual GitHub username
- `your.email@gmail.com` with your GitHub email

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Install Vercel CLI
```powershell
npm install -g vercel
```

### 3.2 Deploy Frontend
```powershell
cd d:\Cakesman-Bakery\frontend
vercel
```

Follow the prompts:
- Link to GitHub: Yes
- Set production settings: Default values are fine
- Build command: `npm run build`
- Output directory: `build`

### 3.3 Get Your Frontend URL
After deployment, Vercel will show you:
```
https://cakesman-bakery.vercel.app
```

**Update Frontend Environment**:
Create `.env.production` in `frontend/` with:
```
REACT_APP_API_BASE_URL=https://your-backend-url.com/api
```

---

## Step 4: Deploy Backend to Railway.app

### 4.1 Create Railway Account
1. Visit https://railway.app
2. Sign up with GitHub (easier)
3. Create a new project

### 4.2 Connect GitHub Repository
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `Cakesman-Bakery` repository
4. Select the `backend` directory

### 4.3 Add Environment Variables
In Railway dashboard:
1. Go to Variables
2. Add these variables:
```
PORT=5001
MONGO_URI=mongodb://localhost:27017/cakesman
JWT_SECRET=cakesman_secret_key_2025
NODE_ENV=production
```

### 4.4 Upgrade MongoDB
Since local MongoDB won't work in production:

1. Create MongoDB Atlas account: https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/cakesman`
4. Update `MONGO_URI` in Railway with this connection string

### 4.5 Get Backend URL
Railway will provide:
```
https://cakesman-bakery-backend-production.railway.app
```

---

## Step 5: Update Frontend API Configuration

After getting your backend URL, update frontend:

**File**: `frontend/src/utils/axiosInstance.js`

```javascript
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://your-backend-url.railway.app/api',
  withCredentials: true
});
```

Push the changes:
```powershell
git add .
git commit -m "Update API endpoints for production"
git push origin main
```

Vercel will auto-deploy!

---

## Step 6: Complete Deployment Checklist

- [ ] GitHub repository created and code pushed
- [ ] MongoDB Atlas account created with cluster
- [ ] MongoDB connection string added to environment variables
- [ ] Backend deployed on Railway with MongoDB Atlas
- [ ] Frontend deployed on Vercel
- [ ] Frontend API endpoints updated
- [ ] CORS configured in backend for Vercel domain
- [ ] Tested login/register functionality
- [ ] Tested product browsing
- [ ] Tested add to cart functionality
- [ ] Tested checkout process

---

## Production Environment Variables

### Backend (Railway)
```
PORT=5001
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cakesman
JWT_SECRET=your-secure-secret-key
NODE_ENV=production
```

### Frontend (Vercel)
```
REACT_APP_API_BASE_URL=https://your-backend-url.railway.app/api
```

---

## Post-Deployment Seed Data

After backend deployment, seed the products in MongoDB Atlas:

1. Connect to MongoDB Atlas cluster
2. Run seed command on deployed backend:

```bash
# Or manually add products through admin dashboard at:
# https://your-frontend-url.vercel.app/admin
# Email: admin@cakesman.com
# Password: admin123
```

---

## Accessing Your Site from Anywhere

Once deployed:

1. **Frontend**: https://your-frontend-url.vercel.app
2. **Admin Dashboard**: https://your-frontend-url.vercel.app/admin
3. **Admin Credentials**:
   - Email: `admin@cakesman.com`
   - Password: `admin123`

---

## Troubleshooting

### CORS Errors
If you get CORS errors in browser console:

Update `backend/server.js`:
```javascript
const cors = require("cors");

app.use(cors({
  origin: ["https://your-vercel-url.vercel.app", "http://localhost:3000"],
  credentials: true
}));
```

### MongoDB Connection Issues
- Check if MongoDB Atlas IP whitelist includes Railway servers
- Verify connection string in environment variables
- Test connection with MongoDB Compass

### Vercel Deployment Issues
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Check that backend URL is correct in frontend

---

## Future Improvements

- [ ] Add payment integration (Stripe/Razorpay)
- [ ] Email notifications for orders
- [ ] Real-time order tracking
- [ ] Customer reviews and ratings
- [ ] Inventory management
- [ ] SMS notifications
- [ ] Analytics dashboard
- [ ] SEO optimization

---

## Useful Links

- **GitHub**: https://github.com/new
- **Vercel**: https://vercel.com
- **Railway**: https://railway.app
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **MongoDB Compass**: Download to manage databases locally

---

## Git Commands for Future Updates

After making changes locally:

```powershell
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push origin main

# Vercel will auto-deploy!
```

---

Generated: December 5, 2025
