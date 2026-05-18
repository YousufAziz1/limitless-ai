"""
Limitless AI — FastAPI Backend
Offline AI School for Every Child
Powered by Gemma 4 via Ollama (+ Gemini Flash for math vision)
"""

import os
try:
    from dotenv import load_dotenv
    load_dotenv()  # loads GEMINI_API_KEY from .env
except ImportError:
    pass

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from routes.chat import router as chat_router
from routes.image import router as image_router
from routes.health import router as health_router

# ══════════════════════════════════════════
# App Initialization
# ══════════════════════════════════════════

app = FastAPI(
    title="Limitless AI Backend",
    description="Offline AI tutoring powered by Gemma 4 via Ollama",
    version="1.0.0",
)

# CORS — allow frontend dev server and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "*",  # Allow all for offline/local deployment
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register routes ────────────────────────
app.include_router(health_router, prefix="/api")
app.include_router(chat_router, prefix="/api")
app.include_router(image_router, prefix="/api")

# ── Root ──────────────────────────────────
@app.get("/")
async def root():
    return {
        "name": "Limitless AI",
        "tagline": "Offline AI School for Every Child",
        "model": "gemma4",
        "status": "running",
        "docs": "/docs",
    }


# ── Dev server entrypoint ─────────────────
import sys
if __name__ == "__main__":
    
    print("""
╔══════════════════════════════════════════╗
║       Limitless AI Backend Server        ║
║   Offline AI School for Every Child      ║
╚══════════════════════════════════════════╝

  Model: gemma4 (via Ollama)
  API:   http://localhost:8000
  Docs:  http://localhost:8000/docs
  
  Make sure Ollama is running:
    ollama serve
    ollama pull gemma4
""")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )
