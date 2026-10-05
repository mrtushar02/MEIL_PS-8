from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
import app.models  # Ensures all SQLAlchemy models are registered
from app.api.v1.api import api_router

# Database schema is migration-controlled via Alembic (alembic upgrade head)
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Enterprise ESG Data & SEBI BRSR Audit Engine for Megha Engineering & Infrastructures Limited (MEIL Group)",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/", tags=["Health"])
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "status": "OPERATIONAL",
        "documentation": "/docs",
        "compliance": "SEBI BRSR Circular 2021 & BRSR Core 2023/2025"
    }

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy", "database": "CONNECTED"}
