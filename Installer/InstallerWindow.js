const { app, BrowserWindow, } = require('electron')
const path = require('node:path')
const fetch = require('node-fetch')
const { RegisterRPC } = require('../Helpers/IPC')

const releasesapi = "https://api.github.com/repos/pyrretsoftware/keycat/releases"


async function StartInstaller() {
let InstallOptions = {}
let CurrentInstallationStage = 0
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
      const releases = await fetch(releasesapi)
      const releasesjson = await releases.json()
      win.webContents.on('did-finish-load', function() {
        releasesjson.forEach(release => {
          win.webContents.executeJavaScript(`
          const newelement = document.createElement('option');
          newelement.classList.add('roboto-regular');
          newelement.classList.add('installer-text');
          newelement.InnerHTML = '${release["name"]}'
          document.getElementById('release').appendChild(newelement);
          `);
        });
      });
      RegisterRPC('installation-continue', async function () {
        if (CurrentInstallationStage == 0) {
          
        }
      })

}
module.exports = {StartInstaller}