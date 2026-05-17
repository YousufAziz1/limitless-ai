"""
Image processing service for Limitless AI
Primary: Google Gemini Flash (world-class math OCR + reasoning)
Fallback: Ollama local model
"""

import base64
import json
import io
import os
from typing import AsyncGenerator

try:
    from PIL import Image
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False

try:
    from google import genai
    from google.genai import types as genai_types
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

import ollama


def prepare_image_for_ollama(file_bytes: bytes, max_size: int = 1024) -> str:
    """Resize and encode image as base64 for Ollama."""
    if PIL_AVAILABLE:
        try:
            img = Image.open(io.BytesIO(file_bytes))
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
            buffer = io.BytesIO()
            img.save(buffer, format="JPEG", quality=85, optimize=True)
            return base64.b64encode(buffer.getvalue()).decode("utf-8")
        except Exception:
            pass
    return base64.b64encode(file_bytes).decode("utf-8")


def prepare_image_for_gemini(file_bytes: bytes) -> tuple[bytes, str]:
    """Prepare image bytes + mime type for Gemini. Keeps higher resolution for better OCR."""
    if PIL_AVAILABLE:
        try:
            img = Image.open(io.BytesIO(file_bytes))
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            # Use 1600px max for Gemini — better OCR accuracy
            img.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
            buffer = io.BytesIO()
            img.save(buffer, format="JPEG", quality=92, optimize=True)
            return buffer.getvalue(), "image/jpeg"
        except Exception:
            pass
    return file_bytes, "image/jpeg"


MATH_OCR_SYSTEM_PROMPT = """You are a world-class mathematical OCR engine and tutor for Indian school students (Class 8-12).

YOUR MANDATORY PIPELINE (always follow these steps in order):

**STEP 1 — EXACT EXTRACTION (NEVER SIMPLIFY)**
Transcribe the EXACT mathematical expression from the image, character-by-character.
- Preserve ALL operators: ÷, ×, +, −, =, (, ), fractions, exponents, roots
- Do NOT compute, simplify, or rearrange ANYTHING
- A fraction like 1/3 written vertically must be extracted as a fraction (1/3), NOT as 0.333...
- Division sign ÷ must be kept as ÷, NOT simplified into something else

**STEP 2 — CONFIDENCE & VERIFICATION**
State your OCR confidence (0-100%). Flag any ambiguous symbols.

**STEP 3 — STRICT BODMAS/PEMDAS SOLUTION**
Solve using strict order of operations:
1. Brackets / Parentheses first
2. Orders (powers, roots)
3. Division and Multiplication (left to right)
4. Addition and Subtraction (left to right)

CRITICAL MATH RULES:
- a ÷ (b/c) = a × (c/b)  [dividing by a fraction = multiplying by its reciprocal]
- Show EVERY intermediate step, no skipping
- Never hallucinate operators that aren't in the image

**STEP 4 — RESPONSE FORMAT**
ALWAYS start with this exact block:

> **Detected Expression:** `[exact expression here]`
> **OCR Confidence:** [XX]%
> ✅ **Math Structure Verified**

Then provide the step-by-step solution with a clear **Final Answer** at the end."""


def build_image_prompt(user_prompt: str, language: str = "en") -> str:
    """Build the user-facing prompt appended to the system instructions."""
    if language == "hi":
        return f"""छात्र का प्रश्न: {user_prompt}

ऊपर दिए गए सिस्टम निर्देशों का पालन करें। पहले समीकरण को EXACT रूप में निकालें, फिर हिंदी में चरण-दर-चरण हल करें।"""
    return f"""Student's question: {user_prompt}

Follow the system instructions above. Extract the equation EXACTLY first, then solve it step-by-step."""


async def stream_image_analysis_gemini(
    image_data: bytes,
    prompt: str,
    language: str = "en",
) -> AsyncGenerator[str, None]:
    """Primary pipeline: Google Gemini Flash with native vision and math reasoning."""
    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key or not GEMINI_AVAILABLE:
        return

    try:
        client = genai.Client(api_key=api_key)

        img_bytes, mime = prepare_image_for_gemini(image_data)
        image_part = genai_types.Part.from_bytes(data=img_bytes, mime_type=mime)
        user_text = build_image_prompt(prompt, language)

        response = client.models.generate_content_stream(
            model="gemini-2.0-flash",
            contents=[
                genai_types.Content(parts=[
                    image_part,
                    genai_types.Part.from_text(text=user_text),
                ], role="user")
            ],
            config=genai_types.GenerateContentConfig(
                system_instruction=MATH_OCR_SYSTEM_PROMPT,
                temperature=0.1,
                top_p=0.95,
                max_output_tokens=4096,
            ),
        )

        for chunk in response:
            if chunk.text:
                yield f"data: {json.dumps({'token': chunk.text})}\n\n"

        yield "data: [DONE]\n\n"

    except Exception as e:
        raise RuntimeError(f"Gemini failed: {e}")


