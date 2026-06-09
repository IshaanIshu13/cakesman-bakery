# 🆘 Cakesman Bakery - Troubleshooting Guide

## Common Deployment Issues & Solutions

---

## 🔴 CORS & API Connection Issues

### Error: "Access to XMLHttpRequest blocked by CORS policy"

**Cause**: Frontend and backend CORS origins don't match

**Solution**:
1. Get your exact Cloud Run URL:
```powershell
gcloud run services describe cakesman-backend --region us-central1 --format='value(status.url)'
```

2. Update backend environment variable:
```powershell
gcloud run services update cakesman-backend --region us-central1 `
  --set-env-vars "FRONTEND_URL=https://cakesman-bakery.web.app" `
  --set-env-vars "CORS_ORIGIN=https://cakesman-bakery.web.app"
```

3. Redeploy backend or rebuild Docker image

4. Update `backend/server.js`:
```javascript
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.FRONTEND_URL || "https://cakesman-bakery.web.app",
  "https://cakesman-bakery.web.app",
  "https://cakesman-bakery.firebaseapp.com"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
```

---

## 🔴 MongoDB Connection Issues

### Error: "MongoServerError: connect ECONNREFUSED"

**Cause**: MongoDB Atlas connection string is wrong or network access is blocked

**Solution**:
1. Verify connection string format:
   ```
   mongodb+srv://username:password@cluster0.mongodb.net/cakesman?retryWrites=true&w=majority
   ```
   - No space after `@`
   - Database name is correct
   - Password is URL-encoded (special chars like `@` become `%40`)

2. Check MongoDB Atlas Network Access:
   - Go to https://cloud.mongodb.com
   - Select your cluster
   - Network Access → Add IP Address
   - Select "Allow access from anywhere" (0.0.0.0/0) for testing
   - For production, use Cloud Run IP whitelist

3. Verify database user exists:
   ```powershell
   # In MongoDB Atlas console:
   # Security → Network Access → Check "Allowed IPs" includes Cloud Run region
   ```

4. Test connection manually:
   ```powershell
   cd backend
   node -e "
     const mongoose = require('mongoose');
     mongoose.connect(process.env.MONGO_URI)
       .then(() => console.log('✅ Connected'))
       .catch(err => console.log('❌ Error:', err.message));
   "
   ```

### Error: "Timed out after 30000ms while checking the initial cluster state"

**Solution**:
1. Increase Cloud Run timeout:
```powershell
gcloud run services update cakesman-backend --region us-central1 --timeout 540
```

2. Add connection pooling to backend:
```javascript
// In server.js
mongoose.connect(process.env.MONGO_URI, {
  maxPoolSize: 10,
  minPoolSize: 5,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  connectTimeoutMS: 10000
});
```

---

## 🔴 Docker & Container Issues

### Error: "dockerfile not found"

**Solution**:
```powershell
cd backend
# Verify Dockerfile exists (no extension)
ls Dockerfile

# If missing, create it (see previous instructions)
# Then try again:
docker build -t gcr.io/cakesman-bakery/cakesman-backend .
```

### Error: "name unknown: reference format is invalid"

**Cause**: Docker image tag format is wrong

**Solution**:
```powershell
$PROJECT_ID = "cakesman-bakery"
$IMAGE = "gcr.io/${PROJECT_ID}/cakesman-backend"

# Verify format (should be: gcr.io/project-id/image-name)
docker build -t $IMAGE .
```

### Error: "Access denied when pushing to registry"

**Solution**:
```powershell
# Re-authenticate Docker
gcloud auth configure-docker gcr.io

# Verify authentication
gcloud auth list

# Then try pushing again
docker push gcr.io/cakesman-bakery/cakesman-backend
```

---

## 🔴 Cloud Run Errors

### Error: "Cloud Run: Container failed to start"

**Cause**: Express server not listening on correct port or crashing on startup

**Solution**:
1. Check server.js listens on PORT environment variable:
```javascript
const PORT = process.env.PORT || 5001;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
```

2. View Cloud Run logs:
```powershell
gcloud run logs read cakesman-backend --region us-central1 --limit 50 --follow
```

3. Check error message in logs and fix accordingly

