/**
 * electron/backend.js
 * Auto-starts Python FastAPI backend and waits for it to be ready
 */
const { spawn } = require('child_process')
const path = require('path')
const http = require('http')
const fs = require('fs')

let backendProcess = null

const BACKEND_URL = 'http://localhost:8000/api/health'
const MAX_WAIT_MS = 90000   // 90s — PyInstaller single-file exe needs time to extract
const POLL_INTERVAL_MS = 2000

/**
 * Check if backend is already running
 */
function isBackendRunning() {
  return new Promise((resolve) => {
    http.get(BACKEND_URL, (res) => {
      resolve(res.statusCode === 200)
    }).on('error', () => resolve(false))
  })
}

/**
 * Poll until backend is alive
 */
function waitForBackend(timeoutMs = MAX_WAIT_MS) {
  return new Promise((resolve, reject) => {
    const start = Date.now()
    const check = async () => {
      if (await isBackendRunning()) return resolve()
      if (Date.now() - start > timeoutMs) return reject(new Error('Backend startup timed out'))
      setTimeout(check, POLL_INTERVAL_MS)
    }
    check()
  })
}

/**
 * Get Python executable — prefers local venv, falls back to system
 */
function getVenvPython(backendPath) {
  // Try venv inside backend folder
  const venvWin  = path.join(backendPath, 'venv', 'Scripts', 'python.exe')
  const venvUnix = path.join(backendPath, 'venv', 'bin', 'python')

  if (fs.existsSync(venvWin))  return venvWin
  if (fs.existsSync(venvUnix)) return venvUnix

  // Fall back to system python
  return process.platform === 'win32' ? 'python' : 'python3'
}

/**
 * Get backend path
 * In production (packaged): resources/backend/
 * In development: ../backend/
 */
function getBackendPath() {
  if (process.env.NODE_ENV === 'development' || !process.resourcesPath) {
    // Dev mode: go up from frontend/electron/ to root, then into backend/
    return path.join(__dirname, '..', '..', 'backend')
  }
  // Production: extraResources copies backend/ to resources/backend/
  return path.join(process.resourcesPath, 'backend')
}

/**
 * Start the FastAPI backend
 * @param {Function} onProgress
 */
async function startBackend(onProgress) {
  // Check if already running
  if (await isBackendRunning()) {
    onProgress({ phase: 'backend', percent: 100, message: 'AI Core already running' })
    return
  }

  const backendPath = getBackendPath()
  
  onProgress({ phase: 'backend', percent: 20, message: 'Starting AI Core...' })

  if (process.env.NODE_ENV === 'development' || !process.resourcesPath) {
    // Development Mode
    const mainPy = path.join(backendPath, 'main.py')
    if (!fs.existsSync(mainPy)) {
      throw new Error(`Backend not found at: ${mainPy}`)
    }
    const pythonCmd = getVenvPython(backendPath)
    backendProcess = spawn(pythonCmd, [mainPy], {
      cwd: backendPath,
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
      detached: false,
    })
  } else {
    // Production Mode (Standalone PyInstaller EXE)
    const mainExe = path.join(backendPath, 'main.exe')
    if (!fs.existsSync(mainExe)) {
      // Fallback: try spawning python if exe not found
      console.error(`[Backend] main.exe not found at ${mainExe}, trying python fallback`)
      const fallbackBackend = path.join(process.resourcesPath, '..', 'backend')
      const pyPath = path.join(fallbackBackend, 'main.py')
      if (!fs.existsSync(pyPath)) {
        throw new Error(`Backend not found. Expected: ${mainExe}`)
      }
      backendProcess = spawn('python', [pyPath], {
        cwd: fallbackBackend,
        stdio: ['ignore', 'pipe', 'pipe'],
        windowsHide: true,
        shell: true,
        detached: false,
      })
    } else {
      // shell:true fixes 'spawn EFTYPE' on Windows with PyInstaller executables
      backendProcess = spawn(mainExe, [], {
        cwd: backendPath,
        stdio: ['ignore', 'pipe', 'pipe'],
        windowsHide: true,
        shell: true,
        detached: false,
      })
    }
  }

  backendProcess.stdout.on('data', (data) => {
    const line = data.toString().trim()
    console.log('[Backend]', line)
  })

  backendProcess.stderr.on('data', (data) => {
    const line = data.toString().trim()
    console.error('[Backend Error]', line)
  })

  backendProcess.on('error', (err) => {
    console.error('Failed to start backend:', err)
  })

  onProgress({ phase: 'backend', percent: 50, message: 'Waiting for AI Core to initialize...' })

  // Wait until backend responds
  await waitForBackend()

  onProgress({ phase: 'backend', percent: 100, message: 'AI Core is live!' })
}

/**
 * Kill backend when app exits
 */
function stopBackend() {
  if (backendProcess) {
    backendProcess.kill()
    backendProcess = null
  }
}

module.exports = { startBackend, stopBackend, isBackendRunning }
