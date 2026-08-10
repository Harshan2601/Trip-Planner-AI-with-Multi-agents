# ✈️ TripMate AI — Multi-Agent Travel Planner

**TripMate AI** is a full-stack AI-powered travel planning application that transforms a natural-language travel request into a structured, practical trip plan.

The application uses a **LangGraph multi-agent workflow** where specialized AI agents independently research flights, hotels, and itineraries before combining their results into a final travel report.

Built with **FastAPI, React, LangGraph, Groq Llama 3.3 70B, PostgreSQL, Docker, and external search tools**, the application is designed for production-style deployment using **Render and Netlify**.

---

## 🎯 Objective

Trip planning often requires switching between multiple platforms for flights, hotels, destinations, budgets, and daily activities.

TripMate AI simplifies this process by allowing users to provide a single natural-language request such as:

> "Plan a 10-day trip to Portugal from Berlin with a mid-range budget."

The system then coordinates multiple AI agents to research the trip and generate a consolidated plan containing:

* ✈️ Flight options
* 🏨 Hotel recommendations
* 🗓️ Day-by-day itinerary
* 💰 Estimated budget
* 💡 Travel recommendations

---

## ✨ Key Features

* **Natural-language trip planning** — No rigid forms; describe your trip in plain English.
* **Multi-agent AI architecture** — Specialized agents handle different planning tasks.
* **Flight research** — Searches for relevant flight routes and options.
* **Hotel research** — Uses web search to identify suitable accommodation.
* **AI itinerary generation** — Creates a structured day-by-day travel plan.
* **Budget-aware planning** — Considers the user's specified budget.
* **Conversational refinement** — Continue and refine previous plans using `thread_id`.
* **Persistent conversations** — LangGraph state is checkpointed in PostgreSQL.
* **REST API** — FastAPI backend exposes a clean travel-planning endpoint.
* **Production deployment** — Dockerized backend with separate frontend deployment.

---

## 🏗️ Architecture

```text
┌─────────────────────────┐
│     React + Vite        │
│   Frontend (Netlify)    │
└────────────┬────────────┘
             │ HTTPS / JSON
             ▼
┌─────────────────────────┐
│      FastAPI Backend    │
│      (Render + Docker)  │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│       LangGraph Agent Pipeline      │
│                                     │
│  Flight Agent                       │
│       ↓                             │
│  Hotel Agent                        │
│       ↓                             │
│  Itinerary Agent                    │
│       ↓                             │
│  Final Agent                        │
└────────────┬────────────────────────┘
             │
       ┌─────┼───────────────┐
       ▼     ▼               ▼
   Flight  Tavily          Groq
   Search  Search       Llama 3.3 70B
                         │
                         ▼
                 PostgreSQL
              LangGraph Checkpointer
```

### Technology Stack

| Layer               | Technology           |
| ------------------- | -------------------- |
| Frontend            | React + Vite         |
| Backend             | FastAPI              |
| AI Orchestration    | LangGraph            |
| LLM                 | Groq — Llama 3.3 70B |
| Web Search          | Tavily               |
| Flight Search       | Flight Search Tool   |
| Database            | PostgreSQL           |
| Containerization    | Docker               |
| Backend Deployment  | Render               |
| Frontend Deployment | Netlify              |

---

## 🤖 Multi-Agent Workflow

TripMate AI uses a sequential LangGraph workflow consisting of four specialized agents.

### 1. ✈️ Flight Agent

Searches for relevant flight options based on the user's origin, destination, dates, and travel requirements.

### 2. 🏨 Hotel Agent

Uses web search to identify hotel and accommodation options that match the destination and travel requirements.

### 3. 🗓️ Itinerary Agent

Uses the collected flight and hotel information to generate a practical day-by-day itinerary.

### 4. 📋 Final Agent

Combines all agent outputs into a structured final report containing:

* Trip summary
* Flight recommendations
* Hotel recommendations
* Daily itinerary
* Estimated budget
* Additional travel recommendations

---

## 🔄 Application Workflow

```text
User Travel Request
        │
        ▼
React Frontend
        │
        ▼
POST /api/travel
        │
        ▼
FastAPI Backend
        │
        ▼
LangGraph StateGraph
        │
        ├── Flight Agent
        │
        ├── Hotel Agent
        │
        ├── Itinerary Agent
        │
        └── Final Agent
        │
        ▼
PostgreSQL Checkpoint
        │
        ▼
Structured JSON Response
        │
        ▼
React Travel Report
```

Each request can include a `thread_id`, allowing the system to maintain conversation state and support follow-up requests.

---

## 📁 Project Structure

