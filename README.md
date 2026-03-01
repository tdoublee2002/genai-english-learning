# GenAI English Learning

Internal POC for English vocabulary practice with AI (frontend + backend).

## Project structure
- `frontend/` : Next.js (UI)
- `backend/` : FastAPI (API + DB)

## Local run (quick order)
1. Start backend first
2. Start frontend second

Detailed setup:
- Frontend: [`frontend/README.md`](frontend/README.md)
- Backend: [`backend/README.md`](backend/README.md)

## Run with Docker (optional)
From repo root:

```bash
docker compose up --build
```

- Frontend: `http://localhost:3000`
- Backend health: `http://localhost:8000/api/v1/health`
