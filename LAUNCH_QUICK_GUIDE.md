# 🎯 LAUNCH GUIDE - START HERE!

**Status:** ✅ Ready to Launch  
**Time Needed:** 5-10 minutes  
**Difficulty:** Very Easy

---

## ⚡ Ultra-Quick Start (2 minutes)

### Terminal 1 - Backend
```powershell
cd d:\Cakesman-Bakery\backend
npm start
```

### Terminal 2 - Frontend (wait 3 seconds, then)
```powershell
cd d:\Cakesman-Bakery\frontend
npm start
```

**Done!** Browser will open to http://localhost:3000

---

## 🔐 Login to Test

### Admin Account
- **Email:** admin@cakesman.com
- **Password:** admin123
- **Click:** Login

### Customer Test
- **Email:** demo@test.com  
- **Password:** demo123
- **Click:** Login

**Or** create new account via Sign Up

---

## 📊 What You'll See

**Backend Terminal:**
```
[HH:MM:SS] 📨 Server running on port 5001
[HH:MM:SS] 📨 POST /api/auth/login [Auth]
[HH:MM:SS] ✓ POST /api/auth/login → 200
```

**Frontend:**
- Opens automatically at http://localhost:3000
- Shows login/signup page
- Admin can click "Admin" tab to access dashboard

**Browser Console (F12):**
```
🔗 POST http://localhost:5001/api/auth/login
✓ 200 http://localhost:5001/api/auth/login → {user: {...}}
```

---

## ✅ Verification Checklist

After startup, verify:
- [ ] Backend terminal shows "Server running on port 5001"
- [ ] Frontend opens in browser
- [ ] Can access http://localhost:3000
- [ ] Can see login page
- [ ] Admin login works
- [ ] Console shows API logs (F12)

---

## 🎯 Environment Variables (Already Set!)

**Frontend:** `frontend/.env.local`
```
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_SOCKET_URL=http://localhost:5001
```

**Backend:** `backend/.env`
```
PORT=5001
MONGO_URI=mongodb+srv://...
JWT_SECRET=ishaan@132
NODE_ENV=production
```

✅ **No additional setup needed!**

---

## 🐛 Troubleshooting

### Port 3000 Already in Use
```powershell
$env:PORT=3001
npm start
```

### Port 5001 Already in Use
Edit `backend/.env` and change `PORT=5002`

### npm ERR! during install
```powershell
npm install --legacy-peer-deps
```

### Backend won't connect
- Check internet connection
- MongoDB Atlas might be offline (app uses mock data)
- Check backend terminal for errors

---

## 📖 Full Documentation

For more detailed guides, see:
- **[COMPLETE_QUICK_START.md](COMPLETE_QUICK_START.md)** - Detailed startup
- **[PRE_LAUNCH_CHECKLIST.md](PRE_LAUNCH_CHECKLIST.md)** - Complete verification
- **[ENV_SETUP_GUIDE.md](ENV_SETUP_GUIDE.md)** - Environment help
- **[DOCUMENTATION_QUICK_INDEX.md](DOCUMENTATION_QUICK_INDEX.md)** - All docs

---

## 🎉 You're Ready!

Everything is configured. Just run the commands above and you're good to go!

**Questions?** See the guides above or check the troubleshooting section.

---

**Next Step:** Copy the commands above and run them. That's it! 🚀
