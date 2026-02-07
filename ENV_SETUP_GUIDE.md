# Frontend Environment Variables Setup

## How to Set Up Environment Variables

### Option 1: Create `.env.local` file (Recommended for Development)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Create a new file named `.env.local`:
   ```bash
   touch .env.local
   ```

3. Add the following content:
   ```
   REACT_APP_API_URL=http://localhost:5001/api
   REACT_APP_SOCKET_URL=http://localhost:5001
   ```

4. Save the file

5. Restart the React development server:
   ```bash
   npm start
   ```

### Option 2: Create `.env` file (Production)

For production builds, use `.env` instead:
```
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_SOCKET_URL=https://your-api-domain.com
```

### Option 3: Set Environment Variables in Terminal

**Windows PowerShell:**
```powershell
$env:REACT_APP_API_URL="http://localhost:5001/api"
$env:REACT_APP_SOCKET_URL="http://localhost:5001"
npm start
```

**Mac/Linux Terminal:**
```bash
export REACT_APP_API_URL="http://localhost:5001/api"
export REACT_APP_SOCKET_URL="http://localhost:5001"
npm start
```

---

## What These Variables Do

| Variable | Purpose | Default |
|----------|---------|---------|
| `REACT_APP_API_URL` | Base URL for all API calls | `http://localhost:5001/api` |
| `REACT_APP_SOCKET_URL` | WebSocket URL for real-time updates | `http://localhost:5001` |

---

## Verification

After setting up environment variables:

1. Start the React development server:
   ```bash
   npm start
   ```

2. Open browser DevTools (F12)

3. Go to Console tab

4. Check for logs like:
   ```
   🔗 POST http://localhost:5001/api/auth/login {hasToken: false, hasData: true}
   ✓ 200 http://localhost:5001/api/auth/login ...
   ```

5. These logs confirm:
   - ✅ Frontend can reach backend
   - ✅ API calls are being made
   - ✅ Responses are received

---

## Troubleshooting

### "Cannot find module" or "API not found"

**Solution:** Check that:
1. `.env.local` file exists in `frontend/` directory (not root)
2. Restart React dev server after creating `.env.local`
3. Backend server is running on localhost:5001

### CORS Error: "No 'Access-Control-Allow-Origin'"

**Solution:** Ensure backend has CORS configured:
```javascript
// In backend/server.js
app.use(cors({
  origin: ["http://localhost:3000", process.env.FRONTEND_URL],
  credentials: true
}));
```

### "Network Error" when making API calls

**Solution:** Check that:
1. Backend is running: `node backend/server.js`
2. Frontend can reach backend port: `curl http://localhost:5001/api/health`
3. No firewall blocking the connection

---

## For Production Deployment

### Vercel (Frontend)

1. Go to Vercel project settings
2. Add environment variables:
   - `REACT_APP_API_URL` → Your production API URL
   - `REACT_APP_SOCKET_URL` → Your production Socket URL
3. Redeploy

### Heroku/Railway (Backend)

1. Set environment variables in hosting dashboard:
   - `MONGO_URI` → Your MongoDB connection string
   - `JWT_SECRET` → Your JWT secret
   - `NODE_ENV` → production
   - `FRONTEND_URL` → Your frontend domain
2. Deploy your backend

---

**Note:** Never commit `.env.local` or `.env` files to Git. They should be in `.gitignore`.
