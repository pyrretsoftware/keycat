const { dialog } = require('electron'); 
const { app } = require('electron/main');
const fs = require('fs')
const { spawn } = require("child_process");
const uninstalloptions = {
    type: 'question',
    buttons: ['No', 'Yes'],
    defaultId: 2,
    title: 'Are you sure you want to Uninstall Keycat?',
    message: 'All of your maps will be deleted.'
};

const erroroptions = {
    type: 'error',
    buttons: ['Exit'],
    title: 'Uninstallation Failed',
    message: 'The uninstaller could not safely remove keycat. Please remove the files manually.'
}
function UninstallFromLocation(Location, ConfirmWithUser) {
    if (ConfirmWithUser) {
        dialog.showMessageBox(null, uninstalloptions, (response) => {
        if (response == 0) {
            return
        } else {
            if (Location.split("/")[Location.split("/") - 1] == "Keycat") {
                if (process.platform != "win32") {
                    spawn(`sleep 2 && rm -rf ` + Location + ` && notify-send "Uninstallation complete."`, {
                        shell: true
                    });
                 } else {
                    spawn(`timeout 2 & rmdir /s /q ` + Location + ` & echo Uninstall Complete & pause`, {
                        shell: true
                    });
                 }
            } else {
                dialog.showMessageBox(null, erroroptions, (response) => {
                    app.exit()
                });
            }
        }
        });
    } else {
        if (Location.split("/")[Location.split("/") - 1] == "Keycat") {
            if (process.platform != "win32") {
                spawn(`sleep 2 && rm -rf ` + Location + ` && notify-send "Uninstallation complete."`, {
                    shell: true
                });
             } else {
                spawn(`timeout 2 & rmdir /s /q ` + Location + ` & echo Uninstall Complete & pause`, {
                    shell: true
                });
             }
        } else {
            dialog.showMessageBox(null, erroroptions, (response) => {
                app.exit()
            });
        }
    }
}
module.exports = {UninstallFromLocation}