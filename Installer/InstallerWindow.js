const { app, BrowserWindow, Menu } = require('electron')
const path = require('node:path')
const fetch = require('node-fetch')
const { RegisterRPC } = require('../Helpers/IPC')

const releasesapi = "https://api.github.com/repos/pyrretsoftware/keycat/releases"

const { ipcMain } = require('electron')
const { DownloadRelease } = require('../Helpers/BinaryDownloader')



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
      win.setMenuBarVisibility(null)
      Menu.setApplicationMenu(null)
      win.setResizable(false)
      win.loadFile("./Installer/index.html")
      win.webContents.on('did-finish-load', function() {
        if (CurrentInstallationStage == 0) {
          console.log("didfinishload fired")
          console.log("recommended install location is " + process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share"))
          win.webContents.executeJavaScript(`document.getElementById("location").value = '${process.env.LOCALAPPDATA.replaceAll("\\", "/") || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")}'`);
        }

      });
      console.log("registering rpc")
      ipcMain.handle('installation:exit', async function() {
        app.exit();
       })

      ipcMain.handle('installation:continue', async function() {
        if (CurrentInstallationStage == 0) {
          CurrentInstallationStage = 1
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
          InstallOptions["Release"] = release
          if (source == "github") {
            InstallOptions["Source"] = "GitHub"
          } else if (source == "axellcd") {
            InstallOptions["Source"] = "AxellCD"
          } else {
            InstallOptions["Source"] = "InstallBinary"
          }
          win.loadFile("./Installer/installing.html")
          win.webContents.on('did-finish-load', function() {
            DownloadRelease(sendlog, InstallOptions, completeinstall, showerror)
          })
        }
          return true
      })

      function sendlog(log) {
        win.webContents.send('send-log', log)
        win.webContents.executeJavaScript("document.getElementById('progressbar').value += 12.5");
      }
      function completeinstall() {
        win.webContents.executeJavaScript("alert('Installation Finished'); window.electronAPI.Exit();");
      }
      function showerror(error) {
        win.webContents.executeJavaScript("alert('" + error  + "'); window.electronAPI.Exit();");
      }
}
module.exports = {StartInstaller}