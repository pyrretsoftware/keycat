const { ipcMain } = require('electron')
ipcMain.on('browser-login', async () => {
    const exchangetokenreq = await fetch("https://auth.axell.me/authapi/getexchangetoken")
    const exchangetoken = await exchangetokenreq.json()
    console.log(exchangetoken)
    var url = "https://auth.axell.me/github/welcome?exchangetoken=" + exchangetoken["ExchangeToken"];
    var start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
    require('child_process').exec(start + ' ' + url);
    currentexchangetoken = exchangetoken["ExchangeToken"]
  })
module.exports = { OnReady() {
    ipcMain.handle('login:gettoken', async function() {
        const response = await fetch("https://auth.axell.me/authapi/getusertoken?exchangetoken=" + currentexchangetoken)
        const json = await response.json();
        console.log(json);
          return json
      })
}}