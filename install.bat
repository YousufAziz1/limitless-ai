@echo off
chcp 65001 >nul 2>&1
title Limitless AI - One Click Installer
color 0A

echo.
echo  ╔══════════════════════════════════════════╗
echo  ║     🚀 LIMITLESS AI - INSTALLER          ║
echo  ║     Apna AI Teacher Install Karo!         ║
echo  ╚══════════════════════════════════════════╝
echo.
echo  Bas wait karo... sab automatic hoga!
echo.

:: ─── Step 1: Check Python ───────────────────────
echo  [1/5] Python check kar rahe hain...
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo  ❌ Python nahi mila!
    echo.
    echo  Python install karo: https://www.python.org/downloads/
    echo  Install karte waqt "Add Python to PATH" checkbox ON karo!
    echo.
    echo  Phir dubara ye file run karo.
    pause
    start https://www.python.org/downloads/
    exit /b 1
)
echo  ✅ Python installed!

:: ─── Step 2: Check Node.js ──────────────────────
echo  [2/5] Node.js check kar rahe hain...
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo  ❌ Node.js nahi mila!
    echo.
    echo  Node.js install karo: https://nodejs.org
    echo  "LTS" version download karo aur install karo.
    echo.
    echo  Phir dubara ye file run karo.
    pause
    start https://nodejs.org
    exit /b 1
)
echo  ✅ Node.js installed!

:: ─── Step 3: Setup Backend ──────────────────────
echo  [3/5] AI Brain setup kar rahe hain...
cd backend

if not exist "venv" (
    echo     Python environment bana rahe hain...
    python -m venv venv
)

echo     Libraries install kar rahe hain...
call venv\Scripts\activate.bat
pip install -r requirements.txt --quiet >nul 2>&1
call deactivate
cd ..
echo  ✅ AI Brain ready!

:: ─── Step 4: Setup Frontend ─────────────────────
echo  [4/5] App setup kar rahe hain...
cd frontend

:: Install pnpm if not available
pnpm --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo     pnpm install kar rahe hain...
    npm install -g pnpm >nul 2>&1
)

echo     App libraries install kar rahe hain...
pnpm install --silent >nul 2>&1
cd ..
echo  ✅ App ready!

:: ─── Step 5: Check Ollama ───────────────────────
echo  [5/5] AI Engine check kar rahe hain...
ollama --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo  ⚠️  Ollama nahi mila - install kar rahe hain...
    echo     Ye thoda time lega...
    winget install Ollama.Ollama --accept-package-agreements --accept-source-agreements >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo  📥 Ollama manually install karo:
        echo     https://ollama.com/download
        echo.
        echo  Install hone ke baad dubara ye file run karo.
        start https://ollama.com/download
    ) else (
        echo  ✅ Ollama installed!
    )
) else (
    echo  ✅ Ollama ready!
)

:: ─── Create Desktop Shortcut ────────────────────
echo.
echo  🔗 Desktop shortcut bana rahe hain...
set SCRIPT_DIR=%~dp0
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut([Environment]::GetFolderPath('Desktop') + '\Limitless AI.lnk'); $s.TargetPath = '%SCRIPT_DIR%start.bat'; $s.WorkingDirectory = '%SCRIPT_DIR%'; $s.IconLocation = '%SCRIPT_DIR%frontend\public\favicon.ico'; $s.Description = 'Limitless AI - Your Offline AI Teacher'; $s.Save()" >nul 2>&1
echo  ✅ Desktop pe "Limitless AI" shortcut ban gaya!

:: ─── Done! ──────────────────────────────────────
echo.
echo  ╔══════════════════════════════════════════╗
echo  ║  🎉 INSTALLATION COMPLETE!               ║
echo  ║                                          ║
echo  ║  Ab kya karna hai:                       ║
echo  ║  1. Desktop pe "Limitless AI" icon       ║
echo  ║     double-click karo                    ║
echo  ║  2. Bas! AI Teacher ready!               ║
echo  ╚══════════════════════════════════════════╝
echo.

:: Ask to launch now
set /p LAUNCH="Abhi app kholna hai? (Y/N): "
if /i "%LAUNCH%"=="Y" (
    echo  🚀 App start ho raha hai...
    call start.bat
)

pause
