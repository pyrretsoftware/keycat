const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  loginBrowser: () => ipcRenderer.send('browser-login'),
  reportState: (state) => ipcRenderer.send('report-state', state),
  openWebsite: (website) => ipcRenderer.send('open-website', website),
  loginGetToken: () => ipcRenderer.invoke('login:gettoken'),
  getMaps: () => ipcRenderer.invoke('maploader:get'),
  importMap: (rawmap, mapname) => ipcRenderer.invoke('maploader:import', rawmap, mapname),
  openEditor: () => ipcRenderer.invoke('editor:open'),
  quitEditor: () => ipcRenderer.invoke('editor:quit'),
  saveEditorMap: (mapfile) => ipcRenderer.invoke('editor:save', mapfile),
  getMapResources: (name) => ipcRenderer.invoke('editor:getmapres', name),
  openMapDir: (name) => ipcRenderer.invoke('editor:openmapdir', name)
})