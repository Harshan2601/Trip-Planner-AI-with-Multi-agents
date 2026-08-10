# Build and run from the PROJECT ROOT, e.g.:
#   docker build -t trip-planner-backend .
#   docker run -p 8000:8000 --env-file .env trip-planner-backend

FROM python:3.11-slim

WORKDIR /app

# Install system deps needed by psycopg / certifi at build time
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python deps first (better layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download the nltk stopwords corpus used by tools/flight_tool.py
RUN python -m nltk.downloader stopwords

# Now copy the actual application code
COPY backend/ ./backend/
COPY tools/ ./tools/

EXPOSE 8000

# Run as a module so `from backend.main import ...` resolves correctly.
# Shell form (not exec-array form) is required here so $PORT gets expanded -
# Render injects PORT at runtime and expects the app to bind to it.
# Falls back to 8000 for local `docker run` without --env PORT set.
CMD uvicorn backend.app:app --host 0.0.0.0 --port ${PORT:-8000}
