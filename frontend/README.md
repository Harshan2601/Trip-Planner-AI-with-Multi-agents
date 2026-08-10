# Waypoint — frontend for TripMate AI

Two-pane app: a single prompt box on the left, the generated report in a
sidebar on the right. No marketing sections, no pipeline/workflow diagram —
just input and output.

## Run both sides

**Backend** (TripMate AI repo root):
```bash
pip install -r requirements.txt
python app.py
```
Starts uvicorn on `http://127.0.0.1:8000`, exposing `POST /api/travel`.

**Frontend** (this folder):
```bash
npm install
npm run dev
```
Opens at `http://localhost:5173`. `/api/*` is proxied to `127.0.0.1:8000`
in dev (`vite.config.js`).

## Layout

- `src/components/PromptPanel.jsx` — the only input on the page: a
  textarea (dates/budget/origin all typed into the same prompt, no
  separate date field), a Generate button, and a few example prompts you
  can click to prefill. Cmd/Ctrl+Enter submits.
- `src/components/Sidebar.jsx` — the report panel. Three states: empty
  (nothing generated yet), loading (spinner while the backend runs), and
  the actual result — rendered `answer` text, collapsible raw
  flight/hotel/itinerary sections, and Copy / Download PDF actions.
- `src/App.jsx` — holds the request state (`prompt`, `status`, `result`,
  `threadId`) and does the `fetch('/api/travel', ...)` call; both panels
  are pure presentational components driven by that state.
- `src/components/Navbar.jsx` — minimal top bar, no nav links.

## The API contract

```
POST /api/travel
Body:     { "message": string, "thread_id": string | null }
Response: {
  success: boolean,
  thread_id: string,
  answer: string,
  flight_results: string,
  hotel_results: string,
  itinerary: string,
  llm_calls: number
}
```

## PDF export

Uses `html2pdf.js` (same approach as the original project's
`static/script.js`) to snapshot the report card and save it as
`ai-travel-plan.pdf`. It's dynamically imported, so it only loads when
someone actually clicks Download — it doesn't add to the initial page load.

## Deploying frontend and backend on separate origins

1. In `app.py`, add your deployed frontend's origin to `CORSMiddleware`'s
   `allow_origins`.
2. Replace the relative `fetch('/api/travel', ...)` in `App.jsx` with the
   backend's full URL (or read it from a `VITE_API_URL` env var).

## Notes

- Respects `prefers-reduced-motion`.
- Fonts: Fraunces (display), Inter (body), JetBrains Mono (data/labels).
- Sidebar stacks below the prompt panel on narrow/mobile widths.
