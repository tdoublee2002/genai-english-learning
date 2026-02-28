from fastapi import FastAPI

from .api.routers.health import router as health_router

app = FastAPI(title="genai-english-learning")

API_PREFIX = "/api/v1"
app.include_router(health_router, prefix=API_PREFIX)
