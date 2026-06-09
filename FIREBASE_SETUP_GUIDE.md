# 📱 Step-by-Step Firebase Project Setup Guide

## Complete Instructions with Screenshots

---

## TASK 1: Create Google Cloud Project

### Step 1.1: Open Google Cloud Console
1. Go to: https://console.cloud.google.com
2. Sign in with your Google account
3. If prompted, accept Terms of Service

### Step 1.2: Create New Project
1. Click project dropdown at top (next to "Google Cloud")
2. Click **"NEW PROJECT"**
3. Fill in:
   - **Project name**: `cakesman-bakery`
   - **Organization**: (leave empty)
   - Click **"CREATE"**
4. Wait 1-2 minutes for project creation

### Step 1.3: Select Your Project
1. Click project dropdown again
2. Select `cakesman-bakery`
3. Verify it says "cakesman-bakery" in the header

---

## TASK 2: Create Firebase Project

### Step 2.1: Go to Firebase Console
1. Open: https://console.firebase.google.com
2. You should already be signed in with same Google account

### Step 2.2: Add Project
1. Click **"Add project"** (or "Create project")
2. Project name: `cakesman-bakery` (same as Cloud project)
3. Click **"Continue"**

### Step 2.3: Enable Analytics (Optional)
1. Toggle **"Enable Google Analytics for this project"** ON (optional)
2. Click **"Continue"**
3. Choose analytics location (your country)
4. Click **"Create project"**
5. Wait for setup (~3 minutes)

### Step 2.4: Verify Firebase Project
You should see:
```
cakesman-bakery
├── Authentication
├── Cloud Firestore  
├── Realtime Database
├── Storage
├── Hosting
├── Functions
└── Extensions
```

---

## TASK 3: Link Cloud Project to Firebase

### Step 3.1: Get Project ID
1. In Firebase Console, click **Settings ⚙️** (gear icon top right)
2. Select **"Project Settings"**
3. Copy your **Project ID** (format: `cakesman-bakery`)
4. Keep this open

### Step 3.2: Link in Google Cloud
*If not auto-linked, do this:*
1. Go to: https://console.cloud.google.com
2. Select project `cakesman-bakery`
3. Go to **IAM & Admin** → **Settings**
4. Verify Project ID matches
5. Already linked! ✅

---

## TASK 4: Enable Required Google Cloud APIs

### Step 4.1: Open API Library
1. In Google Cloud Console
2. Search for **"APIs & Services"**
3. Select **"API Library"** (or click in search results)

### Step 4.2: Enable APIs
**Enable each API by searching and clicking "ENABLE":**

**API 1: Cloud Run API**
1. Search: `cloud run`
2. Click **Cloud Run API**
3. Click **"ENABLE"**
4. Wait for enabling (~1 min)

**API 2: Container Registry API**
1. Search: `container registry`
2. Click **Container Registry API**
3. Click **"ENABLE"**

**API 3: Cloud Build API**
1. Search: `cloud build`
2. Click **Cloud Build API**
3. Click **"ENABLE"**

**API 4: Artifact Registry API** (Optional, recommended)
1. Search: `artifact registry`
2. Click **Artifact Registry API**
3. Click **"ENABLE"**

### Step 4.3: Verify
Go to **"Enabled APIs & services"** to see all enabled APIs:
```
✅ Cloud Run API
✅ Container Registry API
✅ Cloud Build API
✅ Artifact Registry API
```

---

## TASK 5: Create MongoDB Atlas Account

### Step 5.1: Open MongoDB Atlas
1. Go to: https://www.mongodb.com/cloud/atlas
2. Click **"Sign Up"** or **"Try Free"**
3. Create account with email

### Step 5.2: Create Organization & Project
1. Create organization: `cakesman`
2. Create project: `cakesman-bakery`
3. Click **"Create Project"**

### Step 5.3: Create Cluster
1. Click **"Build your first database"**
2. Choose **"Create"** next to M0 (Free tier)
3. Select:
   - **Provider**: AWS or GCP (choose GCP for same region)
   - **Region**: us-central1 (close to Firebase)
   - Click **"Create Cluster"**
4. Wait for cluster creation (5-10 minutes)

### Step 5.4: Setup Network Access
1. In MongoDB Atlas sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Select **"Allow access from anywhere"** (0.0.0.0/0)
   - ⚠️ For production, use Cloud Run static IP
4. Click **"Confirm"**

### Step 5.5: Create Database User
1. Click **"Database Access"** in sidebar
2. Click **"Add New Database User"**
3. Fill in:
   - **Username**: `cakesman_user`
   - **Password**: [Generate secure password or create one]
   - **Role**: `Built-in Role` → `Atlas admin`
