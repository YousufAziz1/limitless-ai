#!/bin/bash
# ══════════════════════════════════════════
# NOOR AI — Automated Setup Script
# "Offline AI School for Every Child"
# ══════════════════════════════════════════

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
ORANGE='\033[0;33m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m'

echo ""
echo -e "${ORANGE}╔══════════════════════════════════════════╗${NC}"
echo -e "${ORANGE}║          🌟  NOOR AI  🌟                 ║${NC}"
echo -e "${ORANGE}║   Offline AI School for Every Child      ║${NC}"
echo -e "${ORANGE}║   Powered by Gemma 4 + Ollama            ║${NC}"
echo -e "${ORANGE}╚══════════════════════════════════════════╝${NC}"
echo ""

# ── Check prerequisites ────────────────────
echo -e "${CYAN}[1/5] Checking prerequisites...${NC}"

if ! command -v python3 &>/dev/null; then
    echo -e "${RED}❌ Python 3 not found. Please install Python 3.10+${NC}"
    exit 1
fi
echo -e "${GREEN}  ✓ Python $(python3 --version)${NC}"

if ! command -v node &>/dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi
echo -e "${GREEN}  ✓ Node.js $(node --version)${NC}"

if ! command -v pnpm &>/dev/null; then
    echo -e "${YELLOW}  Installing pnpm...${NC}"
    npm install -g pnpm
fi
echo -e "${GREEN}  ✓ pnpm $(pnpm --version)${NC}"

# ── Install/Check Ollama ───────────────────
echo ""
echo -e "${CYAN}[2/5] Setting up Ollama...${NC}"

if ! command -v ollama &>/dev/null; then
    echo -e "${YELLOW}  Installing Ollama...${NC}"
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        curl -fsSL https://ollama.ai/install.sh | sh
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo -e "${YELLOW}  Please install Ollama from: https://ollama.ai${NC}"
        echo -e "${YELLOW}  Then re-run this script.${NC}"
        exit 1
    else
        echo -e "${YELLOW}  Windows: Download Ollama from https://ollama.ai${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}  ✓ Ollama installed${NC}"

# Start Ollama in background
echo -e "${YELLOW}  Starting Ollama server...${NC}"
ollama serve &>/dev/null &
OLLAMA_PID=$!
sleep 3

# Pull Gemma model
echo -e "${YELLOW}  Pulling gemma4 (this may take a few minutes on first run)...${NC}"
echo -e "${CYAN}  Model size: ~3GB — perfect for low-end hardware${NC}"
ollama pull gemma4
echo -e "${GREEN}  ✓ gemma4 ready${NC}"

# ── Backend setup ──────────────────────────
echo ""
echo -e "${CYAN}[3/5] Setting up Python backend...${NC}"

cd backend
python3 -m venv venv 2>/dev/null || true
source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null || true
pip install -r requirements.txt -q
echo -e "${GREEN}  ✓ Backend dependencies installed${NC}"
cd ..

# ── Frontend setup ─────────────────────────
echo ""
echo -e "${CYAN}[4/5] Setting up React frontend...${NC}"
cd frontend
pnpm install --silent
echo -e "${GREEN}  ✓ Frontend dependencies installed${NC}"
cd ..

# ── Launch ────────────────────────────────
echo ""
echo -e "${CYAN}[5/5] Launching NOOR AI...${NC}"
echo ""

# Start backend
echo -e "${YELLOW}  Starting FastAPI backend on port 8000...${NC}"
cd backend
source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null || true
python3 main.py &
BACKEND_PID=$!
cd ..
sleep 2

# Start frontend
echo -e "${YELLOW}  Starting Vite frontend on port 5173...${NC}"
cd frontend
pnpm dev &
FRONTEND_PID=$!
cd ..
sleep 3

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║        🚀 NOOR AI is RUNNING! 🚀         ║${NC}"
echo -e "${GREEN}╠══════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  Frontend:  http://localhost:5173        ║${NC}"
echo -e "${GREEN}║  Backend:   http://localhost:8000        ║${NC}"
echo -e "${GREEN}║  API Docs:  http://localhost:8000/docs   ║${NC}"
echo -e "${GREEN}╠══════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  Model:     gemma4 (offline)          ║${NC}"
echo -e "${GREEN}║  Internet:  NOT REQUIRED ✓               ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}Press Ctrl+C to stop all servers${NC}"
echo ""

# Open browser
sleep 2
if command -v xdg-open &>/dev/null; then
    xdg-open http://localhost:5173
elif command -v open &>/dev/null; then
    open http://localhost:5173
fi

# Cleanup on exit
trap "echo ''; echo 'Stopping NOOR AI...'; kill $BACKEND_PID $FRONTEND_PID $OLLAMA_PID 2>/dev/null; exit 0" INT TERM

wait $FRONTEND_PID
