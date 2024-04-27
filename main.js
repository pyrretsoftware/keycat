const { app, BrowserWindow, Menu, TrayMenu, nativeImage} = require('electron')
const path = require('node:path')
const IPC = require('./Helpers/IPC.js')
const AppDataHandler = require('./Helpers/AppdataHandler.js')
const Installer = require('./Installer/InstallerWindow.js')
const fs = require('fs')
const unhandled = require('electron-unhandled');
unhandled();

let realdirname = __dirname.replaceAll("\\", "/").replace("resources/app.asar", "")
if (process.platform === "win32") { 
  realdirname = realdirname.replaceAll("/", "\\")
}
if (__dirname.includes("app.asar") || fs.existsSync(realdirname + "/resources")) {
  const createWindow = () => {
    const win = new BrowserWindow({
      width: 1200,
      height: 800,
      autoHideMenuBar: true,
      fullscreen: true,
      icon: __dirname + "/build/icon.png",
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
  if (process.argv[1] == "portable") {
    console.log("First launch: Initalizing as portable")
    AppDataHandler.CreateInstall(__dirname, "Portable")
    app.relaunch()
    app.exit()
  } else if (process.argv[1] == "uninstall") {

  } else {
    console.log("First launch: Initalizing as Installed")
    app.whenReady().then(() => {
      Installer.StartInstaller()
    })
  }
}