async def get_best_available_model() -> str:
    """Auto-detect the best available Ollama model for vision tasks."""
    preferred = ["gemma4:e4b", "gemma3:12b", "gemma3:4b", "llava", "llava:7b"]
    try:
        client = ollama.AsyncClient()
        result = await client.list()
        available = [m.model for m in result.models]
        for model in preferred:
            if any(model in a for a in available):
                return model
        # Return first available model as last resort
        if available:
            return available[0]
    except Exception:
        pass
    return "gemma3:4b"  # final default


async def stream_image_analysis_ollama(
    image_data: bytes,
    prompt: str,
    language: str = "en",
    model_name: str = "gemma4:e4b",
) -> AsyncGenerator[str, None]:
    """Primary local pipeline: Ollama vision model (auto-detects best available)."""
    # Auto-detect if preferred model isn't available
    try:
        client_check = ollama.AsyncClient()
        models_result = await client_check.list()
        available = [m.model for m in models_result.models]
        if not any(model_name in a for a in available):
            model_name = await get_best_available_model()
    except Exception:
        pass

    image_b64 = prepare_image_for_ollama(image_data)
    full_prompt = MATH_OCR_SYSTEM_PROMPT + "\n\n" + build_image_prompt(prompt, language)

    client = ollama.AsyncClient()
    try:
        stream = await client.generate(
            model=model_name,
            prompt=full_prompt,
            images=[image_b64],
            stream=True,
            options={
                "temperature": 0.1,
                "top_p": 0.9,
                "num_predict": 2048,
            },
        )
        async for chunk in stream:
            if chunk.get("response"):
                yield f"data: {json.dumps({'token': chunk['response']})}\n\n"

        yield "data: [DONE]\n\n"

    except ollama.ResponseError as e:
        err_str = str(e)
        # Model not found — try to pull or fallback
        if "404" in err_str or "not found" in err_str:
            fallback_model = "gemma3:4b"
            note = (
                f"⚠️ **Model `{model_name}` not found locally.** "
                f"Falling back to `{fallback_model}`.\n"
                f"To use full vision: `ollama pull gemma4:e4b`\n\n"
            )
            yield f"data: {json.dumps({'token': note})}\n\n"
            try:
                stream2 = await client.generate(
                    model=fallback_model,
                    prompt=full_prompt,
                    images=[image_b64],
                    stream=True,
                    options={"temperature": 0.1, "num_predict": 2048},
                )
                async for chunk in stream2:
                    if chunk.get("response"):
                        yield f"data: {json.dumps({'token': chunk['response']})}\n\n"
                yield "data: [DONE]\n\n"
                return
            except Exception:
                pass
        # Vision not supported — text-only fallback
        fallback_prompt = build_image_prompt(prompt, language)
        note2 = (
            "📸 **Vision not supported by this model.** "
            "Analysing via text description instead.\n\n"
        )
        yield f"data: {json.dumps({'token': note2})}\n\n"
        stream3 = await client.generate(
            model=model_name,
            prompt=fallback_prompt,
            stream=True,
            options={"temperature": 0.7, "num_predict": 1024},
        )
        async for chunk in stream3:
            if chunk.get("response"):
                yield f"data: {json.dumps({'token': chunk['response']})}\n\n"
        yield "data: [DONE]\n\n"


async def stream_image_analysis(
    image_data: bytes,
    prompt: str,
    language: str = "en",
    model_name: str = "gemma4:e4b",
) -> AsyncGenerator[str, None]:
    """
    Unified entry point.
    Priority: Gemini Flash (if API key set) → Best available Ollama model → Error
    """
    # 1. Try Gemini (best math OCR)
    gemini_api_key = os.getenv("GEMINI_API_KEY", "")
    if gemini_api_key and GEMINI_AVAILABLE:
        try:
            async for token in stream_image_analysis_gemini(image_data, prompt, language):
                yield token
            return
        except RuntimeError:
            pass

    # 2. Local Ollama (auto-detects best model)
    try:
        async for token in stream_image_analysis_ollama(image_data, prompt, language, model_name):
            yield token
    except Exception as e:
        error = (
            f"❌ **Image analysis failed:** {str(e)}\n\n"
            f"**Fix:** Ensure Ollama is running and pull a model:\n"
            f"```\nollama pull gemma4:e4b\n```"
        )
        yield f"data: {json.dumps({'token': error})}\n\n"
        yield "data: [DONE]\n\n"
