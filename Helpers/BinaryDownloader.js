const fetch = require('node-fetch');
const fs = require('fs');
const http = require('https');
const path = require('path');
const extract = require('extract-zip');
const { CreateInstall } = require('./AppdataHandler');
const Downloader = require("nodejs-file-downloader");
const { shell } = require('electron');

async function DownloadRelease(sendlog, options, completeinstall, showerror) {
    if (!fs.existsSync(options["Location"] + "/Keycat")) {
            //Figure out platform
    process.noAsar = true; 
    let PlatformInfo = {
        "Searchname" : "Unknown",
        "PrettyName" : "Unknown",
        "Name" : "Unknown"
    }
    if (process.platform === 'win32') {
        PlatformInfo["Searchname"] = "win32";
        PlatformInfo["Name"] = "win32";
        PlatformInfo["PrettyName"] = "Microsoft Windows";
    } else if (process.platform == 'linux') { 
        //this is stolen straight for stack overflow lol

        fs.readFile('/etc/os-release', 'utf8', (err, data) => {
            if (err) throw err
            const lines = data.split('\n')
            const releaseDetails = {}
            lines.forEach((line, index) => {
              // Split the line into an array of words delimited by '='
              const words = line.split('=')
              releaseDetails[words[0].trim().toLowerCase()] = words[1].trim()
            })
                PlatformInfo["Searchname"] = "linux-generic"
            
            PlatformInfo["Name"] = releaseDetails["id"]
            PlatformInfo["PrettyName"] = releaseDetails["id"]
          });
    } else {
        sendlog("Fatal: Unknown/Unsupported platform. Supported platforms are Debian/Ubuntu, Windows and x64 Linux systems.");
        throw new Error("Fatal: Unknown/Unsupported platform. Supported platforms are Debian/Ubuntu, Windows and x64 Linux systems.")
    }

    if (options["Source"] == "GitHub") {
        let allreleases = await fetch("https://api.github.com/repos/pyrretsoftware/keycat/releases")
        allreleases = await allreleases.json()
        let loopbreak = true;

        sendlog("Searching through releases for " + options["Release"])
        allreleases.forEach(release => {
            if (release["name"] == options["Release"] && loopbreak) {
                loopbreak = false;
                sendlog("Searching through release assets trying to find " + options["BinaryType"] + " Matching platform " + PlatformInfo["PrettyName"] + "(" + PlatformInfo["Name"] + "," + PlatformInfo["Searchname"] + ")");

                let binaryname = PlatformInfo["Searchname"] + "-update.zip"

                //if your wondering why im using this whole platforminfo thingy instead of just checking process.platform, its because im too lazy to change it
                //when im already writing a comment anyway, i know that a zip file isnt a binary and that i shouldnt call it that but i wrote the namings of this at 3am.
                if (options["BinaryType"] == "Zip") {
                    
                } else {
                    sendlog("FATAL: Binary types other than zip are not supported anymore due to performance and compatibility issues");
                    throw new Error("FATAL: Binary types other than zip are not supported anymore due to performance and compatibility issues")
                }
                let loopbreak2 = true
                release["assets"].forEach(async releaseasset =>  {
                    if (releaseasset["name"] == binaryname && loopbreak2) {
                        loopbreak2 = false
                        fs.mkdirSync(path.join(options["Location"], "Keycat"))
                        const zip = fs.createWriteStream(path.join(path.join(options["Location"], "Keycat"), "keycat.zip"));
                        sendlog("Created Keycat Directory.")
                        sendlog("Downloading Keycat.")
                        console.log(releaseasset["browser_download_url"])
                        const downloader = new Downloader({
                            url: releaseasset["browser_download_url"], //If the file name already exists, a new file with the name 200MB1.zip is created.
                            directory: path.join(options["Location"], "Keycat"), //This folder will be created, if it doesn't exist.   
                          });
                        const downloadreq = await downloader.download()
                            await extract(path.join(path.join(options["Location"], "Keycat"), binaryname), { dir: path.join(options["Location"], "Keycat") })
                            sendlog("Downloaded and unzipped keycat");
                            CreateInstall(path.join(options["Location"], "Keycat"), "Installed");
                            if (PlatformInfo["SearchName"] == "win32") {
                                fs.mkdirSync(path.join(process.env.APPDATA, ["Microsoft", "Windows", "Start Menu", "Programs", "Keycat"]))
                                shell.writeShortcutLink(path.join(process.env.APPDATA, ["Microsoft", "Windows", "Start Menu", "Programs", "Keycat", "Keycat Game Client.lnk"]), {
                                    target : path.join(options["Location"], ["Keycat", "keycat-client.exe"]), 
                                    cwd : path.join(options["Location"], "Keycat"),
                                    description : "Key based rhythm game"
                                })
                            }
                            sendlog("Installation Successful.");
                            completeinstall()
        
                        
                    }
                });
            }
        });
    }
    } else {
        showerror("Keycat is already installed.")
    }
}
module.exports = {DownloadRelease}