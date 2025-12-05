# 🚀 DEPLOYMENT COMMANDS - Copy & Paste Ready

## WARNING: Replace YOUR_USERNAME with your actual GitHub username!

---

## STEP 1: Create GitHub Repository
1. Go to: https://github.com/new
2. Fill in:
   - Repository name: `Cakesman-Bakery`
   - Description: `A full-stack MERN bakery e-commerce website`
   - Visibility: `Public`
3. Click "Create repository"
4. Copy the HTTPS URL shown (looks like): 
   ```
   https://github.com/YOUR_USERNAME/Cakesman-Bakery.git
   ```

---

## STEP 2: Push Code to GitHub

Run these commands in PowerShell (in `d:\Cakesman-Bakery`):

```powershell
# Navigate to project
cd d:\Cakesman-Bakery

# Configure Git (one-time only)
git config --global user.name "Your Full Name"
git config --global user.email "your.email@gmail.com"

# Add GitHub as remote repository
git remote add origin https://github.com/YOUR_USERNAME/Cakesman-Bakery.git

# Rename branch to main
git branch -M main

# Push code to GitHub
git push -u origin main
```

### Expected Output:
```
Enumerating objects: XX, done.
Counting objects: 100% (XX/XX), done.
...
To https://github.com/YOUR_USERNAME/Cakesman-Bakery.git
 * [new branch]      main -> main
```

✅ Your code is now on GitHub!

---

## STEP 3: Deploy Backend to Railway

### 3.1 Create Railway Account
- Go to: https://railway.app
- Sign up with GitHub (recommended)

### 3.2 Create Railway Project for Backend
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose `Cakesman-Bakery` repository
- Set service root directory: `backend`

### 3.3 Add Environment Variables
In Railway Project > Variables, add:

```
PORT=5001
MONGO_URI=mongodb://localhost:27017/cakesman
JWT_SECRET=cakesman_secret_key_2025
NODE_ENV=production
```

### 3.4 Get Your Backend URL
- After deployment, Railway shows URL like:
  ```
  https://cakesman-bakery-backend-production.railway.app
  ```
- Copy this URL (you'll need it next)

---

## STEP 4: Setup MongoDB Atlas (Production Database)

### 4.1 Create MongoDB Account
- Go to: https://www.mongodb.com/cloud/atlas
- Click "Start Free"
- Sign up with email or GitHub

### 4.2 Create Cluster
- On Dashboard, click "Create a Cluster"
- Select "Free Tier M0"
- Choose your closest region
- Click "Create Cluster"

### 4.3 Create Database User
- Go to "Database Access"
- Click "Add New Database User"
- Username: `admin` (or any username)
- Password: Generate secure password
- Click "Add User"

### 4.4 Add IP to Whitelist
- Go to "Network Access"
- Click "Add IP Address"
- Select "Allow from anywhere" (0.0.0.0/0)
- Confirm

### 4.5 Get Connection String
- Go to Databases
- Click "Connect" on your cluster
- Select "Drivers"
- Copy the connection string (looks like):
  ```
  mongodb+srv://admin:PASSWORD@cluster.mongodb.net/cakesman?retryWrites=true&w=majority
  ```
- Replace `PASSWORD` with your database user password
- Add `/cakesman` to end (database name)

### 4.6 Update Railway Environment Variable
- In Railway Project > Variables
- Update `MONGO_URI` with the MongoDB Atlas connection string

---

## STEP 5: Deploy Frontend to Vercel

### 5.1 Create Vercel Account
- Go to: https://vercel.com
- Click "Sign Up"
- Choose "GitHub" option
- Authorize and complete signup

### 5.2 Deploy Frontend
- In Vercel Dashboard: "Add New" > "Project"
- Select your `Cakesman-Bakery` repository
- Framework: Select "React"
- Root Directory: Select `frontend`
- Click "Deploy"

### 5.3 Add Environment Variables
- Go to Project Settings > Environment Variables
- Add:
  ```
  Name: REACT_APP_API_BASE_URL
  Value: https://your-railway-backend-url/api
  ```
  (Replace with your actual Railway URL from Step 3.4)
- Save

### 5.4 Redeploy
- Click "Deployments" > Latest deployment > "Redeploy"

### 5.5 Get Your Frontend URL
- After deployment, Vercel shows URL like:
  ```
  https://cakesman-bakery.vercel.app
  ```

---

## STEP 6: Verify Deployment

### Test Frontend
1. Open: https://your-vercel-url.vercel.app
2. Should see homepage with products
3. Try adding items to cart
4. Try logging in with: admin@cakesman.com / admin123

### Test Admin Dashboard
1. Open: https://your-vercel-url.vercel.app/admin
2. Login with admin credentials
3. Try adding a new product

### Test Backend API
```powershell
# In PowerShell, run:
$response = Invoke-WebRequest -Uri "https://your-railway-url/api/products" -Method GET
$response.Content | ConvertFrom-Json | Select-Object -First 1
```

Should return product data.

---

## TROUBLESHOOTING

### Products Not Loading
- Check if MongoDB connection is working
- Verify MONGO_URI in Railway environment variables
- Check Railway logs for errors

### Login Not Working
- Make sure backend API URL is correct in Vercel env vars
- Check browser console for CORS errors
- Verify JWT_SECRET matches between frontend and backend

### CORS Errors
Update `backend/server.js` CORS settings:

```javascript
app.use(cors({
  origin: ["https://your-vercel-url.vercel.app", "http://localhost:3000"],
  credentials: true
}));
```

Then redeploy backend.

---

## AFTER DEPLOYMENT

### Making Updates

When you want to update the site:

```powershell
# Make changes locally
# ...edit files...

# Commit and push
cd d:\Cakesman-Bakery
git add .
git commit -m "Your change description"
git push origin main
```

Both Vercel and Railway will automatically redeploy! 🚀

### Manage Products
- Visit: https://your-vercel-url.vercel.app/admin
- Login and add/edit/delete products
- Changes appear immediately

### View Logs
- **Vercel Logs**: In Project > Deployments > Logs
- **Railway Logs**: In Project > Logs

---

## COMMAND QUICK REFERENCE

```powershell
# Check git status
git status

# View commits
git log --oneline

# Add changes
git add .

# Commit
git commit -m "message"

# Push
git push origin main

# Check remote
git remote -v
```

---

## FINAL CHECKLIST

- [ ] GitHub account created
- [ ] Repository created on GitHub
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Railway account created
- [ ] MongoDB Atlas account created
- [ ] MongoDB cluster created
- [ ] Database user created
- [ ] IP whitelisted in MongoDB
- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] Login works on admin dashboard
- [ ] Products display on frontend
- [ ] Cart functionality works
- [ ] Site is live and accessible!

---

**You're done! Your website is now live on the internet!** 🎉

Share the link: https://your-vercel-url.vercel.app
