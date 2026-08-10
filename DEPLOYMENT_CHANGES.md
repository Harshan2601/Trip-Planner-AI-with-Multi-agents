# Trip Planner AI - Deployment Configuration Summary

## Changes Made

### 1. ✅ backend/app.py - CORS Configuration
**Changed:** CORS origins now read from `FRONTEND_ORIGIN` environment variable
- Uses `os.getenv("FRONTEND_ORIGIN", "")` 
- Supports comma-separated origins: `https://app1.com,https://app2.com`
- Falls back to localhost defaults (`http://localhost:5173`, `http://127.0.0.1:5173`) if unset
- Only adds extra origins if the variable is set (prevents empty strings in list)

**Environment Variable Format:**
```bash
# Single origin
FRONTEND_ORIGIN=https://myapp.render.com

# Multiple origins
FRONTEND_ORIGIN=https://myapp.render.com,https://myapp.vercel.app
```

### 2. ✅ backend/main.py - Environment Variable Verification
**Changed:** Refactored environment variable loading for better error handling
- Created `get_groq_api_key()` function that validates GROQ_API_KEY
- Raises clear error if either `GROQ_API_KEY` or `DATABASE_URL` are missing
- No hardcoded secrets - all secrets must come from environment variables
- Works seamlessly with `.env` files and Render environment variables

### 3. ✅ frontend/src/App.jsx - Dynamic API URL
**Changed:** Replaced hardcoded `/api/travel` with environment variable support
- Added: `const API_URL = import.meta.env.VITE_API_URL || ''`
- Fetch call now uses: `fetch(\`${API_URL}/api/travel\`, ...)`
- **Local development:** When VITE_API_URL is empty, Vite proxy (`/api → http://127.0.0.1:8000`) handles requests
- **Production:** VITE_API_URL points to Render backend, requests go directly to backend

### 4. ✅ frontend/.env.production - Production Environment
**Created:** Production environment configuration file
- Contains: `VITE_API_URL=https://<BACKEND-RENDER-URL>`
- Replace `<BACKEND-RENDER-URL>` with actual Render backend URL
- Added to `.gitignore` to prevent secrets being committed

### 5. ✅ .gitignore - Exclude Sensitive Files
**Changed:** Added `frontend/.env.production` to prevent committing production configuration

### 6. ✅ render.yaml - Render Deployment Configuration
**Created:** Root-level `render.yaml` for Render deployment with two services:

#### Backend Service (tripmate-backend)
```yaml
- type: web
- runtime: docker
- Uses root Dockerfile
- Environment variables with sync: false:
  - GROQ_API_KEY (required)
  - DATABASE_URL (required)
  - FRONTEND_ORIGIN (optional, for deployed frontend URLs)
```

#### Frontend Service (tripmate-frontend)
```yaml
- type: static
- buildCommand: cd frontend && npm install && npm run build
- staticPublishPath: frontend/dist
- VITE_API_URL automatically set to backend Render URL
```

## How It Works

### Local Development
1. Frontend runs on: `http://localhost:5173` (Vite dev server)
2. Backend runs on: `http://127.0.0.1:8000` (FastAPI)
3. Frontend has no VITE_API_URL set, so API_URL = ''
4. Vite proxy intercepts `/api/*` requests and routes to backend
5. **No changes needed** - everything works as before!

### Render Deployment
1. Create Render account and link this repository
2. Create `frontend/.env.production`:
   ```
   VITE_API_URL=https://tripmate-backend.onrender.com
   ```
3. Deploy via `render.yaml`:
   - Backend builds from Dockerfile
   - Backend sets env vars: GROQ_API_KEY, DATABASE_URL, FRONTEND_ORIGIN
   - Frontend builds and uses VITE_API_URL
   - Frontend knows backend URL and requests go directly

## Security

✅ **No hardcoded secrets**
- All API keys and database URLs come from environment variables
- Frontend doesn't expose backend URL in code (it's an env variable)
- .env.production is gitignored

✅ **CORS properly configured**
- Only allows requests from specified frontend origin
- Prevents unauthorized access from other domains

## Verification Checklist

- [x] Python syntax validated (app.py, main.py)
- [x] YAML structure looks valid (render.yaml)
- [x] All files created/modified correctly
- [x] Local development still works (Vite proxy fallback)
- [x] No hardcoded secrets
- [x] Environment variables properly documented

## Testing Local Development

```bash
# Start backend (in backend directory or root)
python -m backend.app
# or: uvicorn app:app --reload

# In separate terminal, start frontend
cd frontend && npm run dev

# Visit: http://localhost:5173
# API calls automatically proxy to http://127.0.0.1:8000/api
```

## Render Deployment Steps

1. Push code to GitHub
2. Create `frontend/.env.production` and set VITE_API_URL
3. Connect repository to Render
4. Render reads `render.yaml` and creates both services
5. Set required environment variables in Render dashboard:
   - GROQ_API_KEY
   - DATABASE_URL
   - FRONTEND_ORIGIN (e.g., https://tripmate-frontend.onrender.com)

## Configuration Variables

### Backend Environment Variables
- `GROQ_API_KEY` - Your Groq API key (required)
- `DATABASE_URL` - PostgreSQL connection string (required)
- `FRONTEND_ORIGIN` - Frontend URL for CORS (optional)

### Frontend Build Variables
- `VITE_API_URL` - Backend API URL (optional, defaults to local proxy)

## Notes

- Existing functionality preserved
- No breaking changes to API or frontend behavior
- Backward compatible with local development
- render.yaml can be customized further (regions, plans, etc.)
