# 🚀 Quick Start: Push to GitHub & Deploy

## STEP-BY-STEP INSTRUCTIONS

### Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Create repository named: **Cakesman-Bakery**
3. Set visibility to **Public**
4. Click "Create repository"
5. Copy your repository URL (looks like: https://github.com/YOUR_USERNAME/Cakesman-Bakery.git)

---

### Step 2: Push Your Code to GitHub

Open PowerShell in your project directory and run:

```powershell
cd d:\Cakesman-Bakery

# Configure Git (one-time only)
git config --global user.name "Your Name"
git config --global user.email "your.email@gmail.com"

# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/Cakesman-Bakery.git

# Push code to GitHub
git branch -M main
git push -u origin main
```

✅ Your code is now on GitHub! Visit: https://github.com/YOUR_USERNAME/Cakesman-Bakery

---

### Step 3: Deploy Backend to Railway

1. **Create Railway Account**: https://railway.app
   - Sign up with GitHub (recommended)

2. **In Railway Dashboard**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your **Cakesman-Bakery** repository
   - Select **backend** as service root directory

3. **Add Environment Variables** in Railway:
   - Click "Variables"
   - Add these:
     ```
     PORT=5001
     MONGO_URI=mongodb://localhost:27017/cakesman
     JWT_SECRET=cakesman_secret_key_2025
     NODE_ENV=production
     ```

4. **Setup MongoDB Atlas** (for production database):
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up (free account)
   - Create a cluster
   - Get connection string (looks like: mongodb+srv://user:pass@cluster.mongodb.net/cakesman)
   - Replace MONGO_URI in Railway with this connection string

5. **Deploy**:
   - Railway automatically deploys
   - You'll get a URL like: `https://cakesman-bakery-backend-production.railway.app`
   - Copy this URL (you'll need it next)

---

### Step 4: Deploy Frontend to Vercel

1. **Create Vercel Account**: https://vercel.com
   - Sign up with GitHub (recommended)

2. **Deploy Frontend**:
   - Click "Add New"
   - Select "Project"
   - Import your GitHub repository
   - Select **frontend** as root directory
   - Click "Deploy"

3. **Add Environment Variables**:
   - In Vercel Project Settings
   - Go to "Environment Variables"
   - Add:
     ```
     REACT_APP_API_BASE_URL=https://your-railway-backend-url/api
     ```
     Replace `your-railway-backend-url` with the URL you got from Railway

4. **Redeploy**:
   - Vercel will redeploy automatically
   - You'll get a URL like: `https://cakesman-bakery.vercel.app`

---

### Step 5: Test Your Deployed Site

1. **Customer Site**: Visit https://your-frontend-url.vercel.app
2. **Admin Dashboard**: https://your-frontend-url.vercel.app/admin
3. **Login with demo account**:
   - Email: `admin@cakesman.com`
   - Password: `admin123`

---

## Troubleshooting

### If products aren't loading:
- Make sure MongoDB Atlas has the correct connection string
- Check that your IP is whitelisted in MongoDB Atlas
- Verify environment variables in Railway

### If you see CORS errors:
- Update `backend/server.js` CORS configuration with Vercel URL
- Redeploy backend

### If admin can't login:
- Make sure you seeded the database
- Check JWT_SECRET matches between backend and frontend

---

## Future Updates

After making changes locally:
```powershell
git add .
git commit -m "Your commit message"
git push origin main
```

Both Vercel and Railway will auto-deploy!

---

## 📚 Full Documentation

- [Database Information](./DATABASE_INFO.md)
- [Deployment Guide](./GITHUB_DEPLOYMENT_GUIDE.md)
- [Main README](./README.md)

---

**You're all set! Your Cakesman Bakery site is now live on the internet! 🎉**