### Error: "504 Gateway Timeout"

**Solution**:
1. Increase Cloud Run memory:
```powershell
gcloud run services update cakesman-backend --region us-central1 --memory 1Gi
```

2. Increase timeout:
```powershell
gcloud run services update cakesman-backend --region us-central1 --timeout 540
```

3. Check for infinite loops in code that freeze the app

### Error: "502 Bad Gateway"

**Cause**: Backend is down or not responding

**Solution**:
1. Check Cloud Run service status:
```powershell
gcloud run services describe cakesman-backend --region us-central1
```

2. View recent logs:
```powershell
gcloud run logs read cakesman-backend --region us-central1 --limit 100
```

3. Restart the service:
```powershell
gcloud run services update cakesman-backend --region us-central1
```

---

## 🔴 Frontend Issues

### Error: "Blank page or 404 on all routes"

**Cause**: Firebase rewrites not configured properly

**Solution**:
1. Check `firebase.json`:
```json
{
  "hosting": {
    "public": "frontend/build",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

2. Redeploy:
```powershell
firebase deploy --only hosting
```

### Error: "Cannot GET /api/..." from frontend

**Cause**: Frontend environment variable not set correctly

**Solution**:
1. Check `frontend/.env.production`:
```env
REACT_APP_API_URL=https://cakesman-backend-xxx.run.app/api
```

2. Verify URL is correct (no trailing slash, no `/api` at the end of base URL)

3. Rebuild frontend:
```powershell
cd frontend
REACT_APP_API_URL=https://your-cloud-run-url/api npm run build
```

4. Redeploy:
```powershell
firebase deploy --only hosting
```

---

## 🔴 Database Issues

### MongoDB Collections Not Created

**Solution**:
1. Manually create collections via MongoDB Atlas interface, OR
2. Run seed script locally:
```powershell
cd backend
node seed.js
```

3. Or trigger a product migration:
```powershell
node migrate-products.js
```

### Mongoose Model Errors

**Solution**:
1. Verify all models are imported in `server.js`
2. Ensure `.env` has correct `MONGO_URI`
3. Check model schema definitions in `models/` folder

---

## ✅ Verification Checklist

After fixing issues, verify everything works:

```powershell
# 1. Frontend loads
Start-Process "https://cakesman-bakery.web.app"

# 2. Backend API responds
Invoke-WebRequest "https://cakesman-backend-xxx.run.app/api/health" -Method GET

# 3. Check logs for errors
gcloud run logs read cakesman-backend --region us-central1 --limit 30

# 4. Test API endpoints from Chrome DevTools Console:
# fetch('https://backend-url/api/products')
#   .then(r => r.json())
#   .then(data => console.log(data))

# 5. Check browser console for errors (F12 → Console)
# Check Network tab to ensure API calls are going to correct URL
```

---

## 📞 Getting Help

1. **Check logs first**:
   ```powershell
   gcloud run logs read cakesman-backend --region us-central1 --follow
   ```

2. **Common search terms**:
   - Search error message in Google Cloud docs
   - Include "firebase" or "cloud run" in search

3. **Stack Overflow**: Tag with `firebase-hosting` `cloud-run` `mongodb`

4. **Official Docs**:
   - Cloud Run troubleshooting: https://cloud.google.com/run/docs/troubleshooting
   - Firebase Hosting: https://firebase.google.com/docs/hosting
   - MongoDB: https://docs.atlas.mongodb.com

---

## 🧪 Quick Debug Commands

```powershell
# View all environment variables in Cloud Run service
gcloud run services describe cakesman-backend --region us-central1 --format=yaml

# Update a single environment variable
gcloud run services update cakesman-backend --region us-central1 `
  --set-env-vars "ENVIRONMENT_VAR=value"

# View Docker image details
docker inspect gcr.io/cakesman-bakery/cakesman-backend

# SSH into Cloud Run (if enabled)
gcloud run services configure cakesman-backend --session
```

---

**Still stuck?** Verify:
- ✅ All environment variables are set
- ✅ Dockerfile exists and builds successfully
- ✅ MongoDB connection string is correct
- ✅ CORS origins match
- ✅ Firebase project ID is correct
- ✅ Google Cloud project is linked to Firebase
