# 📐 Cakesman Architecture & Deployment Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USERS (Browser)                                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
            ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
            │   Desktop    │ │   Mobile     │ │   Tablet     │
            │   Browser    │ │   Browser    │ │   Browser    │
            └──────────────┘ └──────────────┘ └──────────────┘
                    │               │               │
                    └───────────────┼───────────────┘
                                    │
                    ┌───────────────▼───────────────┐
                    │  Firebase Hosting CDN         │
                    │  - Fast global distribution   │
                    │  - Automatic SSL/TLS          │
                    │  - Auto-scaling               │
                    │  https://cakesman-bakery.     │
                    │         web.app               │
                    └───────────────┬───────────────┘
                                    │
                        (HTTP/HTTPS API Calls)
                                    │
                    ┌───────────────▼───────────────┐
                    │  Google Cloud Run             │
                    │  - Express.js Server          │
                    │  - Docker Container           │
                    │  - Auto-scaling               │
                    │  - 2M free requests/month     │
                    │  https://cakesman-           │
                    │  backend-[id].run.app        │
                    │         /api                  │
                    └───────────────┬───────────────┘
                                    │
              (MongoDB Queries)     │      (Send Emails)
                    ┌───┬───────────┼────────┬───┐
                    │   │           │        │   │
                    ▼   ▼           ▼        ▼   ▼
                ┌──────────────┐ ┌──────────────────┐
                │   MongoDB    │ │  Email Service   │
                │   Atlas      │ │  (Optional)      │
                │              │ │                  │
                │ • Products   │ │ • Order updates  │
                │ • Users      │ │ • Confirmations  │
                │ • Orders     │ └──────────────────┘
                │ • Customers  │
                └──────────────┘
```

---

## Component Details

### 1. Frontend (React + Vite/CRA)
**Deployed on**: Firebase Hosting
```
📦 frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   ├── pages/           # Page components
│   ├── context/         # State management (Context API)
│   ├── utils/           # Helper functions
│   └── App.jsx          # Main app
└── build/ (after npm run build)
```

**Deployment**:
- Build: `npm run build` → outputs to `build/`
- Deploy: Firebase Hosting CDN

**Performance**:
- ✅ Global CDN
- ✅ Automatic caching
- ✅ Gzip compression
- ✅ Response <1s worldwide

---

### 2. Backend (Express.js + Node.js)
**Deployed on**: Google Cloud Run
```
📦 backend/
├── routes/              # API endpoints
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   ├── cartRoutes.js
│   └── customerRoutes.js
├── models/              # Mongoose schemas
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   └── Customer.js
├── controllers/         # Business logic
├── middleware/          # Auth, validation, etc.
├── config/              # Configuration
├── server.js            # Express app setup
├── Dockerfile           # Container image
└── package.json
```

**Deployment**:
- Build: `docker build -t image .`
- Push: `docker push gcr.io/project/image`
- Deploy: Cloud Run auto-scales from 0 to N

**Performance**:
- ✅ Container-based (fast startup)
- ✅ Auto-scaling (pay per request)
- ✅ Managed by Google
- ✅ 2M free requests/month

---

### 3. Database (MongoDB Atlas)
**Hosted on**: MongoDB's Cloud
```
Database: cakesman

Collections:
├── products
│   ├── _id
│   ├── name
│   ├── price
│   ├── category
│   └── image
│
├── users
│   ├── _id
│   ├── email
│   ├── password (hashed)
│   ├── name
│   └── role (admin/user)
│
├── orders
│   ├── _id
│   ├── customerId
│   ├── items[]
│   ├── total
│   ├── status
│   └── createdAt
│
└── customers
    ├── _id
    ├── name
    ├── email
    ├── phone
    └── address
```

**Deployment**:
- Managed MongoDB service
- Free tier: M0 (512MB)
- Automatic backups
- IP whitelist security

---

## Request Flow

### 1. User Views Homepage
```
Browser                    Firebase Hosting              User's Device
   │                             │                            │
   ├──────GET /────────────────>│                            │
   │                    Serves index.html                    │
   │<──────200 OK────────────────┤                            │
   │    + React App .js files    │                            │
   │                             │                            │
   └────────[React loads]────────────────────────────────────>
            [Page renders]
```

### 2. User Logs In
```
React App              Cloud Run API          MongoDB
   │                        │                    │
   ├──POST /api/auth────────>│                   │
   │       {email, pwd}      │                   │
   │                         ├──Query users.js──>│
   │                         │  Find by email    │
   │                         │<──Return user────┤
   │                         │  (verify pwd)     │
   │                         │  Generate JWT     │
   │<──200 + JWT Token───────┤                   │
   │                         │                   │
   ├──Save token to localStorage                │
```

### 3. User Browses Products
```
React App              Cloud Run API          MongoDB
   │                        │                    │
   ├──GET /api/products────>│                    │
   │                        ├──Query────────────>│
   │                        │  Find all products │
   │                        │<──Return products-┤
   │<──200 + [Products]─────┤                    │
   │                        │                    │
   ├──[Render products]─────────────────────────>
```

### 4. User Places Order
```
React App              Cloud Run API          MongoDB
   │                        │                    │
   ├──POST /api/orders──────>│                   │
   │  {items, total, addr}   │  Verify JWT       │
   │  Authorization header   │  Create order doc │
   │                         ├──Save────────────>│
   │                         │                   │
   │                         │<──Success / _id──┤
   │<──201 + Order Created───┤                   │
   │                         │                   │
   └──[Show confirmation]───────────────────────>
```

---

## Deployment Phases

### Phase 0: Local Development
```
Your Machine
├── Frontend: npm start (port 3000)
├── Backend: npm start (port 5001)
└── Database: mongod (local instance)
```

### Phase 1: Just Frontend Deployed
```
Firebase Hosting ← Your frontend builds
(URL: cakesman-bakery.web.app)

