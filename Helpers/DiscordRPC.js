const { Settings } = require("./ReadSettings");
const fetch = require('node-fetch');

let client

if (Settings["DiscordRPCEnabled"]) {
     client = new (require("easy-presence").EasyPresence)("1230573932890034206"); // replace this with your Discord Client ID.    
}

const StartTime = new Date()

async function ChangeRPC(state, keycatonlineuser) {
    if (!Settings["DiscordRPCEnabled"]) return
    let pfpurl = "logo"
    let usertext = "Not logged in with Keycat Online"
    let profilebuttons = []
    if (keycatonlineuser) {
        const res = await fetch("https://auth.axell.me/keycat_api/v1/profileinfo?username=" + keycatonlineuser)
        const resjson = await res.json()
        pfpurl = resjson["PfpUrl"]
        usertext = resjson["Username"] 
        profilebuttons = [
            {
                label: "view Keycat online profile",
                url: "https://keycat.axell.me/user/" + resjson["Username"]
            }
        ]
    }
    console.log(state)
    if (state["state"] == "idling") {
        client.setActivity({
            details: "In main menu",
            state: "Idling",
            assets: {
                large_image: "logo",
                large_text: state["songmeta"],
                small_image: pfpurl,
                small_text: usertext
            },
            timestamps: { start: StartTime },
            buttons : profilebuttons
        });
    } else if (state["state"] == "starting") {
        client.setActivity({
            details: "Starting Keycat...",
            state: "Starting",
            assets: {
                large_image: "logo",
                large_text: "Keycat",
                small_image: "logo",
                small_text: "Keycat"
            },
            timestamps: { start: StartTime },
            buttons : profilebuttons
        });
    } else if (state["state"] == "playing") {
        client.setActivity({
            details: "Playing " + state["songmeta"],
            state: "In-game",
            assets: {
                large_image: state["cover"],
                large_text: state["songmeta"],
                small_image: pfpurl,
                small_text: usertext
            },
            timestamps: { start: StartTime },
            buttons : profilebuttons
        });
    } else if (state["state"] == "choosing") {
        client.setActivity({
            details: "Choosing a map",
            state: "Idling",
            assets: {
                large_image: "logo",
                large_text: "Choosing a map",
                small_image: pfpurl,
                small_text: usertext
            },
            timestamps: { start: StartTime },
            buttons : profilebuttons
        });
    } 
    client.on("connected", () => {
        ChangeRPC({
            "state" : "starting"
        }, "logo")
    });
}
module.exports = {ChangeRPC}