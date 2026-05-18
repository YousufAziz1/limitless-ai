/**
 * electron/model.js
 * Pull Ollama models with real-time download progress
 */
const { spawn, exec } = require('child_process')

const MODEL_SIZES = {
  'gemma4:e4b': 9600,   // MB
  'gemma4': 2500,    // MB
  'gemma4:e4b': 7300,   // MB
}

/**
 * Check if model is already pulled locally
 */
function isModelPulled(modelName) {
  return new Promise((resolve) => {
    exec('ollama list', (err, stdout) => {
      if (err) return resolve(false)
      resolve(stdout.toLowerCase().includes(modelName.toLowerCase().replace(':', ' ')))
    })
  })
}

/**
 * Parse ollama pull output line
 * Ollama outputs lines like:
 *   "pulling 4c27e0f5b5ad...  47% ▕██████    ▏ 4.5 GB/9.6 GB  22 MB/s  2m30s"
 */
function parsePullLine(line) {
  // Match percent
  const percentMatch = line.match(/(\d+)%/)
  const percent = percentMatch ? parseInt(percentMatch[1], 10) : null

  // Match downloaded / total (e.g. "4.5 GB/9.6 GB")
  const sizeMatch = line.match(/([\d.]+)\s*(MB|GB)\/([\d.]+)\s*(MB|GB)/)
  let downloaded = null, total = null
  if (sizeMatch) {
    const mult = (u) => u === 'GB' ? 1024 : 1
    downloaded = parseFloat(sizeMatch[1]) * mult(sizeMatch[2])
    total = parseFloat(sizeMatch[3]) * mult(sizeMatch[4])
  }

  // Match speed (e.g. "22 MB/s")
  const speedMatch = line.match(/([\d.]+)\s*(MB|GB|KB)\/s/)
  let speed = null
  if (speedMatch) {
    const mult = (u) => u === 'GB' ? 1024 : u === 'KB' ? 0.001 : 1
    speed = parseFloat(speedMatch[1]) * mult(speedMatch[2])
  }

  // Match ETA (e.g. "2m30s" or "45s")
  const etaMatch = line.match(/(\d+m\d+s|\d+m|\d+s)$/)
  const eta = etaMatch ? etaMatch[1] : null

  return { percent, downloaded, total, speed, eta }
}

/**
 * Pull a model with real-time progress
 * @param {string} modelName
 * @param {Function} onProgress - called with { phase, percent, downloaded, total, speed, eta, message }
 */
function pullModel(modelName, onProgress) {
  return new Promise((resolve, reject) => {
    onProgress({
      phase: 'model',
      percent: 0,
      message: `Starting download of ${modelName}...`,
    })

    const proc = spawn('ollama', ['pull', modelName], {
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    proc.stdout.on('data', (data) => {
      const lines = data.toString().split('\n').filter(Boolean)
      for (const line of lines) {
        const parsed = parsePullLine(line)

        if (parsed.percent !== null) {
          const totalMB = MODEL_SIZES[modelName] || 5000
          onProgress({
            phase: 'model',
            percent: parsed.percent,
            downloaded: parsed.downloaded ?? Math.round((parsed.percent / 100) * totalMB),
            total: parsed.total ?? totalMB,
            speed: parsed.speed,
            eta: parsed.eta,
            message: `Downloading AI Brain... ${parsed.percent}%`,
          })
        } else if (line.includes('verifying')) {
          onProgress({ phase: 'model', percent: 97, message: 'Verifying model integrity...' })
        } else if (line.includes('writing')) {
          onProgress({ phase: 'model', percent: 99, message: 'Finalizing...' })
        }
      }
    })

    proc.stderr.on('data', (data) => {
      const line = data.toString().trim()
      if (line.includes('error')) {
        reject(new Error(line))
      }
    })

    proc.on('close', (code) => {
      if (code === 0) {
        onProgress({ phase: 'model', percent: 100, message: 'AI Brain ready!' })
        resolve()
      } else {
        reject(new Error(`ollama pull exited with code ${code}`))
      }
    })

    proc.on('error', (err) => {
      reject(err)
    })
  })
}

/**
 * Ensure the requested model is available
 */
async function ensureModel(modelName, onProgress) {
  const pulled = await isModelPulled(modelName)
  if (pulled) {
    onProgress({ phase: 'model', percent: 100, message: `${modelName} already available` })
    return
  }
  await pullModel(modelName, onProgress)
}

module.exports = { ensureModel, isModelPulled, MODEL_SIZES }
