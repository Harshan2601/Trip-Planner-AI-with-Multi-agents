# Connecting TripMate AI to Render Cloud - Step-by-Step

## What You Have Now
✅ Backend running locally at `http://127.0.0.1:8000`
✅ Endpoints working: `/health`, `/api/travel`, `/docs`
✅ `render.yaml` configured in root directory
✅ Environment variables setup ready

## 🚀 Next Steps to Deploy to Render

### STEP 1: Commit All Changes to GitHub
```bash
cd "C:\Program Files\Trip planner\-Harshan2601-Trip-Planner-AI-with-Multi-agents-"

# Check git status
git status

# Add all changes
git add .

# Commit with message
git commit -m "Add Render deployment config: render.yaml, env variables, and CORS configuration"

# Push to GitHub
git push origin main
```

**What gets pushed:**
- `render.yaml` (tells Render how to build both services)
- `frontend/.env.production` (production API URL)
- Modified: `backend/app.py`, `backend/main.py`, `frontend/src/App.jsx`
- Updated: `.gitignore`

---

### STEP 2: Create Free Render Account
1. Go to **https://render.com**
2. Click **"Sign up"**
3. Choose **"Sign up with GitHub"**
4. Click **"Authorize Render"** (allows Render to access your GitHub repos)
5. Complete setup and verify email

---

### STEP 3: Deploy from GitHub
1. In Render dashboard, click **"New +"** (top right)
2. Select **"Web Service"**
3. Under "Connect a repository", search for your repo:
   - **`-Harshan2601-Trip-Planner-AI-with-Multi-agents-`**
4. Click **"Connect"**
5. Render will auto-detect `render.yaml`
6. It will show you the two services it's about to create:
   - `tripmate-backend` (Web Service)
   - `tripmate-frontend` (Static Site)

---

### STEP 4: Create PostgreSQL Database (Required)
The backend needs a database.

**Option A: Use Render's Managed PostgreSQL** (Recommended)
1. In Render dashboard, click **"New +"**
2. Select **"PostgreSQL"**
3. Configure:
   - Name: `tripmate-db`
   - Region: Same as backend (e.g., Oregon)
   - PostgreSQL Version: 15 (latest)
4. Click **"Create Database"**
5. Render generates a connection string like:
   ```
   postgresql://user:password@dpg-xxx.render.internal/database
   ```
6. Copy this URL

**Option B: Use External PostgreSQL** (if you have one)
- Any PostgreSQL 12+ database works
- Just get the connection string

---

### STEP 5: Set Environment Variables
After deploying, go to **Backend Service Settings**:

1. Click on **`tripmate-backend`** service
2. Go to **"Environment"** tab
3. Add these variables:

```
Key: GROQ_API_KEY
Value: sk_xxxxxxxxxxxx   ← Your Groq API key from console.groq.com
```

```
Key: DATABASE_URL
Value: postgresql://user:password@dpg-xxx.render.internal/database
       ↑ From your PostgreSQL database (Step 4)
```

```
Key: FRONTEND_ORIGIN
Value: https://tripmate-frontend.onrender.com
       ↑ Render will auto-assign this URL
```

4. Click **"Save"** - services will restart with new variables

---

### STEP 6: Update frontend/.env.production (IMPORTANT!)
Your frontend needs to know where the backend is:

**File:** `frontend/.env.production`
```
VITE_API_URL=https://tripmate-backend.onrender.com
```

**Where to get backend URL:**
1. Go to Render dashboard
2. Click on **`tripmate-backend`** service
3. Copy the URL shown at top (e.g., `https://tripmate-backend.onrender.com`)

---

### STEP 7: Push Updated Configuration
```bash
git add frontend/.env.production
git commit -m "Update Render backend URL in production config"
git push origin main
```

Render will **automatically rebuild both services** when you push!

---

## 🔄 What Happens During Deployment

```
┌─────────────────────────────────────────────────────────────┐
│                   YOU PUSH TO GITHUB                        │
│                                                             │
│  $ git push origin main                                    │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│             RENDER RECEIVES WEBHOOK                         │
│                                                             │
│  GitHub notifies Render: "New code available!"            │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│         RENDER CLONES YOUR CODE                            │
│                                                             │
│  $ git clone https://github.com/Harshan2601/...           │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│        RENDER READS render.yaml                            │
│                                                             │
│  Services defined:                                         │
│  - tripmate-backend (Docker)                              │
│  - tripmate-frontend (Static)                             │
└────────────────────┬────────────────────────────────────────┘
                     ↓
        ┌────────────┴────────────┐
        ↓                         ↓
┌───────────────────┐     ┌──────────────────┐
│  BACKEND BUILD    │     │ FRONTEND BUILD   │
│                   │     │                  │
│ 1. Read Dockerfile│     │1. npm install    │
│ 2. Build Docker   │     │2. npm run build  │
│    image          │     │3. Output to dist/│
│ 3. Start with env │     │4. Serve HTML/JS │
│    variables      │     │   (static files) │
│ 4. Expose :8000   │     │5. Expose :443    │
│    (HTTP)         │     │   (HTTPS)        │
└────────┬──────────┘     └────────┬─────────┘
         │                         │
         │      RUNNING            │
         │                         │
    ✅ LIVE               ✅ LIVE AT
    AT https://           https://
    tripmate-backend      tripmate-frontend
    .onrender.com         .onrender.com
    /api/travel           (serves built React app)
         ↑                         ↑
         └────────────┬───────────┘
                      │
              [FRONTEND CALLS BACKEND]
                      │
              [USER SEES RESULTS]
```

