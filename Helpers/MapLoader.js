const fs = require('fs');
const path = require('node:path')
const extract = require('extract-zip');
const crypto = require('crypto')

function LoadMapsFromDirectory(directory) {
    if (fs.existsSync(directory)) {
        let maps = {}
        console.log("Reading maps from " + directory)
        const subdirs = fs.readdirSync(directory).filter(function (file) {
            return fs.statSync(directory+'/'+file).isDirectory();
          });
          
        subdirs.forEach(subdir => {
            console.log("Found map "+ subdir)
            let mapfile = JSON.parse(fs.readFileSync(path.join(directory, subdir, 'mapfile.json')))
            if (mapfile["metadata"]["coverimage"].startsWith("./")) {
                let thing = mapfile["metadata"]["coverimage"].replace("./", "")
                mapfile["metadata"]["coverimage"] = "file://" + path.join(directory, subdir, mapfile["metadata"]["coverimage"])
            }
            if (mapfile["audio"].startsWith("./")) {
                let thing2 = mapfile["audio"].replace("./", "")
                mapfile["audio"] = "file://" + path.join(directory, subdir, mapfile["audio"])
            }
            maps[subdir] = mapfile
        });
        return maps
    } else {
        return false;
    }
}
function base64ToBytes(base64) {
    const binString = atob(base64);
    return Uint8Array.from(binString, (m) => m.codePointAt(0));
  }
  
async function importMap(rawmap, mapname, directory) {
    if (fs.existsSync(path.join(directory, "SongsExtractionTemp"))) {
        const filename = "import-map-temp-" + crypto.randomBytes(20).toString('hex') + ".zip"
        const buffer = Buffer.from(rawmap, 'base64');
        console.log(buffer)
        fs.writeFileSync(path.join(directory, "SongsExtractionTemp", filename), buffer)
        await extract(path.join(directory, "SongsExtractionTemp", filename),
        {
            dir: path.join(directory, "Songs", mapname.replaceAll(".kyct", ""))
        })
        console.log("yes")
        return true
    } else {
        console.log("no songsextactiontemo")
        return false
    }
    
}
function createMapFromMapFile(mapfile, directory) {
    console.log(mapfile)
    if (fs.existsSync(directory)) {
        if (!fs.existsSync(path.join(directory, mapfile["metadata"]["title"].replaceAll(" ", "-")))) {
            fs.mkdirSync(path.join(directory, mapfile["metadata"]["title"].replaceAll(" ", "-")))
        }
        fs.writeFileSync(path.join(directory, mapfile["metadata"]["title"].replaceAll(" ", "-"), "mapfile.json"), JSON.stringify(mapfile))
        return true
    } else {
        return false
    }
}
function getMapResources(mapname, directory) {
    if (fs.existsSync(path.join(directory, mapname.replaceAll(" ", "-")))) { 
        return fs.readdirSync(path.join(directory, mapname.replaceAll(" ", "-")))
    } else {
        return false
    }
}

function difficultyToKaiogff(mapfile, difficulty) {
    return  {
        "info" : "Keycat All-in-one gameplay file format (KAIOGFF)",
        "audio" : mapfile["audio"],
        "audiolocation" : mapfile["audiolocation"],
        "metadata" : mapfile["metadata"],
        "timings" : mapfile["difficulties"][difficulty]["timings"],
        "text" : mapfile["difficulties"][difficulty]["text"],
    }
}
module.exports = {LoadMapsFromDirectory, difficultyToKaiogff, createMapFromMapFile, getMapResources, importMap}