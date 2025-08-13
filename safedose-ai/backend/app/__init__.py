"""
SafeDose.ai Backend Application
A FastAPI-based backend for misinformation detection and trusted messaging.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="SafeDose.ai API",
    description="AI-powered misinformation detection and trusted messaging platform",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and include routers
from app.api.endpoints import router as api_router
app.include_router(api_router, prefix="/api/v1")
