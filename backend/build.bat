@echo off
echo Building Backend Executable...

call venv\Scripts\activate.bat
pip install pyinstaller

echo Running PyInstaller...
pyinstaller --name "main" ^
  --onefile ^
  --hidden-import="uvicorn.logging" ^
  --hidden-import="uvicorn.loops" ^
  --hidden-import="uvicorn.loops.auto" ^
  --hidden-import="uvicorn.protocols" ^
  --hidden-import="uvicorn.protocols.http" ^
  --hidden-import="uvicorn.protocols.http.auto" ^
  --hidden-import="uvicorn.protocols.websockets" ^
  --hidden-import="uvicorn.protocols.websockets.auto" ^
  --hidden-import="uvicorn.lifespan" ^
  --hidden-import="uvicorn.lifespan.on" ^
  --hidden-import="routers" ^
  --hidden-import="services" ^
  --hidden-import="models" ^
  main.py

echo Done! Output is in dist/main.exe
pause
