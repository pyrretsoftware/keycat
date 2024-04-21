const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  Continue: () => ipcRenderer.send('installation-continue')
})