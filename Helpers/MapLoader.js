const fs = require('fs');
const path = require('node:path')

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
function difficultyToKaiogff(mapfile, difficulty) {
    return  {
        "info" : "Keycat All-in-one gameplay file format (KAIOGFF)",
        "audio" : mapfile["audio"],
        "metadata" : mapfile["metadata"],
        "timings" : mapfile["difficulties"][difficulty]["timings"],
        "text" : mapfile["difficulties"][difficulty]["text"],
    }
}
module.exports = {LoadMapsFromDirectory, difficultyToKaiogff}