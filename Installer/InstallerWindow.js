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
      win.setResizable(false)
      win.loadFile("./Installer/index.html")
      const releases = await fetch(releasesapi)
      const releasesjson = await releases.json()
      console.log(releasesjson)
      win.webContents.on('did-finish-load', function() {
        console.log("didfinishload fired")
        releasesjson.forEach(release => {
          console.log(release["name"])
          win.webContents.executeJavaScript(`
          console.log("is this even working")
          const newelement = document.createElement('option');
          newelement.classList.add('roboto-regular');
          newelement.classList.add('installer-text');
          newelement.InnerHTML = '` + release["name"] + `';
          document.getElementById('release').appendChild(newelement);
          `);
        });
        win.webContents.executeJavaScript(`document.getElementById("location").value = ${installlocations[process.platform]}`);

      });
      console.log("registering rpc")
      
      ipcMain.handle('login:gettoken', async function() {
        if (CurrentInstallationStage == 0) {
          const location = await win.webContents.executeJavaScript(`document.getElementById("location").value`);
        }
          return true
      })

}
module.exports = {StartInstaller}