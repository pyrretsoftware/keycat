const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  Continue: () => ipcRenderer.invoke('installation:continue'),
  Exit: () => ipcRenderer.invoke('installation:exit'),
})