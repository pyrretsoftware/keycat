const { Settings } = require("./ReadSettings");

let client

if (Settings["DiscordRPCEnabled"]) {
     client = new (require("easy-presence").EasyPresence)("1230573932890034206"); // replace this with your Discord Client ID.    
}

const StartTime = new Date()

function ChangeRPC(state) {
    if (!Settings["DiscordRPCEnabled"]) return
    console.log(state)
    if (state["state"] == "idling") {
        client.setActivity({
            details: "In main menu",
            state: "Idling",
            assets: {
                large_image: state["cover"],
                large_text: state["songmeta"],
                small_image: "logo",
                small_text: "Keycat"
            },
            timestamps: { start: StartTime }
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
            timestamps: { start: StartTime }
        });
    } else if (state["state"] == "playing") {
        client.setActivity({
            details: "Playing " + state["songmeta"],
            state: "In-game",
            assets: {
                large_image: state["cover"],
                large_text: state["songmeta"],
                small_image: "logo",
                small_text: "Keycat"
            },
            timestamps: { start: StartTime }
        });
    } else if (state["state"] == "choosing") {
        client.setActivity({
            details: "Choosing a map",
            state: "Idling",
            assets: {
                large_image: "logo",
                large_text: "Choosing a map",
                small_image: "logo",
                small_text: "Keycat"
            },
            timestamps: { start: StartTime }
        });
    } 
    client.on("connected", () => {
        ChangeRPC({
            "state" : "starting"
        })
    });
}
module.exports = {ChangeRPC}