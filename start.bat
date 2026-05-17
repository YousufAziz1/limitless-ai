@echo off
color 0A
echo ===================================================
echo            LIMITLESS AI SERVER STARTUP
echo ===================================================
echo.

:: 1. Start Backend
echo [1/2] Starting Python FastAPI Backend...
cd backend
if not exist "venv\Scripts\activate.bat" (
    echo ERROR: Virtual environment not found in backend\venv.
    echo Please run the following commands first:
    echo cd backend
    echo python -m venv venv
    echo .\venv\Scripts\activate
    echo pip install -r requirements.txt
    pause
    exit /b 1
)

:: Activate venv and start uvicorn in a new window
start "Limitless AI Backend" cmd /k ".\venv\Scripts\activate.bat && python main.py"
cd ..

:: 2. Start Frontend
echo [2/2] Starting Vite React Frontend...
cd frontend
start "Limitless AI Frontend" cmd /k "pnpm dev"

echo.
echo ===================================================
echo SUCCESS!
echo - Backend is running in a new window (Port 8000)
echo - Frontend is running in a new window (Port 5173)
echo.
echo The frontend will open automatically in your browser.
echo ===================================================
timeout /t 3 >nul
start http://localhost:5173
exit
