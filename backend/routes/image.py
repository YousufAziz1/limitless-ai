"""
POST /api/chat-image — Multimodal image analysis
"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from typing import Optional
from services.image_service import stream_image_analysis

router = APIRouter(tags=["image"])

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


@router.post("/chat-image")
async def chat_image(
    file: UploadFile = File(...),
    prompt: str = Form(default="Please explain this image."),
    language: Optional[str] = Form(default="en"),
    model_name: Optional[str] = Form(default="gemma4"),
):
    """
    Analyze an image (textbook/homework) with Gemma 4 multimodal.
    Returns streaming explanation via SSE.
    """
    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="File must be an image (JPG, PNG, WEBP, etc.)"
        )

    # Read and validate file size
    image_data = await file.read()
    if len(image_data) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Image file too large. Maximum size is 10MB."
        )

    if not image_data:
        raise HTTPException(status_code=400, detail="Empty image file")

    return StreamingResponse(
        stream_image_analysis(
            image_data=image_data,
            prompt=prompt or "Please explain this image.",
            language=language or "en",
            model_name=model_name or "gemma4",
        ),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
