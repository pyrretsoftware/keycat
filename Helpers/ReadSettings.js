const fs = require('fs');

let Settings = {}
let InstallLocation = __dirname.replaceAll("\\", "/").replace("resources/app.asar", "").replace("Helpers" , "");

console.log(__dirname.replaceAll("\\", "/").replace("Helpers" , ""))

if (!process.env.PORTABLE_EXECUTABLE_FILE && process.argv[1] != "installer") {
    const SettingsContent = fs.readFileSync(InstallLocation + "/Settings.json");
    Settings = JSON.parse(SettingsContent)
}

module.exports = {Settings}