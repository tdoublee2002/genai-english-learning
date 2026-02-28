from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.routers.health import router as health_router
from .core.config import settings

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_PREFIX = "/api/v1"
app.include_router(health_router, prefix=API_PREFIX)
