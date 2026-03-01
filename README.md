# genai-english-learning

Internal POC for GenAI English vocabulary practice.

## Project structure
- `backend/` FastAPI service.
- `frontend/` Next.js App Router UI.

## Run with Docker Compose
From the repository root:

```bash
docker compose up --build
```

Services:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

> Notes:
> - Compose uses SQLite for backend persistence via a named volume.
> - `OPENAI_API_KEY` is set to a placeholder (`dummy`) for local startup; set a real key if you need LLM-backed exercise generation.

## Frontend
See [`frontend/README.md`](frontend/README.md) for setup and run instructions.

## Backend
See [`backend/README.md`](backend/README.md) for setup instructions.
