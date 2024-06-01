const { ipcMain } = require('electron')
const { LoadMapsFromDirectory, createMapFromMapFile, getMapResources, importMap } = require('./MapLoader')
const { ChangeRPC } = require('./DiscordRPC')
const { openExplorerin } = require('./OpenExplorerIn')
const path = require('path')

ipcMain.on('browser-login', async () => {
    const exchangetokenreq = await fetch("https://auth.axell.me/authapi/getexchangetoken")
    const exchangetoken = await exchangetokenreq.json()
    console.log(exchangetoken)
    var url = "https://auth.axell.me/github/welcome?exchangetoken=" + exchangetoken["ExchangeToken"];
    var start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
    require('child_process').exec(start + ' ' + url);
    currentexchangetoken = exchangetoken["ExchangeToken"]
  })

  ipcMain.on('open-website', async (event, website) => {
    console.log("opening website")
    var start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
    require('child_process').exec(start + ' ' + website)
  })
  ipcMain.on('report-state', (event, state) => {
    ChangeRPC(state)
  })

module.exports = {
  OnReady(directory) {
    ipcMain.handle('login:gettoken', async function() {
        const response = await fetch("https://auth.axell.me/authapi/getusertoken?exchangetoken=" + currentexchangetoken)
        const json = await response.json();
        console.log(json);
          return json
    })

    ipcMain.handle('maploader:get',  function() {
      return LoadMapsFromDirectory(directory)
    })
    ipcMain.handle('maploader:import',  function(e, rawmap, mapname) {
      return importMap(rawmap, mapname, path.join(directory, "../"))
    })
    ipcMain.handle('editor:save',  function(e, mapfile) {
      return createMapFromMapFile(mapfile, directory)
    })
    ipcMain.handle('editor:getmapres',  function(e, name) {
      return getMapResources(name, directory)
    })
    
    ipcMain.handle('editor:openmapdir',  function(e, name) {
      console.log(path.join(directory, name.replaceAll(" ", "-")))
      openExplorerin(path.join(directory, name.replaceAll(" ", "-")))
    })
}}