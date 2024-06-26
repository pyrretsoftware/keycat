const { app, BrowserWindow, Menu, TrayMenu, nativeImage, ipcMain} = require('electron')
const path = require('node:path')
const IPC = require('./Helpers/IPC.js')
const AppDataHandler = require('./Helpers/AppdataHandler.js')
const Installer = require('./Installer/InstallerWindow.js')
const fs = require('fs')
const unhandled = require('electron-unhandled');
const { UninstallFromLocation } = require('./Helpers/Uninstaller.js')
const { Settings  }= require('./Helpers/ReadSettings.js')
const { LoadMapsFromDirectory} = require('./Helpers/MapLoader.js')
unhandled();

let realdirname = __dirname.replaceAll("\\", "/").replace("resources/app.asar", "")
console.log(realdirname)
if (process.platform === "win32") { 
  realdirname = realdirname.replaceAll("/", "\\")
}
  if (process.argv[1] == "uninstall") {
    app.whenReady().then(() => {
      UninstallFromLocation(realdirname, true)
    })
  } else if (process.argv[1] == "portable") {
    console.log("First launch: Initalizing as portable")
    AppDataHandler.CreateInstall(__dirname, "Portable")
    app.relaunch()
    app.exit()
  } else {
    if (!process.env.PORTABLE_EXECUTABLE_FILE && process.argv[1] != "installer") { //TODO: add anotherr check for linux once we start providing linux binaries.
      var win
      const createWindow = () => {
        win = new BrowserWindow({
          width: 1200,
          height: 800,
          autoHideMenuBar: true,
          fullscreen: Settings["FullscreenOnStartup"],
          icon: __dirname + "/build/icon.png",    
          webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: false,
            nodeIntegration: true,
          }
        })
        if (Settings["DevModeLoadFromLocal"]) {
          win.loadURL('http://localhost:3000')
        } else {
          win.loadURL('https://' + Settings["Channel"] +'.keycat.deployments.axell.me/')
          if (!Settings["DevMode"]) {
            win.setMenuBarVisibility(null)
            Menu.setApplicationMenu(null)
          }
        }
      }
      app.whenReady().then(() => {
        createWindow()
        IPC.OnReady(path.join(realdirname, "Songs"))

        ipcMain.handle('editor:open',  function() {
          win.loadFile(__dirname + "/Editor/index.html")
        })

        
        ipcMain.handle('editor:quit',  function() {
          if (Settings["DevModeLoadFromLocal"]) {
            win.loadURL('http://localhost:3000')
          } else {
            win.loadURL('https://keycat.vercel.app')
            if (!Settings["DevMode"]) {
              win.setMenuBarVisibility(null)
              Menu.setApplicationMenu(null)
            }
          }
        })
        console.log(LoadMapsFromDirectory())
      })
    } else {
      console.log("First launch: Initalizing as Installed")
      app.whenReady().then(() => {
        Installer.StartInstaller()
      })
    }
}