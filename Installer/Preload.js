const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  Continue: () => ipcRenderer.invoke('installation:continue'),
  Exit: () => ipcRenderer.invoke('installation:exit'),
  onSendLog: (callback) => ipcRenderer.on('send-log', (_event, value) => callback(value)),
})