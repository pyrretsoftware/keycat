const fetch = require('node-fetch');
const fs = require('fs');
const http = require('https');
const path = require('path');
const extract = require('extract-zip');
const { CreateInstall } = require('./AppdataHandler');


async function DownloadRelease(sendlog, options, completeinstall) {
    //Figure out platform
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
                release["assets"].forEach(releaseasset => {
                    if (releaseasset["name"] == binaryname && loopbreak2) {
                        loopbreak2 = false
                        fs.mkdirSync(path.join(options["Location"], "Keycat"))
                        const zip = fs.createWriteStream(path.join(path.join(options["Location"], "Keycat"), "keycat.zip"));
                        sendlog("Created Keycat Directory.")
                        sendlog("Downloading Keycat.")
                        const request = http.get(releaseasset["browser_download_url"], function(response) {
                            response.pipe(zip);
                            zip.on("finish", async () =>  {
                                zip.close();
                                await extract(path.join(path.join(options["Location"], "Keycat"), "keycat.zip"), { dir: path.join(options["Location"], "Keycat") })
                                sendlog("Downloaded and unzipped keycat");
                                CreateInstall(path.join(options["Location"], "Keycat"), "Installed")
                                sendlog("Installation Successful.");
                                completeinstall()
                            });
                        });
                    }
                });
            }
        });
    }
}
module.exports = {DownloadRelease}