const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  loginBrowser: () => ipcRenderer.send('browser-login'),
  reportState: (state) => ipcRenderer.send('report-state', state),
  openWebsite: (website) => ipcRenderer.send('open-website', website),
  loginGetToken: () => ipcRenderer.invoke('login:gettoken'),
  getMaps: () => ipcRenderer.invoke('maploader:get')

})