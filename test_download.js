const { downloadFile } = require('./frontend/electron/installer.cjs');
// Note: we can't easily require installer.cjs directly because it exports ensureOllama which depends on electron (wait, no, installer.cjs only uses child_process, https, fs, path, os).
const https = require('https');
const fs = require('fs');

function downloadFileLocal(url, destPath, onProgress) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath)
    let downloaded = 0
    let total = 0

    const request = https.get(url, { followRedirects: true }, (res) => {
      // Handle redirects
      if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
        fs.unlink(destPath, () => {})
        return downloadFileLocal(res.headers.location, destPath, onProgress)
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

downloadFileLocal('https://ollama.com/download/OllamaSetup.exe', 'test_ollama.exe', (prog) => {
    if (prog.percent % 10 === 0) console.log(prog.percent + '%');
}).then(() => {
    console.log('Download complete. Size:', fs.statSync('test_ollama.exe').size);
    fs.unlinkSync('test_ollama.exe');
}).catch(console.error);
