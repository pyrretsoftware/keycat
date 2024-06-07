let mpc = {
    "metadata" : {},
    "difficulties" : {}
}
let unsavedchanges = 0
function ChangeMapFile(changes) {
    mpc = changes
    unsavedchanges++
    document.getElementById("unsavedchanges").innerHTML = "You have " + unsavedchanges + " unsaved changes."
    document.getElementById("unsavedchanges").style.display = "block"
}
function SaveMap() {
    window.electronAPI.saveEditorMap(mpc)
    document.getElementById("unsavedchanges").style.display = "none"
}
let thingaudio
document.getElementsByClassName("playbutton").onclick = function() {
    
}
function requestMpcDataReload() {
    console.log("data reload requested")
    thingaudio = new Audio(mpc["audio"])
    setTimeout(500, function () { 
        document.getElementsByClassName("musicbar")[0].setAttribute("max", thingaudio.duration * 10)
    })
    
} 