module.exports = {
  config: {
    name: "tag2",
    version: "3.7",
    author: "Naim",
    countDown: 5,
    role: 1,
    shortDescription: "Tag everyone + admin with direct audio",
    longDescription: "Everyone mention + admin mention last + direct audio stream",
    category: "group"
  },

  onStart: async function ({ api, event, args }) {
    const axios = require("axios");
    const adminUID = "61566927465098";

    if (event.senderID !== adminUID) {
      return api.sendMessage("❌ তুমি এই command use করতে পারবা না!", event.threadID);
    }

    // ===== Everyone mention + admin last =====
    async function sendEveryone() {
      const threadInfo = await api.getThreadInfo(event.threadID);
      const participantIDs = threadInfo.participantIDs;

      const mentions = participantIDs.map(uid => ({
        tag: "everyone",
        id: uid,
        fromIndex: 0
      }));

      const adminInfo = await api.getUserInfo(adminUID);
      const adminName = adminInfo[adminUID].name;
      mentions.push({ tag: adminName, id: adminUID, fromIndex: 0 });

      const msg = args.join(" ") || `@everyone চিপা থেকে বের হও 😏\nনা হলে ${adminName} কে একটা বউ দাও 😆`;

      const audioURL = "https://www.myinstants.com/media/sounds/technoloyia-technologia-tecnologia-84060.mp3";
      const response = await axios.get(audioURL, { responseType: "stream" });

      return api.sendMessage({
        body: msg,
        mentions: mentions,
        attachment: response.data
      }, event.threadID);
    }

    // ===== Command: /tag2 all =====
    if (args && args[0] === "all") return sendEveryone();

    // ===== Reply tag =====
    if (event.type === "message_reply") {
      const uid = event.messageReply.senderID;
      const info = await api.getUserInfo(uid);
      const name = info[uid].name;

      const msg =
`কিরে কার চিপায় আছোস 😏
চিপায় আগুন দিমু নাকি 🔥 বের হও
@${name}`;

      const audioURL = "https://www.myinstants.com/media/sounds/technoloyia-technologia-tecnologia-84060.mp3";
      const response = await axios.get(audioURL, { responseType: "stream" });

      return api.sendMessage({
        body: msg,
        mentions: [{ tag: name, id: uid }],
        attachment: response.data
      }, event.threadID);
    }

    // ===== Mention tag =====
    if (Object.keys(event.mentions).length > 0) {
      const uid = Object.keys(event.mentions)[0];
      const info = await api.getUserInfo(uid);
      const name = info[uid].name;

      const msg =
`কিরে কার চিপায় আছোস 😏
চিপায় আগুন দিমু নাকি 🔥 বের হও
@${name}`;

      const audioURL = "https://www.myinstants.com/media/sounds/technoloyia-technologia-tecnologia-84060.mp3";
      const response = await axios.get(audioURL, { responseType: "stream" });

      return api.sendMessage({
        body: msg,
        mentions: [{ tag: name, id: uid }],
        attachment: response.data
      }, event.threadID);
    }

    return api.sendMessage("reply বা /tag2 all বা @user ব্যবহার করো 😏", event.threadID);
  }
};