4. Click **"Add User"**
5. **SAVE THIS PASSWORD!** (You'll need it for connection string)

### Step 5.6: Get Connection String
1. Go to your cluster, click **"Connect"**
2. Select **"Drivers"**
3. Select **Language**: Node.js
4. Select **Version**: 4.x or higher
5. Copy the connection string:
   ```
   mongodb+srv://cakesman_user:<password>@cluster0.xxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace:
   - `<password>` with your actual password
   - `/?` with `/cakesman?`
   - Final: `mongodb+srv://cakesman_user:PASSWORD@cluster0.xxx.mongodb.net/cakesman?retryWrites=true&w=majority`
7. **SAVE THIS CONNECTION STRING!**

---

## TASK 6: Setup GCP Service Account (for deployment)

### Step 6.1: Create Service Account
1. In Google Cloud Console
2. Go to **IAM & Admin** → **Service Accounts**
3. Click **"Create Service Account"**
4. Fill in:
   - **Service account name**: `firebase-deploy`
   - **ID**: `firebase-deploy` (auto-filled)
5. Click **"Create and Continue"**

### Step 6.2: Grant Permissions
1. Add roles:
   - **Cloud Run Admin** (deploy Cloud Run services)
   - **Service Account User** (to use the account)
   - **Container Registry Service Agent** (for Docker)
2. Click **"Continue"** → **"Done"**

### Step 6.3: Create Key
1. Find your new service account in the list
2. Click on it
3. Go to **"Keys"** tab
4. **"Add Key"** → **"Create new key"**
5. Type: **JSON**
6. Click **"Create"**
7. Save the JSON file safely (contains secrets!)

```json
{
  "type": "service_account",
  "project_id": "cakesman-bakery",
  "private_key_id": "...",
  "private_key": "...",
  "client_email": "firebase-deploy@cakesman-bakery.iam.gserviceaccount.com",
  "client_id": "...",
  ...
}
```

### Step 6.4: Authenticate CLI
```powershell
# Set the service account key
$env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\service-account-key.json"

# Verify authentication
gcloud auth application-default print-access-token
```

---

## TASK 7: Configure Local Environment

### Step 7.1: Update Backend Environment
Edit `backend\.env.production`:
```env
PORT=5001
NODE_ENV=production
MONGO_URI=mongodb+srv://cakesman_user:YOUR_PASSWORD@cluster0.xxx.mongodb.net/cakesman?retryWrites=true&w=majority
JWT_SECRET=your_strong_secret_here
FRONTEND_URL=https://cakesman-bakery.web.app
CORS_ORIGIN=https://cakesman-bakery.web.app
```

**Generate JWT_SECRET**:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 7.2: Update Frontend Environment
Edit `frontend\.env.production`:
```env
REACT_APP_API_URL=https://YOUR_CLOUD_RUN_URL/api
```
*Note: You'll update this after Cloud Run deployment*

### Step 7.3: Verify Files Exist
```powershell
ls frontend\build\        # Should have built files
ls backend\Dockerfile     # Should exist
ls .firebaserc            # Should exist
ls firebase.json          # Should exist
```

---

## TASK 8: Install Required Tools

### Step 8.1: Firebase CLI
```powershell
# Install globally
npm install -g firebase-tools

# Verify
firebase --version
```

### Step 8.2: Google Cloud CLI
```powershell
# Install from: https://cloud.google.com/sdk/docs/install
# Or use Chocolatey:
choco install google-cloud-sdk

# Verify
gcloud --version
```

### Step 8.3: Docker Desktop
```powershell
# Install from: https://www.docker.com/products/docker-desktop
# Or use Chocolatey:
choco install docker-desktop

# Verify
docker --version
```

---

## TASK 9: Login & Initialize

### Step 9.1: GCloud Login
```powershell
gcloud init

# When prompted:
# 1. Choose your account
# 2. Select project: cakesman-bakery
# 3. Choose default region: us-central1
```

### Step 9.2: Firebase Login
```powershell
firebase login

# Opens browser, authorize with your Google account
```

### Step 9.3: Docker Login
```powershell
gcloud auth configure-docker gcr.io
```

---

## TASK 10: Pre-Deployment Checklist

```
✅ Google Cloud Project: cakesman-bakery
✅ Firebase Project: cakesman-bakery  
✅ APIs Enabled:
   ├─ Cloud Run
   ├─ Container Registry
   ├─ Cloud Build
   └─ Artifact Registry
✅ MongoDB Atlas:
   ├─ Cluster created (us-central1)
   ├─ Database user created
   ├─ Connection string obtained
   └─ Network access configured
✅ Environment Variables:
   ├─ backend/.env.production updated
   ├─ frontend/.env.production prepared
   └─ JWT_SECRET generated
✅ Local Files:
   ├─ frontend/build/ exists
   ├─ backend/Dockerfile exists
   ├─ firebase.json exists
   └─ .firebaserc exists
✅ Tools Installed:
   ├─ Node.js v16+
   ├─ Firebase CLI
   ├─ Google Cloud CLI
   ├─ Docker Desktop
   └─ Git
✅ Authentication:
   ├─ gcloud init ✓
   ├─ firebase login ✓
   └─ docker auth ✓
```

---

## READY TO DEPLOY! 🚀

You're all set! Now follow the deployment steps:

**Quick Path**:
```powershell
# Build frontend
cd frontend
npm run build
cd ..

# Run deployment script
.\deploy.ps1
```

**Manual Path**:
See [FIREBASE_CLOUD_RUN_DEPLOYMENT_GUIDE.md](./FIREBASE_CLOUD_RUN_DEPLOYMENT_GUIDE.md)

---

## 🆘 Stuck?

| Step | Problem | Solution |
|------|---------|----------|
| 1-2 | Can't create Firebase project | Ensure Google account is active |
| 4 | APIs not showing | Check Project ID is correct |
| 5 | MongoDB connection fails | Verify IP whitelist is 0.0.0.0/0 |
| 8 | Docker not starting | Restart Docker Desktop |
| 9 | Login fails | Check internet, try `gcloud auth login` |

---

**Next**: [FIREBASE_CLOUD_RUN_DEPLOYMENT_GUIDE.md](./FIREBASE_CLOUD_RUN_DEPLOYMENT_GUIDE.md)
