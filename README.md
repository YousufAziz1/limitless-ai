# ðŸŒŸ Limitless AI â€” Offline AI School for Every Child

<div align="center">

![Limitless AI Banner](https://img.shields.io/badge/Limitless%20AI-Offline%20Education-FF6B1A?style=for-the-badge&logoColor=white)
![Gemma 4](https://img.shields.io/badge/Powered%20by-Gemma%204-4285F4?style=for-the-badge)
![Ollama](https://img.shields.io/badge/Runtime-Ollama-000000?style=for-the-badge)
![Offline First](https://img.shields.io/badge/Internet-Not%20Required-22C55E?style=for-the-badge)

### *"Intelligence Should Not Require Internet."*

**Limitless AI brings world-class AI education offline using Gemma 4 â€” for 250 million rural Indian students who deserve better.**

[Start Learning](#-quick-start) Â· [Architecture](#-architecture)

</div>

---

## ðŸŽ¯ The Problem

In India:
- **250 million** students study in rural areas
- **40%** lack reliable internet access
- **City students** get AI tutors, YouTube, online coaching
- **Rural students** get â€” nothing

**Limitless AI is the equalizer.**

---

## âœ¨ What is Limitless AI?

Limitless (Ù†ÙˆØ±) means **light** in Arabic and Urdu â€” bringing the light of knowledge to every corner of India.

Limitless AI is a **fully offline AI education platform** that:

| Feature | Description |
|---------|-------------|
| ðŸ¤– **AI Tutor** | Streaming chat with Gemma 4, Hindi + English |
| ðŸ“· **Homework Scanner** | Photo your homework â†’ AI explains step-by-step |
| ðŸŽ¤ **Voice Teacher** | Talk to AI in Hindi or English using Web Speech API |
| â­  **Dream Builder** | AI generates personalized career roadmaps |
| ðŸ“š **Multi-Subject** | Math, Science, Hindi, English, History, Geography |
| ðŸ”‹ **Low-End Optimized** | Runs on 4GB RAM with llama.cpp |
| ðŸŒ  **Bilingual** | Full Hindi + English support throughout |
| ðŸ“± **PWA** | Installable, works on tablets and phones |

---

## ðŸ —ï¸  Architecture

```
Limitless-ai/
â”œâ”€â”€ frontend/          # React 18 + Vite + TypeScript + TailwindCSS
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ pages/     # LandingPage, ChatPage, ScannerPage, DreamPage, Subjects
â”‚   â”‚   â”œâ”€â”€ components/# AIOrbAssistant, MessageBubble, VoiceInput, ImageUpload...
â”‚   â”‚   â”œâ”€â”€ hooks/     # useChat, useVoice, useScrollAnimation
â”‚   â”‚   â”œâ”€â”€ store/     # Zustand (chatStore, appStore)
â”‚   â”‚   â””â”€â”€ services/  # API layer with streaming SSE
â”‚
â”œâ”€â”€ backend/           # Python FastAPI
â”‚   â”œâ”€â”€ routes/        # /api/chat, /api/chat-image, /api/health, /api/subjects
â”‚   â”œâ”€â”€ services/      # ollama_service.py, image_service.py
â”‚   â””â”€â”€ models/        # Pydantic schemas
â”‚
â””â”€â”€ setup.sh           # One-command setup
```

### AI Stack

```
User Input (Text/Voice/Image)
        â†“
FastAPI Backend (Python)
        â†“
Ollama Local Server
        â†“
Gemma 4 (gemma3:4b) via llama.cpp
        â†“
Streaming SSE Response
        â†“
React Frontend (real-time token rendering)
```

---

## ðŸš€ Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- pnpm (`npm i -g pnpm`)
- Ollama ([ollama.ai](https://ollama.ai))

### Option 1: Automated Setup

```bash
# Linux/Mac
chmod +x setup.sh && ./setup.sh

# Windows (PowerShell)
python -m pip install -r backend/requirements.txt
ollama pull gemma3:4b
cd frontend && pnpm install && pnpm dev
```

### Option 2: Manual Setup

#### Step 1 â€” Install Ollama & Pull Gemma

```bash
# Install Ollama (visit ollama.ai for your OS)
# Then pull Gemma 4:
ollama pull gemma3:4b

# Start Ollama server:
ollama serve
```

#### Step 2 â€” Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
# â†’ Runs on http://localhost:8000
```

#### Step 3 â€” Frontend

```bash
cd frontend
pnpm install
pnpm dev
# â†’ Opens http://localhost:5173
```

---

## ðŸ¤– Model Configuration

| Model | RAM Required | Best For |
|-------|-------------|----------|
| `gemma3:4b` | ~4GB | Low-end devices, fast responses |
| `gemma3:12b` | ~8GB | Better quality, more detailed |
| `gemma3:27b` | ~16GB | Best quality (powerful hardware) |

Default is `gemma3:4b` â€” optimized for rural India's low-end hardware.

Switch model in the frontend settings or via the backend `DEFAULT_MODEL` env var.

---

## ðŸŒ API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Model status, system info |
| `GET` | `/api/subjects` | Available subjects |
| `POST` | `/api/chat` | Streaming text chat (SSE) |
| `POST` | `/api/chat-image` | Multimodal image analysis |

### Chat Request Example

```json
POST /api/chat
{
  "message": "Explain photosynthesis simply",
  "mode": "explain",
  "language": "hi",
  "subject": "science",
  "model_name": "gemma3:4b"
}
```

### Chat Modes

| Mode | Description |
|------|-------------|
| `explain` | Clear step-by-step explanations |
| `exam` | Exam practice, mock questions |
| `revision` | Quick summary notes |
| `weak` | Extra gentle, simple language |

---

## ðŸŽ¨ Design Philosophy

Limitless AI's design reflects Indian culture:

- **Saffron** (`#FF6B1A`) â€” sacred, energetic, hopeful
- **Forest Green** (`#22C55E`) â€” growth, nature, life
- **Gold** (`#F5C842`) â€” wisdom, achievement, light
- **Dark background** â€” energy efficient, easy on eyes

---

## ðŸ”’ Privacy & Security

- **100% offline** â€” no data leaves your device after setup
- **No accounts** â€” no login, no tracking
- **No cloud** â€” AI runs entirely on your local machine
- **No cost** â€” completely free to use

---

## ðŸ“± Deployment

### Frontend (Vercel)

```bash
cd frontend
pnpm build
# Deploy dist/ to Vercel
```

> Note: For full offline functionality, backend must run locally.

### Backend (Local only)

The backend must run locally for offline operation. On school/community computers:

```bash
python backend/main.py
# Runs on port 8000, serves the whole school's network
```

---

## ðŸŒŸ Impact

> "One child offline = One child left behind."

Limitless AI is our answer to digital inequality in education. Built with love for every child in rural India who deserves the same quality of education as their city counterparts.

---

## ðŸ› ï¸ Built With

- **[Gemma 4](https://ai.google.dev/gemma)** â€” Google DeepMind's open language model
- **[Ollama](https://ollama.ai)** â€” Local AI inference framework
- **[llama.cpp](https://github.com/ggerganov/llama.cpp)** â€” Efficient CPU inference
- **[React 18](https://react.dev)** + Vite + TypeScript
- **[FastAPI](https://fastapi.tiangolo.com)** â€” Python async web framework
- **[Framer Motion](https://framer.com/motion)** â€” Production animations
- **[Zustand](https://zustand-demo.pmnd.rs)** â€” State management

---

## ðŸ“„ License

MIT â€” Free for all educational use.

---

<div align="center">

*"Limitless" means light â€” we're bringing the light of AI to every child in India.*

</div>
