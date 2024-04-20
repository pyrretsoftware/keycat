const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  //loginBrowser: () => ipcRenderer.send('browser-login')
})