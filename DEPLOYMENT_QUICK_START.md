# 🚀 Quick Start Deployment Guide (5-Minute Overview)

## 📋 Before You Start

Make sure you have:
1. ✅ Google Account (for Firebase & Cloud)
2. ✅ Node.js v16+ installed
3. ✅ Docker Desktop installed
4. ✅ Git installed

---

## 🎯 Deployment in 5 Steps

### Step 1: Install Firebase CLI
```powershell
npm install -g firebase-tools
firebase login
```

### Step 2: Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click **"Add Project"**
3. Name: `cakesman-bakery`
4. Click **Create**

### Step 3: Setup MongoDB Atlas
1. Go to https://www.mongodb.com/cloud/atlas
2. Create account & cluster (Free M0 tier)
3. Create user: `cakesman_user`
4. Copy connection string
5. Update `backend\.env.production`:
```env
MONGO_URI=mongodb+srv://cakesman_user:PASSWORD@cluster0.mongodb.net/cakesman?retryWrites=true&w=majority
```

### Step 4: Build Frontend
```powershell
cd frontend
npm install
npm run build
cd ..
```

### Step 5: Run Deployment Script
```powershell
# Make sure you're in the project root directory
.\deploy.ps1
```

**That's it! Check the final URLs printed by the script.**

---

## 🌐 Your Production URLs

After deployment:
- **Frontend**: `https://cakesman-bakery.web.app`
- **Backend API**: `https://cakesman-backend-[random-id].run.app/api`
- **Admin Panel**: `https://cakesman-bakery.web.app/admin`

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         INTERNET                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│              FIREBASE HOSTING (React Frontend)                │
│          https://cakesman-bakery.web.app                     │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  • Static HTML/CSS/JS (React build)                    │  │
│  │  • CDN-backed (fast worldwide access)                  │  │
│  │  • Automatic SSL/TLS                                  │  │
│  │  • Auto-scaling                                       │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                              │
                              │ API Calls
                              │ (/api/...)
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                 GOOGLE CLOUD RUN (Backend)                    │
│    https://cakesman-backend-[id].run.app/api                 │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  • Express.js Server (Node.js)                         │  │
│  │  • Containerized with Docker                          │  │
│  │  • Auto-scaling (0 → N instances)                     │  │
│  │  • Handles authentication, orders, products           │  │
│  │  • Free tier: 2M requests/month                       │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                              │
                              │ Database Queries
                              │ (CRUD Operations)
                              ▼
┌──────────────────────────────────────────────────────────────┐
│              MONGODB ATLAS (Managed Database)                 │
│    mongodb+srv://cluster0.mongodb.net/cakesman               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  • Collections: products, orders, users, customers     │  │
│  │  • Automatic backups                                  │  │
│  │  • Free tier: M0 (512MB storage)                      │  │
│  │  • IP whitelist security                             │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## 💰 Estimated Costs (Per Month)

| Service | Free Tier | Responsibility | Cost |
|---------|-----------|--------------|------|
| Firebase Hosting | ✅ 10GB/month | Frontend | $0 - $0.18/GB |
| Cloud Run | ✅ 2M requests | Backend | $0 - $0.00002/vCPU-sec |
| MongoDB Atlas | ✅ M0 Shared | Database | $0 - $9+ |
| **TOTAL** | | | **$0-9/month** |

*Free tier is suitable for small to medium traffic. Scale as needed.*

---

## 🔄 Update Workflow (After Initial Deployment)

### Update Frontend
```powershell
cd frontend
npm run build
firebase deploy --only hosting
```

### Update Backend
```powershell
cd backend
docker build -t gcr.io/cakesman-bakery/cakesman-backend .
docker push gcr.io/cakesman-bakery/cakesman-backend
gcloud run deploy cakesman-backend --image=gcr.io/cakesman-bakery/cakesman-backend --region=us-central1
```

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Frontend shows blank page | Run: `firebase deploy --only hosting` |
| Backend not responding | Check: `gcloud run logs read cakesman-backend` |
| CORS errors in console | Update `FRONTEND_URL` env var in Cloud Run |
| MongoDB connection fails | Verify IP whitelist in MongoDB Atlas (0.0.0.0/0) |
| 502 Bad Gateway | Increase Cloud Run memory: `--memory 1Gi` |

---

## 📞 Need Full Details?

See comprehensive guide: [FIREBASE_CLOUD_RUN_DEPLOYMENT_GUIDE.md](./FIREBASE_CLOUD_RUN_DEPLOYMENT_GUIDE.md)

See troubleshooting: [TROUBLESHOOTING_GUIDE.md](./TROUBLESHOOTING_GUIDE.md)

---

## ✅ Final Checklist

- [ ] Firebase project created
- [ ] Google Cloud project setup
- [ ] MongoDB Atlas cluster & user created
- [ ] Environment variables updated
- [ ] Frontend built (`npm run build`)
- [ ] Deployed using `.\deploy.ps1`
- [ ] Frontend loads at https://cakesman-bakery.web.app
- [ ] Backend API responds at Cloud Run URL
- [ ] Login works
- [ ] Products load
- [ ] Can place an order

---

**🎉 Congratulations! Your Cakesman Bakery is now live in production!**

Check your running services: https://console.firebase.google.com
