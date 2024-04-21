const { app, BrowserWindow, Menu} = require('electron')
const path = require('node:path')
const fetch = require('node-fetch')
const IPC = require('./Helpers/IPC.js')
const AppDataHandler = require('./Helpers/AppdataHandler.js')
const Installer = require('./Installer/InstallerWindow.js')

if (AppDataHandler.CheckBarelyFunctionalInstall(__dirname)) {
  const createWindow = () => {
    const win = new BrowserWindow({
      width: 1200,
      height: 800,
      autoHideMenuBar: true,
      fullscreen: true,
      icon: "keycat-logo-1000.png",
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
    win.loadURL('http://localhost:3000')
   win.setMenuBarVisibility(null)
    Menu.setApplicationMenu(null)
  }
  app.whenReady().then(() => {
    createWindow()
    IPC.OnReady()
  })
} else {
  if (process.argv[2] == "portable") {
    console.log("Firt launch: Initalizing as portable")
    AppDataHandler.CreateInstall(__dirname, "Portable")
    app.relaunch()
    app.exit()
  } else {
    console.log("Firt launch: Initalizing as Installed")
    app.whenReady().then(() => {
      Installer.StartInstaller()
    })
  }
}