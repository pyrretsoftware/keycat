let selectedoption = ""
console.log("loaded scirpt")


document.getElementById("mb-file").onclick = async function () {
    switch (document.getElementById("mb-file").value) { 
        case "file-exit": 
            console.log("file-quit")
            window.electronAPI.quitEditor()
            break
        case "file-open": 
            const req = await window.electronAPI.getMaps()
            let keys
            Object.keys(req).forEach(key => {
                keys += `\n<option>` + key +`</option>`
            });
            createPopup("Open map", {
                "Map" : "select"
            }, function (popup) {
                mpc = req[popup["Map"]]
            }, {
                "Map" : keys
            })
            break
        case "file-save" : 
            if (mpc["metadata"]["title"]) {
                SaveMap()
            } else {
                alert("Could not create a map directory with that name. Try giving your map a name by going to Metadata > Edit")
            }
            break
    }
    document.getElementById("mb-file").value = "mb-label"
}
document.getElementById("mb-meta").onclick = async function () {
    switch (document.getElementById("mb-meta").value) { 
        case "meta-edit" :
            createPopup("Edit song metadata", {
                "Title" : "text",
                "Artist" : "text",
                "Album" : "text",
                "Mapper" : "text",
                "Mapper link" : "text"
            }, function(popup) {
                let newmmpc = mpc
                newmmpc["metadata"]["title"] = popup.Title
                newmmpc["metadata"]["artist"] = popup.Artist
                newmmpc["metadata"]["album"] = popup.Album
                newmmpc["metadata"]["mapper"] = popup.Mapper
                newmmpc["metadata"]["mapperlink"] = popup["Mapper link"]

                ChangeMapFile(newmmpc)
            })
            break
        case "meta-editres" :
            if (!mpc["metadata"]["title"]) {
                alert("Please choose a title first.")
                break
            }
            const files = await window.electronAPI.getMapResources(mpc["metadata"]["title"])
            console.log(files)
            if (!files) {
                alert("Could not find a map directory with that name. Try saving your map by going to File > Save")
                break
            }
            let audios
            let images
            files.forEach(file => {
                if (file.split(".").pop() == "mp3") {
                    audios += `\n<option>` + file +`</option>`
                } else if (file.split(".").pop() == "webp" || file.split(".").pop() == "png" || file.split(".").pop() == "jpg" || file.split(".").pop() == "jpeg") {
                    images += `\n<option>` + file +`</option>`
                }
            });
            if(!audios && !images) {
                alert("Could not find any resources in map directory. Try opening the map directory by going to Metadata > Open map directory and putting some files in the folder.")
                break
            }
            createPopup("Edit map resources", {
                "Song" : "select",
                "Cover image" : "select"
            }, function(popup) {
                let newmmpc = mpc
                newmmpc["metadata"]["coverimage"] = popup["Cover image"]
                newmmpc["audio"] = popup["Song"]
                ChangeMapFile(newmmpc)
            }, {
                "Song" : audios,
                "Cover image" : images
            })
            break
        case "meta-openmapdir" :
            if (!mpc["metadata"]["title"]) {
                alert("Please choose a title first.")
                break
            }
            window.electronAPI.openMapDir(mpc["metadata"]["title"])
            break
    }
    document.getElementById("mb-meta").value = "mb-label"
}
document.getElementById("mb-mapping").onclick = function () {
    switch (document.getElementById("mb-mapping").value) { 
    }
    document.getElementById("mb-mapping").value = "mb-label"
}