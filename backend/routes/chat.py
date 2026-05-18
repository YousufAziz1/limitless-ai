"""
POST /api/chat — Streaming text chat with Gemma 4
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from models.schemas import ChatRequest
from services.ollama_service import stream_chat_response

router = APIRouter(tags=["chat"])


@router.post("/chat")
async def chat(request: ChatRequest):
    """
    Stream AI tutor response via Server-Sent Events.
    Supports multiple modes: explain, exam, revision, weak.
    Bilingual: Hindi and English.
    """
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    return StreamingResponse(
        stream_chat_response(
            message=request.message,
            history=request.history or [],
            mode=request.mode or "explain",
            language=request.language or "en",
            subject=request.subject,
            model_name=request.model_name or "gemma4",
        ),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
