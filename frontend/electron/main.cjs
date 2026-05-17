/**
 * electron/main.js
 * Limitless AI — Main Electron Process
 * Handles window, auto-setup, and IPC
 */
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { ensureOllama } = require('./installer.cjs')
const { ensureModel } = require('./model.cjs')
const { startBackend, stopBackend } = require('./backend.cjs')

const isDev = process.env.NODE_ENV === 'development'

let mainWindow = null
let setupState = {
  phase: 'idle',           // idle | checking | ollama | model | backend | ready | error
  percent: 0,
  message: '',
  modelChoice: 'gemma4:e4b',
  error: null,
}

// ── Create Main Window ─────────────────────────────
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 800,
    minHeight: 600,
    frame: false,          // custom titlebar
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#08080f',
    show: false,           // show after ready-to-show
    icon: path.join(__dirname, '..', 'public', 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  })

  // Load app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// ── Send progress to renderer ──────────────────────
function sendProgress(data) {
  setupState = { ...setupState, ...data }
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('setup-progress', data)
  }
}

// ── Auto-setup pipeline ────────────────────────────
async function runSetup(modelChoice = 'gemma4:e4b') {
  setupState.modelChoice = modelChoice

  try {
    // Step 1 — Check / install Ollama
    sendProgress({ phase: 'checking', percent: 0, message: 'Checking system...' })
    await ensureOllama((progress) => {
      sendProgress({ phase: 'ollama', ...progress })
    })

    // Step 2 — Pull model
    sendProgress({ phase: 'model', percent: 0, message: 'Checking AI Brain...' })
    await ensureModel(modelChoice, (progress) => {
      sendProgress({ phase: 'model', ...progress })
    })

    // Step 3 — Start backend
    sendProgress({ phase: 'backend', percent: 0, message: 'Starting AI Core...' })
    await startBackend((progress) => {
      sendProgress({ phase: 'backend', ...progress })
    })

    // Done!
    sendProgress({ phase: 'ready', percent: 100, message: 'Limitless AI is ready!' })

  } catch (err) {
    console.error('Setup failed:', err)
    sendProgress({
      phase: 'error',
      percent: 0,
      message: err.message || 'Setup failed. Please restart.',
      error: err.message,
    })
  }
}

// ── IPC Handlers ──────────────────────────────────
ipcMain.handle('start-setup', async (_event, modelChoice) => {
  runSetup(modelChoice)  // fire and forget, progress via events
  return { started: true }
})

ipcMain.handle('get-setup-status', () => {
  return setupState
})

// ── App Lifecycle ─────────────────────────────────
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  stopBackend()
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', () => {
  stopBackend()
})
