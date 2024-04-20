const { app, BrowserWindow, } = require('electron')
const path = require('node:path')

function StartInstaller() {
    const win = new BrowserWindow({
        width: 600,
        height: 450,
        autoHideMenuBar: true,
        icon: "keycat-logo-1000.png",
        webPreferences: {
          preload: __dirname + '/Installer/Preload.js'
        }
      })
      win.setResizable(false)
      win.loadFile("./Installer/index.html")
}
module.exports = {StartInstaller}