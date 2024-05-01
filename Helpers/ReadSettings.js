const fs = require('fs');

let InstallLocation = __dirname.replaceAll("\\", "/").replace("resources/app.asar", "");

const SettingsContent = fs.readFileSync(InstallLocation + "/Settings.json");
const Settings = JSON.parse(SettingsContent)

module.exports = {Settings}