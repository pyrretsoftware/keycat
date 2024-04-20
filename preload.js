const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  loginBrowser: () => ipcRenderer.send('browser-login'),
  loginGetToken: () => ipcRenderer.invoke('login:gettoken')
})