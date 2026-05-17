"""
Pydantic schemas for Limitless AI API
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Literal


class ChatMessage(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=10000)
    history: Optional[List[ChatMessage]] = Field(default_factory=list)
    mode: Optional[Literal["explain", "exam", "revision", "weak"]] = "explain"
    language: Optional[Literal["en", "hi"]] = "en"
    subject: Optional[str] = None
    model_name: Optional[str] = "gemma3:4b"


class ModelStatusResponse(BaseModel):
    available: bool
    model_name: str
    status: Literal["running", "loading", "offline", "error"]
    version: Optional[str] = None
    ram: Optional[str] = None
    response_time: Optional[float] = None


class SubjectResponse(BaseModel):
    id: str
    name: str
    name_hi: str
    emoji: str
    color: str
    description: str
    description_hi: str
    topics: List[str]
