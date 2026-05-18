/**
 * electron/installer.js
 * Auto-detects and installs Ollama silently
 */
const { exec, execFile } = require('child_process')
const https = require('https')
const fs = require('fs')
const path = require('path')
const os = require('os')

const OLLAMA_WINDOWS_URL = 'https://ollama.com/download/OllamaSetup.exe'
const OLLAMA_MAC_URL = 'https://ollama.com/download/Ollama-darwin.zip'

/**
 * Check if Ollama is installed and reachable
 */
function isOllamaInstalled() {
  return new Promise((resolve) => {
    exec('ollama --version', (err) => {
      resolve(!err)
    })
  })
}

/**
 * Download file with progress callback
 */
function downloadFile(url, destPath, onProgress) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath)
    let downloaded = 0
    let total = 0

    const request = https.get(url, { followRedirects: true }, (res) => {
      // Handle redirects
      if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
        fs.unlink(destPath, () => {})
        return downloadFile(res.headers.location, destPath, onProgress)
          .then(resolve)
          .catch(reject)
      }

      total = parseInt(res.headers['content-length'] || '0', 10)

      res.on('data', (chunk) => {
        downloaded += chunk.length
        file.write(chunk)
        if (total > 0 && onProgress) {
          onProgress({
            downloaded,
            total,
            percent: Math.round((downloaded / total) * 100),
          })
        }
      })

      res.on('end', () => {
        file.end()
        resolve(destPath)
      })

      res.on('error', (err) => {
        fs.unlink(destPath, () => {})
        reject(err)
      })
    })

    request.on('error', (err) => {
      fs.unlink(destPath, () => {})
      reject(err)
    })
  })
}

/**
 * Install Ollama on Windows (silent install)
 */
function installOllamaWindows(installerPath) {
  return new Promise((resolve, reject) => {
    // /S = silent install flag for NSIS-based Ollama installer
    execFile(installerPath, ['/S'], { windowsHide: true }, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

/**
 * Install Ollama on macOS
 */
function installOllamaMac(zipPath) {
  return new Promise((resolve, reject) => {
    exec(`open "${zipPath}"`, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

/**
 * Install Ollama on Linux
 */
function installOllamaLinux() {
  return new Promise((resolve, reject) => {
    exec('curl -fsSL https://ollama.ai/install.sh | sh', (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

/**
 * Main entry: ensure Ollama is installed
 * @param {Function} onProgress - called with { phase, percent, message }
 */
async function ensureOllama(onProgress) {
  const installed = await isOllamaInstalled()
  if (installed) {
    onProgress({ phase: 'ollama', percent: 100, message: 'Ollama already installed' })
    return
  }

  const platform = process.platform
  const tmpDir = os.tmpdir()

  if (platform === 'win32') {
    onProgress({ phase: 'ollama', percent: 0, message: 'Downloading AI Engine (Ollama)...' })
    const installerPath = path.join(tmpDir, 'OllamaSetup.exe')

    await downloadFile(OLLAMA_WINDOWS_URL, installerPath, ({ percent }) => {
      onProgress({ phase: 'ollama', percent: Math.round(percent * 0.8), message: `Downloading AI Engine... ${percent}%` })
    })

    onProgress({ phase: 'ollama', percent: 85, message: 'Installing AI Engine...' })
    await installOllamaWindows(installerPath)
    fs.unlink(installerPath, () => {})

  } else if (platform === 'darwin') {
    onProgress({ phase: 'ollama', percent: 0, message: 'Downloading Ollama for macOS...' })
    const zipPath = path.join(tmpDir, 'Ollama.zip')

    await downloadFile(OLLAMA_MAC_URL, zipPath, ({ percent }) => {
      onProgress({ phase: 'ollama', percent: Math.round(percent * 0.8), message: `Downloading AI Engine... ${percent}%` })
    })

    onProgress({ phase: 'ollama', percent: 85, message: 'Installing Ollama...' })
    await installOllamaMac(zipPath)
    fs.unlink(zipPath, () => {})

  } else {
    onProgress({ phase: 'ollama', percent: 10, message: 'Installing AI Engine on Linux...' })
    await installOllamaLinux()
  }

  onProgress({ phase: 'ollama', percent: 100, message: 'AI Engine installed!' })

  // Give Ollama a moment to initialize
  await new Promise(r => setTimeout(r, 2000))
}

module.exports = { ensureOllama, isOllamaInstalled }
