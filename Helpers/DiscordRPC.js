const client = new (require("easy-presence").EasyPresence)("1230573932890034206"); // replace this with your Discord Client ID.
client.on("connected", () => {
    console.log("Hello,", client.environment.user.username);
});

client.setActivity({
  details: "",
  state: "Idling",
  assets: {
      large_image: "rblxrp",
      large_text: "EasyPresence",
      small_image: "octocat",
      small_text: "https://github.com/rblxrp/easypresence"
  },
  buttons: [
      {
          label: "Visit on GitHub",
          url: "https://github.com/rblxrp/easypresence"
      }
  ],
  party: {
      id: "1234567890",
      size: [1, 10]
  },
  timestamps: { start: new Date() }
});