---

## 📊 Service Architecture After Deployment

```
┌──────────────────────────────────────────────────────────────┐
│                    RENDER.COM CLOUD                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ TRIPMATE-BACKEND (Web Service)                        │ │
│  │                                                        │ │
│  │ Python 3.11 + FastAPI                                │ │
│  │ Port: 8000                                           │ │
│  │ Environment Variables:                               │ │
│  │  - GROQ_API_KEY: sk_xxx...                          │ │
│  │  - DATABASE_URL: postgresql://...                   │ │
│  │  - FRONTEND_ORIGIN: https://tripmate-frontend...    │ │
│  │                                                        │ │
│  │ URL: https://tripmate-backend.onrender.com          │ │
│  │ Endpoints:                                           │ │
│  │  - GET  /health                                      │ │
│  │  - POST /api/travel                                  │ │
│  │  - GET  /docs (API documentation)                   │ │
│  └────────────────────────────────────────────────────────┘ │
│           ↓                                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ TRIPMATE-FRONTEND (Static Site)                      │ │
│  │                                                        │ │
│  │ React 18 (built from Vite)                           │ │
│  │ Served as Static Files (HTML/CSS/JS)                 │ │
│  │ Configured with:                                     │ │
│  │  - VITE_API_URL: https://tripmate-backend...         │ │
│  │                                                        │ │
│  │ URL: https://tripmate-frontend.onrender.com          │ │
│  │ Serves:                                              │ │
│  │  - index.html (React app)                           │ │
│  │  - app-xxxxxx.js (bundled React code)              │ │
│  │  - styles-xxxxxx.css (Tailwind CSS)                │ │
│  └────────────────────────────────────────────────────────┘ │
│           ↓                                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ TRIPMATE-DB (PostgreSQL Database)                    │ │
│  │                                                        │ │
│  │ Managed PostgreSQL 15                                │ │
│  │ Stores:                                              │ │
│  │  - User conversations                               │ │
│  │  - Trip planning data                               │ │
│  │  - API response history                             │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘

              ↓ ACCESSIBLE FROM INTERNET
              
        User's Browser
        https://tripmate-frontend.onrender.com
```

---

## 🧪 Testing After Deployment

### Test 1: Backend is Running
```
Visit: https://tripmate-backend.onrender.com
Expected: JSON response with "TripMate AI backend is running."
```

### Test 2: Frontend is Serving
```
Visit: https://tripmate-frontend.onrender.com
Expected: React app loads (Trip Planner UI visible)
```

### Test 3: Full Integration Test
1. Visit frontend URL
2. Enter a travel request (e.g., "Plan a trip to Paris")
3. Click submit
4. Check browser console (F12) for any errors
5. Should see results after ~10-30 seconds

---

## 🔐 Environment Variable Reference

### Backend (from render.yaml)
| Variable | From | Example |
|----------|------|---------|
| `GROQ_API_KEY` | Groq Console | `sk_live_xxx...` |
| `DATABASE_URL` | Render PostgreSQL | `postgresql://user:pwd@dpg-xxx` |
| `FRONTEND_ORIGIN` | Render Frontend URL | `https://tripmate-frontend.onrender.com` |

### Frontend (.env.production)
| Variable | Source | Example |
|----------|--------|---------|
| `VITE_API_URL` | Render Backend URL | `https://tripmate-backend.onrender.com` |

---

## 🆘 Troubleshooting

### "502 Bad Gateway" on Backend
- Check environment variables are set: GROQ_API_KEY, DATABASE_URL
- Check backend logs in Render dashboard
- Verify PostgreSQL database is created

### Frontend doesn't call API
- Check VITE_API_URL in .env.production
- Check browser console (F12) for error messages
- Verify FRONTEND_ORIGIN matches frontend URL in backend env vars

### "CORS error" in browser
- Backend's FRONTEND_ORIGIN must exactly match frontend URL
- Check Render dashboard → tripmate-backend → Environment
- Verify backend sees updated FRONTEND_ORIGIN

### Database connection fails
- Check DATABASE_URL is valid
- Verify PostgreSQL database is running in Render
- Check connection string has sslmode=require

### Changes don't deploy
- Push to `main` branch (not another branch)
- Check webhook is connected: Render Dashboard → Settings → Integrations
- Manually trigger: Dashboard → Service → "Manual Deploy"

---

## 📝 Summary: Local → Render Progression

```
CURRENT STATE (Local):
✅ Backend runs on http://127.0.0.1:8000
✅ Frontend runs on http://localhost:5173
✅ Vite proxy handles /api → backend
✅ Works with .env file (GROQ_API_KEY, DATABASE_URL)

AFTER RENDER DEPLOYMENT:
✅ Backend runs on https://tripmate-backend.onrender.com
✅ Frontend runs on https://tripmate-frontend.onrender.com
✅ Frontend uses VITE_API_URL to call backend
✅ Both have environment variables set in Render dashboard
✅ CORS configured with FRONTEND_ORIGIN
✅ Database managed by Render PostgreSQL
✅ Auto-redeploys on git push!
```

---

## ✨ Next Steps

1. **Commit & Push** your changes to GitHub
2. **Create Render Account** at render.com
3. **Create PostgreSQL** database in Render (free tier)
4. **Deploy** by selecting your GitHub repo
5. **Set Environment Variables** in Render dashboard
6. **Update frontend/.env.production** with backend URL
7. **Push again** to trigger rebuild
8. **Visit** https://tripmate-frontend.onrender.com
9. **Test** your app is working!

Good luck! 🚀
