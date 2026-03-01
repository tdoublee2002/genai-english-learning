# Backend

FastAPI API for vocabulary and quiz features.

## Prerequisites
- Python 3.13+
- [uv](https://docs.astral.sh/uv/)
- PostgreSQL (or a Supabase/Postgres URL)

## Environment
Create `backend/.env` with:

```env
APP_NAME=genai-english-learning
ENV=dev
CORS_ORIGINS=http://localhost:3000,http://localhost:8000

DATABASE_URL=postgresql+psycopg://<user>:<password>@<host>:5432/<db>

OPENAI_API_KEY=<your_openai_api_key>
LLM_MODEL=gpt-4o-mini
LLM_TIMEOUT_S=60
```

## Run Local
1. Go to the backend folder
```bash
cd backend
```

2. Install dependencies
```bash
uv sync --locked
```

3. Start API (reload mode)
```bash
uv run uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

Health check: `http://localhost:8000/api/v1/health`
