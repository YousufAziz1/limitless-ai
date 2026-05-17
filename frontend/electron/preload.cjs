/**
 * electron/preload.js
 * Secure IPC bridge — renderer can only access exposed APIs
 */
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // Setup
  startSetup: (modelChoice) => ipcRenderer.invoke('start-setup', modelChoice),
  getSetupStatus: () => ipcRenderer.invoke('get-setup-status'),

  // Events from main → renderer
  onSetupProgress: (callback) => {
    ipcRenderer.on('setup-progress', (_event, data) => callback(data))
    return () => ipcRenderer.removeAllListeners('setup-progress')
  },

  // Utility
  platform: process.platform,
})
