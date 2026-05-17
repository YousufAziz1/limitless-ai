"""
Ollama Service — Limitless AI
Handles all Gemma 4 interactions with streaming
"""

import ollama
import json
from typing import AsyncGenerator, Optional, List
from models.schemas import ChatMessage

# ── System prompt builder ─────────────────────────────────────

MODE_INSTRUCTIONS = {
    "explain": "Explain concepts clearly with simple language, step-by-step breakdowns, and real-world examples. Use analogies that rural Indian students can relate to.",
    "exam": "Help the student prepare for exams. Ask practice questions, quiz them, provide model answers, and highlight important points likely to appear in CBSE/State board exams.",
    "revision": "Give concise, structured revision notes with key points, formulas, and mnemonics. Format as bullet points and short summaries.",
    "weak": "The student needs extra support. Break down every concept into the simplest possible steps. Be very patient, use very simple words, repeat important points, and be very encouraging.",
}

MODE_INSTRUCTIONS_HI = {
    "explain": "अवधारणाओं को सरल भाषा में, चरण-दर-चरण, और वास्तविक उदाहरणों के साथ समझाएं। ऐसे उपमा उपयोग करें जो ग्रामीण भारतीय छात्र समझ सकें।",
    "exam": "परीक्षा की तैयारी में मदद करें। अभ्यास प्रश्न पूछें, मॉडल उत्तर दें, और CBSE/राज्य बोर्ड परीक्षाओं के महत्वपूर्ण बिंदु बताएं।",
    "revision": "संक्षिप्त, संरचित पुनरीक्षण नोट्स दें। बुलेट पॉइंट और सारांश में महत्वपूर्ण बिंदु और सूत्र लिखें।",
    "weak": "छात्र को अतिरिक्त सहायता चाहिए। हर अवधारणा को बहुत सरल चरणों में तोड़ें। बहुत धैर्य रखें, बहुत सरल शब्द उपयोग करें, और प्रोत्साहन देते रहें।",
}


def build_system_prompt(
    mode: str = "explain",
    language: str = "en",
    subject: Optional[str] = None,
) -> str:
    mode_instruction = (
        MODE_INSTRUCTIONS_HI.get(mode, MODE_INSTRUCTIONS_HI["explain"])
        if language == "hi"
        else MODE_INSTRUCTIONS.get(mode, MODE_INSTRUCTIONS["explain"])
    )

    subject_context = f" You are currently teaching: {subject}." if subject else ""

    if language == "hi":
        return f"""आप Limitless AI हैं — ग्रामीण भारत के छात्रों के लिए एक दयालु, बुद्धिमान AI शिक्षक।{subject_context}

आपके बारे में:
- आप Gemma 4 द्वारा संचालित हैं और पूरी तरह से ऑफलाइन काम करते हैं
- आप कक्षा 8-12 के छात्रों की मदद करते हैं
- आप हिंदी और अंग्रेजी दोनों में बात कर सकते हैं
- आप हमेशा प्रोत्साहक और गर्मजोशी भरे हैं

{mode_instruction}

महत्वपूर्ण:
- उत्तर स्पष्ट और संरचित रखें
- जहाँ जरूरी हो markdown का उपयोग करें
- गणित के लिए चरण-दर-चरण दिखाएं
- हमेशा प्रोत्साहक रहें"""
    
    return f"""You are Limitless AI — a warm, encouraging, and brilliant AI teacher for rural Indian students.{subject_context}

About you:
- You are powered by Gemma 4 and work completely offline
- You help Class 8-12 students across India
- You understand both Hindi and English
- You are always supportive, patient, and inspiring
- You relate examples to Indian rural life when possible

Current teaching mode: {mode_instruction}

Guidelines:
- Keep responses clear and well-structured
- Use markdown formatting (headers, bullets, bold) for clarity
- Show step-by-step working for math problems
- Always end with encouragement when appropriate
- Be warm and human — never cold or robotic
- If asked in Hindi, respond in Hindi. If in English, respond in English."""


# ── Ollama streaming generator ────────────────────────────────

async def stream_chat_response(
    message: str,
    history: List[ChatMessage],
    mode: str = "explain",
    language: str = "en",
    subject: Optional[str] = None,
    model_name: str = "gemma4:e4b",
) -> AsyncGenerator[str, None]:
    """Stream chat tokens from Ollama Gemma model."""

    system_prompt = build_system_prompt(mode, language, subject)

    # Build messages list
    messages: List[dict] = [{"role": "system", "content": system_prompt}]
    
    # Add history (last 10 messages to stay within context)
    for msg in history[-10:]:
        messages.append({"role": msg.role, "content": msg.content})
    
    # Add current message
    messages.append({"role": "user", "content": message})

    try:
        client = ollama.AsyncClient()
        stream = await client.chat(
            model=model_name,
            messages=messages,
            stream=True,
            options={
                "temperature": 0.7,
                "top_p": 0.9,
                "num_predict": 2048,
            },
        )

        async for chunk in stream:
            if chunk.get("message", {}).get("content"):
                token = chunk["message"]["content"]
                # SSE format: data: {"token": "..."}
                yield f"data: {json.dumps({'token': token})}\n\n"

        yield "data: [DONE]\n\n"

    except ollama.ResponseError as e:
        error_msg = (
            f"❌ Model error: {str(e)}\n\nPlease ensure:\n1. Ollama is running (`ollama serve`)\n2. Gemma model is pulled (`ollama pull {model_name}`)"
        )
        yield f"data: {json.dumps({'token': error_msg})}\n\n"
        yield "data: [DONE]\n\n"

    except Exception as e:
        error_msg = f"❌ Connection error: {str(e)}\n\nMake sure Ollama is running on port 11434."
        yield f"data: {json.dumps({'token': error_msg})}\n\n"
        yield "data: [DONE]\n\n"


# ── Health check ──────────────────────────────────────────────

async def check_ollama_health(model_name: str = "gemma4:e4b") -> dict:
    """Check if Ollama and the specified model are available."""
    import time
    
    start = time.time()
    try:
        client = ollama.AsyncClient()
        models = await client.list()
        model_list = [m.get("name", m.get("model", "")) for m in models.get("models", [])]
        
        model_available = any(model_name in m for m in model_list)
        elapsed = (time.time() - start) * 1000

        return {
            "available": True,
            "model_name": model_name,
            "status": "running" if model_available else "loading",
            "version": "gemma4:e4b",
            "response_time": round(elapsed, 2),
        }
    except Exception as e:
        return {
            "available": False,
            "model_name": model_name,
            "status": "offline",
            "error": str(e),
        }
