const { app, BrowserWindow, } = require('electron')
const path = require('node:path')
const fetch = require('node-fetch')
const { RegisterRPC } = require('../Helpers/IPC')

const releasesapi = "https://api.github.com/repos/pyrretsoftware/keycat/releases"

const installlocations = {
  "win32" : 'C:/Program Files (x86)/',
  "linux" : '/opt/'
}
const { ipcMain } = require('electron')

async function StartInstaller() {
let InstallOptions = {}
let CurrentInstallationStage = 0
    const win = new BrowserWindow({
        width: 600,
        height: 450,
        autoHideMenuBar: true,
        icon: "keycat-logo-1000.png",
        webPreferences: {
          preload: __dirname + '/Preload.js'
        }
      })
      win.setResizable(true)
      win.loadFile("./Installer/index.html")
      win.webContents.on('did-finish-load', function() {
        console.log("didfinishload fired")
        console.log("recommended install location is " + installlocations[process.platform])
        win.webContents.executeJavaScript(`document.getElementById("location").value = "${installlocations[process.platform]}"`);

      });
      console.log("registering rpc")
      ipcMain.handle('installation:exit', async function() {
        app.exit();
       })

      ipcMain.handle('installation:continue', async function() {
        if (CurrentInstallationStage == 0) {
          const location = await win.webContents.executeJavaScript(`document.getElementById("location").value`);
          const binarytype = await win.webContents.executeJavaScript(`document.querySelector('input[name="binarytype"]:checked').id`);
          const release = await win.webContents.executeJavaScript(`document.getElementById("release").options[document.getElementById("release").selectedIndex].text;`);
          const source = await win.webContents.executeJavaScript(`document.querySelector('input[name="wheretoget"]:checked').id`);
          InstallOptions["Location"] = location
          if (binarytype == "zip") {
            InstallOptions["BinaryType"] = "Zip"
          } else {
            InstallOptions["BinaryType"] = "Self-Contained"
          }
          InstallOptions["ReleaseName"] = release
          if (source == "github") {
            InstallOptions["Source"] = "GitHub"
          } else if (source == "axellcd") {
            InstallOptions["Source"] = "AxellCD"
          } else {
            InstallOptions["Source"] = "InstallBinary"
          }

        }
          return true
      })

}
module.exports = {StartInstaller}