Backend still locally or on another server
Database still local or elsewhere
```

### Phase 2: Frontend + Backend Deployed
```
Firebase Hosting ← Frontend
     │
     └─→ Cloud Run ← Backend (Express in Docker)
           │
           └─→ MongoDB Atlas ← Database
```

### Phase 3: Full Production (Current)
```
                    ┌─→ Firebase Hosting
Google Cloud CDN ──┤
                    └─→ Cloud Run
                         │
                         └─→ MongoDB Atlas
                              (Replicated, Backed up)
```

---

## Scalability

### Frontend (Firebase Hosting)
- **Peak Traffic**: Handles millions daily
- **Regions**: Deployed globally
- **Scaling**: Unlimited (pay per GB served)
- **Response Time**: <100ms worldwide

### Backend (Cloud Run)
- **Concurrency**: Auto-scales 0→N
- **Per Request Cost**: $0.00002400/vCPU-second
- **Cold Start**: ~1-2 seconds first request
- **Timeout**: Configurable (up to 3600 seconds)
- **Instances**: 0-100 (configurable)

### Database (MongoDB)
- **Storage**: 512MB free, scale to TB+
- **Throughput**: Scales with tier
- **Free Tier**: M0 (good for <1K/day traffic)
- **Paid Tiers**: M2.5+ ($9+/month)

---

## Cost Breakdown

### Monthly Free Tier Estimate
```
Firebase Hosting
├── Storage: 10GB free (your app ~50MB)
├── Bandwidth: 360GB/month free
└── Cost: $0

Cloud Run
├── Requests: 2M free/month
├── vCPU seconds: 180,000 free
├── Memory GB-seconds: 360,000 free
└── Cost: $0 (unless you exceed)

MongoDB Atlas
├── Tier: M0 Free Shared
├── Storage: 512MB free
├── Backup: Automatic 7-day
└── Cost: $0

─────────────────
TOTAL: $0/month
```

### Scale-Up Cost Estimate (10K daily users)
```
Firebase Hosting
├── ~1GB/month bandwidth
└── Cost: $0.18

Cloud Run
├── ~500K requests/month
├── ~100K vCPU-seconds
└── Cost: ~$2.40

MongoDB Atlas
├── Upgrade to M2.5
└── Cost: $9

─────────────────
TOTAL: ~$11.50/month
```

---

## Security Architecture

```
┌─────────────────────────────────────┐
│         User's Browser              │
│  (HTTPS only, TLS 1.2+)             │
└────────────────┬────────────────────┘
                 │ HTTPS
                 ▼
┌─────────────────────────────────────┐
│      Firebase Hosting CDN           │
│  ├─ DDoS Protection                │
│  ├─ SSL/TLS Certificates            │
│  └─ WAF Rules                       │
└────────────────┬────────────────────┘
                 │ HTTPS
                 ▼
┌─────────────────────────────────────┐
│        Google Cloud Run             │
│  ├─ JWT Token Validation            │
│  ├─ Input Validation                │
│  ├─ Rate Limiting                   │
│  └─ VPC Network (isolated)          │
└────────────────┬────────────────────┘
                 │ TLS (internal)
                 ▼
┌─────────────────────────────────────┐
│      MongoDB Atlas                  │
│  ├─ IP Whitelist (0.0.0.0/0 testing)│
│  ├─ Authentication (username/pwd)   │
│  ├─ Encryption at rest              │
│  ├─ Encryption in transit           │
│  └─ Automatic backups               │
└─────────────────────────────────────┘
```

---

## Monitoring & Observability

### Frontend
```
Firebase Console
├── Performance metrics
├── Hosting traffic
├── Errors & issues
└── Analytics
```

### Backend
```
Cloud Run Dashboard
├── CPU/Memory usage
├── Request count
├── Error rates
├── Logs (real-time)
└── Trace requests
```

### Database
```
MongoDB Atlas Monitoring
├── Storage usage
├── Query performance
├── Connection count
├── Replication lag
└── Backup status
```

---

## Disaster Recovery

### Backup Strategy
- **Frontend**: Automatic (Firebase keeps 5 versions)
- **Backend**: Docker image in Container Registry
- **Database**: MongoDB automatic daily backups

### Recovery Time Objective (RTO)
- **Frontend**: <2 minutes (redeploy)
- **Backend**: <5 minutes (redeploy container)
- **Database**: <1 hour (restore from backup)

---

## Performance Optimization

### Frontend Optimization
- ✅ Code splitting
- ✅ Lazy loading routes
- ✅ Image compression
- ✅ Minification
- ✅ CSS-in-JS optimization

### Backend Optimization
- ✅ Database indexing
- ✅ Connection pooling
- ✅ Caching (Redis optional)
- ✅ Gzip compression
- ✅ Request timeout tuning

### Database Optimization
- ✅ Proper indexing
- ✅ Query optimization
- ✅ Pagination
- ✅ Aggregation pipeline
- ✅ Compound indexes

---

## Next Steps (After Deployment)

1. **Setup Monitoring**
   - Firebase Analytics
   - Cloud Run dashboards
   - MongoDB monitoring

2. **Performance Testing**
   - Load testing with artillery
   - Lighthouse for frontend
   - Database query analysis

3. **Scaling Triggers**
   - Set up auto-scaling policies
   - Configure alerts
   - Plan for peak usage

4. **Enhancement**
   - Add caching layer (Redis)
   - Implement CDN for images
   - Setup email notifications
   - Add payment processing

---

**Deployment Architecture Ready! Follow FIREBASE_CLOUD_RUN_DEPLOYMENT_GUIDE.md to get started.**
