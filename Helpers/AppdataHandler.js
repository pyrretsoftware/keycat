const fs = require('fs');
const SettingsTemplate = require("../Templates/Settings.json.js")
const fspromise = require('fs/promises');
const path = require('path');

function CheckInstall(Location) {
    if (fs.existsSync(Location + "/Songs") && fs.existsSync(Location + "/SongsExtractionTemp") && fs.existsSync(Location + "/Settings.json")) {
        return true
    } else {
        return false
    }
}
function CheckBarelyFunctionalInstall(Location) {

    if (fs.existsSync( path.join(Location , "Songs"))) {
        return true
    } else 
    {
        return false
    }
 }
async function CreateInstall(Location, Type) {
    if (!CheckInstall(Location)) {
        fs.mkdirSync(Location + "/Songs")
        fs.mkdirSync(Location + "/SongsExtractionTemp")
        let settingsfile = SettingsTemplate
        settingsfile["Type"] == Type
        const stringifiedjson = JSON.stringify(settingsfile)
        await fs.writeFileSync(Location + '/Settings.json', stringifiedjson)
    } else {
        return "Could not create files: An installation is already present. Line 14, Helpers/AppdataHelper.js"
    }
}
module.exports = {CheckInstall, CreateInstall , CheckBarelyFunctionalInstall}