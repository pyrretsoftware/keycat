const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('node:path')
const fetch = require('node-fetch')

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
   // win.setMenuBarVisibility(null)
    //Menu.setApplicationMenu(null)

    ipcMain.on('browser-login', async () => {
      const exchangetokenreq = await fetch("https://auth.axell.me/authapi/getexchangetoken")
      const exchangetoken = await exchangetokenreq.json()
      console.log(exchangetoken)
      var url = "https://auth.axell.me/github/welcome?exchangetoken=" + exchangetoken["ExchangeToken"];
      var start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
      require('child_process').exec(start + ' ' + url);
      console.log("yes?")
      currentexchangetoken = exchangetoken["ExchangeToken"]
    })
    
  }
  app.whenReady().then(() => {
    ipcMain.handle('login:gettoken', async function() {
      const response = await fetch("https://auth.axell.me/authapi/getusertoken?exchangetoken=" + currentexchangetoken)
      const json = await response.json();
      console.log(json);
        return json
    })
    createWindow()
    
  })