```text
TripMate-AI/
│
├── backend/
│   ├── app.py              # FastAPI application and API routes
│   └── main.py             # LangGraph agent workflow
│
├── tools/
│   ├── flight_tool.py      # Flight search integration
│   └── tavily_tool.py      # Tavily web search integration
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main frontend application
│   │   └── components/
│   │       ├── Navbar.jsx
│   │       ├── Sidebar.jsx
│   │       └── PromptPanel.jsx
│   │
│   └── vite.config.js      # Development proxy configuration
│
├── Dockerfile
├── render.yaml
├── netlify.toml
├── requirements.txt
└── README.md
```

---

## 🔌 API Reference

### `POST /api/travel`

Runs the complete multi-agent travel planning workflow.

#### Request

```json
{
  "message": "10 days in Portugal from Berlin, mid-range budget",
  "thread_id": null
}
```

#### Response

```json
{
  "success": true,
  "thread_id": "user_xxxxxxxx",
  "answer": "...",
  "flight_results": "...",
  "hotel_results": "...",
  "itinerary": "...",
  "llm_calls": 3
}
```

### `GET /health`

Returns the current backend health status.

### `GET /docs`

Provides the automatically generated **FastAPI Swagger UI** for API testing and documentation.

---

## 🚀 Deployment

TripMate AI uses a separated deployment architecture.

| Component | Platform          | Purpose                              |
| --------- | ----------------- | ------------------------------------ |
| Frontend  | Netlify           | React/Vite static application        |
| Backend   | Render            | Dockerized FastAPI service           |
| Database  | Render PostgreSQL | LangGraph conversation checkpointing |

### Backend

The backend is containerized using Docker and deployed as a web service on Render.

Required environment variables:

```env
GROQ_API_KEY=your_groq_api_key
DATABASE_URL=your_postgresql_connection_string
FRONTEND_ORIGIN=https://your-frontend-domain.netlify.app
```

### Frontend

The React application is built with Vite and deployed to Netlify.

```env
VITE_API_URL=https://your-backend-service.onrender.com
```

The `netlify.toml` configuration handles SPA routing.

---

## 🔐 Environment Variables

### Backend

| Variable          | Required    | Description                   |
| ----------------- | ----------- | ----------------------------- |
| `GROQ_API_KEY`    | ✅           | API key for Groq LLM          |
| `DATABASE_URL`    | ✅           | PostgreSQL connection string  |
| `FRONTEND_ORIGIN` | Recommended | Allowed frontend CORS origins |

### Frontend

| Variable       | Required    | Description            |
| -------------- | ----------- | ---------------------- |
| `VITE_API_URL` | Recommended | Production backend URL |

> **Security:** Never commit API keys, database credentials, or other secrets to the repository. Use environment variables provided by your deployment platform.

---

## 💻 Local Development

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd TripMate-AI
```

### 2. Install backend dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment variables

Create a `.env` file or configure the variables in your development environment:

```env
GROQ_API_KEY=your_api_key
DATABASE_URL=your_database_url
FRONTEND_ORIGIN=http://localhost:5173
```

### 4. Start the backend

```bash
uvicorn backend.app:app --reload
```

### 5. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

The Vite development server proxies `/api/*` requests to the local FastAPI backend.

---

## 🧠 Why Multi-Agent Architecture?

Instead of relying on a single LLM call, TripMate AI separates the planning process into specialized agents.

This approach provides:

* **Separation of responsibilities**
* **Better workflow control**
* **Tool-specific agent capabilities**
* **Persistent conversation state**
* **Easier debugging and extension**
* **A foundation for adding additional travel agents**

The architecture can be extended with agents for:

* 🚆 Train and public transport planning
* 🍽️ Restaurant recommendations
* 🎟️ Attractions and activities
* 🌦️ Weather-aware itinerary planning
* 💱 Currency conversion
* 🧳 Travel document and visa information
* 💰 Advanced budget optimization

---

## 🛠️ Future Improvements

* [ ] Real-time flight price tracking
* [ ] Hotel price comparison
* [ ] Interactive maps
* [ ] Weather-aware itinerary generation
* [ ] User authentication
* [ ] Saved trips and travel history
* [ ] PDF itinerary export
* [ ] More transportation options
* [ ] Advanced budget optimization
* [ ] Parallel agent execution for faster responses

---

## 📌 Project Highlights

TripMate AI demonstrates practical experience with:

* **Agentic AI**
* **LLM application development**
* **LangGraph orchestration**
* **Tool-using AI agents**
* **Retrieval and web search**
* **FastAPI REST APIs**
* **React frontend development**
* **PostgreSQL persistence**
* **Docker containerization**
* **Cloud deployment**
* **Stateful conversational AI**

---

## 📄 License

See the [`LICENSE`](./LICENSE) file for license information.

```

This version is intentionally written like a **public portfolio project README** rather than internal project documentation, so recruiters can quickly understand the architecture, AI concepts, tech stack, and deployment approach.
```
