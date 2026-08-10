import os
import traceback

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from backend.main import run_travel_agent

app = FastAPI(
    title="TripMate AI",
    description="LangGraph Multi-Agent Travel Planner — API for the React frontend",
    version="1.0.0",
)

# The React (Vite) frontend runs on its own dev server/origin. The Vite dev
# proxy avoids needing this in local dev, but CORS is required as soon as
# the frontend is deployed on a different origin than this API (e.g.
# Vercel/Netlify frontend + Render/Fly backend).
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Add your deployed frontend origin(s) via env var (singular or plural), comma-separated, e.g.:
#   FRONTEND_ORIGIN=https://waypoint-frontend.vercel.app,https://mytrip.app
#   or
#   FRONTEND_ORIGINS=https://waypoint-frontend.vercel.app,https://mytrip.app
_frontend_origin = os.getenv("FRONTEND_ORIGIN", "")
_frontend_origins = os.getenv("FRONTEND_ORIGINS", "")
combined = ",".join([s for s in (_frontend_origin, _frontend_origins) if s])
parsed = []
for o in combined.split(","):
    o = o.strip()
    if not o:
        continue
    # Normalize: remove trailing slash
    o = o.rstrip('/')
    parsed.append(o)

# Also add common www variants to be forgiving for user input
normalized = set(parsed)
for o in list(parsed):
    if o.startswith('https://') and not o.startswith('https://www.'):
        normalized.add(o.replace('https://', 'https://www.'))
    if o.startswith('http://') and not o.startswith('http://www.'):
        normalized.add(o.replace('http://', 'http://www.'))

if normalized:
    ALLOWED_ORIGINS += sorted(normalized)

# Debug: print allowed origins at startup to help diagnose CORS issues in logs
print('ALLOWED_ORIGINS =', ALLOWED_ORIGINS)

# TEMPORARY: permissive CORS for debugging (allows all origins). Remove or restrict before production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    # This backend only exposes a JSON API (see /health and /api/travel).
    # Hitting this bare URL previously returned FastAPI's default
    # {"detail": "Not Found"} because no root route existed.
    return {
        "message": "TripMate AI backend is running.",
        "endpoints": ["/health", "/api/travel (POST)"],
        "docs": "/docs",
    }


class TravelRequest(BaseModel):
    message: str
    thread_id: str | None = None


@app.post("/api/travel")
async def travel_planner(request_data: TravelRequest):
    try:
        user_message = request_data.message.strip()

        if not user_message:
            return JSONResponse(
                status_code=400,
                content={
                    "success": False,
                    "error": "Message cannot be empty.",
                },
            )

        result = run_travel_agent(
            user_input=user_message,
            thread_id=request_data.thread_id,
        )

        return JSONResponse(
            content={
                "success": True,
                "thread_id": result["thread_id"],
                "answer": result["answer"],
                "flight_results": result["flight_results"],
                "hotel_results": result["hotel_results"],
                "itinerary": result["itinerary"],
                "llm_calls": result["llm_calls"],
            }
        )

    except Exception as e:
        print("ERROR:", e)
        traceback.print_exc()

        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": str(e),
            },
        )


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "message": "AI Travel Planner API is running",
    }


if __name__ == "__main__":
    uvicorn.run(
        "backend.app:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
    )
