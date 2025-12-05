# 🔐 DEPLOYMENT CREDENTIALS TEMPLATE

**KEEP THIS FILE SAFE AND SECURE!**
Store in a password manager (LastPass, 1Password, Bitwarden, etc.)

---

## GitHub

```
GitHub Username: _______________________
GitHub Email: _________________________
GitHub Password: ______________________
GitHub Token (for CLI): ________________

Repository URL: 
https://github.com/YOUR_USERNAME/cakesman-bakery

Repository Settings Link:
https://github.com/YOUR_USERNAME/cakesman-bakery/settings
```

---

## MongoDB Atlas

```
MongoDB Email: _________________________
MongoDB Password: ______________________

Project Name: Cakesman
Cluster Name: _________________________

Connection String:
mongodb+srv://username:password@cluster.mongodb.net/bakery?retryWrites=true&w=majority

Full Connection String (save this!):
_____________________________________________________________________________

MongoDB Dashboard:
https://cloud.mongodb.com/v2/YOUR_PROJECT_ID

Database User:
Username: ______________________________
Password: ______________________________
```

---

## Railway

```
Railway Email: __________________________
Railway Password: _______________________

Project Name: cakesman-bakery
Project URL: https://railway.app/project/YOUR_PROJECT_ID

Backend Service URL:
https://YOUR_BACKEND_NAME.railway.app

Environment Variables Set:
✅ MONGODB_URI: [Saved Above]
✅ JWT_SECRET: _____________________
✅ PORT: 5001

Railway Dashboard:
https://railway.app/dashboard
```

---

## Vercel

```
Vercel Email: ____________________________
Vercel Password: __________________________

Project Name: cakesman-bakery
Project URL: https://vercel.com/YOUR_USERNAME/cakesman-bakery

Live Website URL:
https://cakesman-bakery.vercel.app

Environment Variables Set:
✅ REACT_APP_API_URL: [Your Railway Backend URL]

Vercel Dashboard:
https://vercel.com/dashboard
```

---

## Production API Endpoints

```
Frontend URL: https://cakesman-bakery.vercel.app
Backend Base URL: https://YOUR_BACKEND_NAME.railway.app

API Endpoints:
- GET /api/products
- GET /api/orders
- GET /api/customers
- POST /api/auth/signup
- POST /api/auth/login

WebSocket URL: https://YOUR_BACKEND_NAME.railway.app
```

---

## Secret Keys & Tokens

```
JWT Secret: ________________________________
(Keep this SECRET - never share!)

MongoDB Admin Password: ____________________
(Store securely - for database backups)

GitHub Personal Access Token: ___________
(For automation - regenerate if leaked)
```

---

## Important URLs to Bookmark

```
GitHub Repository: 
https://github.com/YOUR_USERNAME/cakesman-bakery

GitHub Issues: 
https://github.com/YOUR_USERNAME/cakesman-bakery/issues

Vercel Dashboard: 
https://vercel.com/dashboard

Railway Dashboard: 
https://railway.app/dashboard

MongoDB Atlas: 
https://cloud.mongodb.com

Frontend Live Site: 
https://cakesman-bakery.vercel.app

Admin Dashboard: 
https://cakesman-bakery.vercel.app/admin
```

---

## Backup Plan

**Backup Checklist:**
- [ ] GitHub has full code history ✅
- [ ] MongoDB Atlas has automatic backups
- [ ] Railway has automatic deployments from GitHub
- [ ] Document all credentials above
- [ ] Keep credentials safe (password manager)
- [ ] Share only what team members need

**If Something Breaks:**
1. Check GitHub history (rollback if needed)
2. Check MongoDB backups
3. Check Railway logs
4. Check Vercel logs
5. Redeploy from GitHub

---

## Team Access (If Applicable)

Person with access:
```
Name: _______________________________
Email: _______________________________
Role: _______________________________
Access Level: 
  [ ] Full (all services)
  [ ] Limited (frontend only)
  [ ] Read-only (monitoring only)
```

---

## Renewal/Expiration Dates

```
GitHub: Never expires (keep username active)
MongoDB Free Tier: Never expires
Railway: Pay-as-you-go
Vercel: Never expires
Domain (if purchased): Expires ____________
SSL Certificate: Auto-renews ✅

Annual Review Date: ____________________
(Check all services still working)
```

---

## Emergency Contact

If something goes wrong:

1. **Check logs first:**
   - Vercel: https://vercel.com/dashboard
   - Railway: https://railway.app/dashboard
   - MongoDB: https://cloud.mongodb.com

2. **Common Issues:**
   - 502 Bad Gateway → Backend might be cold-starting
   - Cannot connect API → Check environment variables
   - Database error → Check MongoDB URI

3. **Get Help:**
   - Vercel Support: https://vercel.com/support
   - Railway Support: https://railway.app/support
   - MongoDB Support: https://mongodb.com/support

---

## Notes

```
Special notes about your deployment:
_____________________________________________________________________________

_____________________________________________________________________________

_____________________________________________________________________________
```

---

**Keep this document secure! 🔒**

Never share:
- MongoDB passwords
- JWT secrets
- API keys
- Database connection strings

Share only when necessary with your team members.
