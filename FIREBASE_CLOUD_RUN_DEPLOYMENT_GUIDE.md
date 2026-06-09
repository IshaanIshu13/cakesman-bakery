# 🚀 Cakesman Bakery - Complete Deployment Guide
# Firebase Hosting + Cloud Run + MongoDB Atlas

## Overview
This guide walks you through deploying Cakesman Bakery to production using:
- **Firebase Hosting** → React frontend
- **Cloud Run** → Express.js backend
- **MongoDB Atlas** → Managed database
- **Total Deployment Time**: ~45 minutes

---

## 📋 Prerequisites

Before you begin, ensure you have:
1. **Google Cloud Account** - [Create one here](https://cloud.google.com)
2. **Firebase Project** - [Create in Firebase Console](https://console.firebase.google.com)
3. **Docker installed** - [Download Docker Desktop](https://www.docker.com/products/docker-desktop)
4. **Firebase CLI** - Install with `npm install -g firebase-tools`
5. **Google Cloud CLI** - [Install here](https://cloud.google.com/sdk/docs/install)
6. **Git** - For version control

---

## 🎯 Step-by-Step Deployment

### STEP 1: Check Prerequisites

```powershell
# Verify installations
node --version
npm --version
firebase --version
gcloud --version
docker --version
git --version
```

**Expected Output**: All commands should return version numbers (v16+ for Node.js)

---

### STEP 2: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"**
3. Project name: `cakesman-bakery`
4. Enable Google Analytics (optional)
5. Create project
6. Once created, select your project
7. Go to **Settings** → **Project Settings** → Copy your **Project ID**

**Expected**: Firebase project `cakesman-bakery` created

---

### STEP 3: Setup Google Cloud Project

```powershell
# Copy your Firebase Project ID from the console above
$PROJECT_ID = "cakesman-bakery"

# Initialize Google Cloud
gcloud init

# Set default project
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

**Expected**: All APIs should be enabled (check: `gcloud services list --enabled | Select-String "run\|container\|cloud"`)

---

### STEP 4: Setup MongoDB Atlas

#### A. Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new project named `cakesman-bakery`
4. Create a cluster:
   - Tier: **M0 (Free tier)** or **M2.5 (Shared tier)**
   - Region: Choose closest to your location
   - Click **"Create Cluster"**
5. Wait for cluster creation (5-10 minutes)

#### B. Setup Database User & Connection String

1. In MongoDB Atlas, go to **Network Access**
2. Click **"Add IP Address"**
3. Select **"Allow access from anywhere"** (0.0.0.0/0)
4. Go to **Database Access**
5. Click **"Add Database User"**
   - Username: `cakesman_user`
   - Password: Generate strong password (copy it!)
   - Built-in Role: `atlasAdmin`
   - Click **"Add User"**

#### C. Get Connection String

1. In MongoDB Atlas, click **"Connect"** on your cluster
2. Select **"Drivers"**
3. Choose **Node.js** and **v4.x or v5.x**
4. Copy the connection string
5. Replace `<username>` and `<password>` with your credentials
6. Replace `myFirstDatabase` with `cakesman`

**Connection String Format**:
```
mongodb+srv://cakesman_user:PASSWORD@cluster0.mongodb.net/cakesman?retryWrites=true&w=majority
```

**Expected**: Connection string copied and credentials saved securely

---

### STEP 5: Update Environment Variables

#### Backend Production Environment

Edit `backend\.env.production`:
```env
NODE_ENV=production
PORT=5001
MONGO_URI=mongodb+srv://cakesman_user:YOUR_PASSWORD@cluster0.mongodb.net/cakesman?retryWrites=true&w=majority
JWT_SECRET=generate_this_with_nodejs_crypto
FRONTEND_URL=https://cakesman-bakery.web.app
CORS_ORIGIN=https://cakesman-bakery.web.app
```

**Generate JWT Secret**:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Frontend Production Environment

Edit `frontend\.env.production`:
```env
REACT_APP_API_URL=https://YOUR_CLOUD_RUN_SERVICE_URL/api
```

*Note: You'll update this after Cloud Run deployment*

---

### STEP 6: Build Frontend

```powershell
cd d:\Cakesman-Bakery\frontend

# Install dependencies if not already done
npm install

# Build for production
npm run build

# Verify build output
ls -la build/
```

**Expected Output**:
```
Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d----          06/04/2026  10:30 AM                build
```

---

### STEP 7: Deploy Frontend to Firebase Hosting

```powershell
cd d:\Cakesman-Bakery

# Login to Firebase
firebase login

# Deploy frontend only
firebase deploy --only hosting

# Get your Firebase Hosting URL
firebase hosting:channel:list
```

**Expected Output**:
```
✔ Deploy complete!

Project Console: https://console.firebase.google.com/project/cakesman-bakery
Hosting URL: https://cakesman-bakery.web.app
```

---

### STEP 8: Build & Push Backend Docker Image

```powershell
cd d:\Cakesman-Bakery\backend

# Set variables
$PROJECT_ID = "cakesman-bakery"
$REGION = "us-central1"  # Change if needed
$SERVICE_NAME = "cakesman-backend"
$IMAGE_TAG = "gcr.io/$PROJECT_ID/$SERVICE_NAME"

# Build Docker image
docker build -t $IMAGE_TAG .

# Authenticate Docker with Google Cloud
gcloud auth configure-docker

# Push image to Google Container Registry
docker push $IMAGE_TAG

# Or use Artifact Registry (recommended)
gcloud auth configure-docker $REGION-docker.pkg.dev
docker tag $IMAGE_TAG "$REGION-docker.pkg.dev/$PROJECT_ID/docker/$SERVICE_NAME"
docker push "$REGION-docker.pkg.dev/$PROJECT_ID/docker/$SERVICE_NAME"
```

**Expected Output**: Image successfully pushed to registry

---

### STEP 9: Deploy Backend to Cloud Run

```powershell
$PROJECT_ID = "cakesman-bakery"
$REGION = "us-central1"
$SERVICE_NAME = "cakesman-backend"

# Deploy to Cloud Run
gcloud run deploy $SERVICE_NAME `
  --image "gcr.io/$PROJECT_ID/$SERVICE_NAME" `
  --region $REGION `
  --project $PROJECT_ID `
  --platform managed `
  --memory 512Mi `
  --cpu 1 `
  --timeout 3600 `
  --allow-unauthenticated `
  --set-env-vars "NODE_ENV=production" `
  --set-env-vars "PORT=5001" `
  --set-env-vars "MONGO_URI=mongodb+srv://cakesman_user:PASSWORD@cluster0.mongodb.net/cakesman?retryWrites=true&w=majority" `
  --set-env-vars "JWT_SECRET=your_jwt_secret_here" `
  --set-env-vars "FRONTEND_URL=https://cakesman-bakery.web.app"

# Get the service URL
gcloud run services describe $SERVICE_NAME --region $REGION --platform managed
```

**Expected Output**:
```
Service URL: https://cakesman-backend-[random-id].run.app
```

---

### STEP 10: Update Frontend Environment Variable

Now that you have the Cloud Run URL, update the frontend:

Edit `frontend\.env.production`:
```env
REACT_APP_API_URL=https://cakesman-backend-[random-id].run.app/api
```

Then rebuild and redeploy:

```powershell
cd d:\Cakesman-Bakery\frontend

# Rebuild frontend
npm run build

# Deploy updated frontend
firebase deploy --only hosting
```

---

### STEP 11: Configure CORS & Headers

Update `backend\server.js` to handle Cloud Run environment:

```javascript
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    process.env.FRONTEND_URL,
    "https://cakesman-bakery.web.app"
  ].filter(Boolean),
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
```

---

### STEP 12: Test Production Deployment

```powershell
# Access your deployed frontend
Start-Process "https://cakesman-bakery.web.app"

# Test backend API
Invoke-WebRequest -Uri "https://cakesman-backend-[id].run.app/api/health" -Method GET

# Check logs
gcloud run logs read cakesman-backend --region us-central1 --limit 50
```

**Testing Checklist**:
- [ ] Frontend loads at https://cakesman-bakery.web.app
- [ ] Can navigate pages without 404 errors
- [ ] Backend API responds at `/api/health`
- [ ] Login/authentication works
- [ ] Can view products
- [ ] Can add to cart
- [ ] Can complete order
- [ ] Admin panel loads
- [ ] No CORS errors in browser console

---

## 🔧 Production Configuration

### Socket.io Configuration (Optional for Cloud Run)

Since Cloud Run doesn't natively support WebSocket without additional setup, either:

**Option A**: Run Socket.io (requires sticky sessions - use Nginx proxy)
**Option B**: Replace with REST polling (simpler for Cloud Run)

For now, Socket.io should work, but if you experience issues, implement polling fallback.

### Database Indexing

Ensure MongoDB has proper indexes in Atlas:

```javascript
// In your MongoDB models, indexes are created automatically by Mongoose
// Verify in MongoDB Atlas → Collections → View Indexes
```

---

## 🆘 Common Issues & Fixes

### Issue 1: CORS Errors
**Solution**: Ensure `FRONTEND_URL` and `CORS_ORIGIN` environment variables are set correctly in Cloud Run.

```powershell
gcloud run services update cakesman-backend \
  --set-env-vars "FRONTEND_URL=https://cakesman-bakery.web.app"
```

### Issue 2: MongoDB Connection Timeout
**Solution**: 
1. Check IP whitelist in MongoDB Atlas (should be 0.0.0.0/0 for testing)
2. Verify connection string is correct
3. Check MongoDB Atlas cluster status

### Issue 3: Container Port Mismatch
**Solution**: Cloud Run ignores PORT in Dockerfile EXPOSE, ensure your Node.js app listens on the PORT environment variable:

```javascript
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Issue 4: Large Build Time
**Solution**: 
1. Use Artifact Registry instead of Container Registry
2. Enable Cloud Build caching
3. Reduce node_modules size (remove dev dependencies in production)

### Issue 5: 502/503 Errors on Cold Start
**Solution**:
1. Increase memory to 1GB: `--memory 1Gi`
2. Set timeout to 540s: `--timeout 540`
3. Connection pooling in MongoDB (handled by Mongoose)

---

## 📊 Monitoring & Logs

```powershell
# View real-time logs
gcloud run logs read cakesman-backend --region us-central1 --follow

# View logs for specific time
gcloud run logs read cakesman-backend --region us-central1 --limit 100

# Check Cloud Run metrics
gcloud monitoring dashboards list
```

---

## 🔐 Security Checklist

- [ ] JWT_SECRET is strong (32+ characters, random)
- [ ] MongoDB user has limited permissions (not admin in production)
- [ ] IP whitelist set in MongoDB Atlas
- [ ] HTTPS enforced (automatic with Firebase & Cloud Run)
- [ ] Environment variables contain no secrets in code
- [ ] CORS properly configured
- [ ] Input validation on all API endpoints
- [ ] Rate limiting implemented (optional)

---

## 📞 Support Resources

- **Firebase Hosting Docs**: https://firebase.google.com/docs/hosting
- **Cloud Run Docs**: https://cloud.google.com/run/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Google Cloud Documentation**: https://cloud.google.com/docs

---

## ✅ Final Checklist

- [ ] Firebase project created
- [ ] Google Cloud Project configured
- [ ] MongoDB Atlas cluster created & connection string obtained
- [ ] Environment variables updated
- [ ] Frontend built
- [ ] Frontend deployed to Firebase Hosting
- [ ] Backend Docker image built & pushed
- [ ] Backend deployed to Cloud Run
- [ ] Frontend environment variables updated with Cloud Run URL
- [ ] Frontend redeployed
- [ ] All tests passing in production
- [ ] Custom domain configured (optional)
- [ ] SSL/TLS working (automatic)
- [ ] Monitoring set up
- [ ] Backups configured for MongoDB

---

**Estimated Costs**:
- Firebase Hosting (Free tier): $0
- Cloud Run (Free tier): $0
- MongoDB Atlas (M0 Free): $0
- **Total**: FREE for testing/small production

**Upgrade when needed**:
- Firebase Hosting Pro: $0.18/GB
- Cloud Run: $0.00002400 per vCPU-second
- MongoDB Atlas M2.5: $9/month

---

Need help with any step? Check the **common issues** section above or refer to the official documentation links.

Good Luck! 🎉
