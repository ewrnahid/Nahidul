module.exports = {
  config: {
    name: "tag2",
    version: "4.0",
    author: "Naim",
    countDown: 5,
    role: 1,
    shortDescription: "Tag everyone + admin + reply support",
    longDescription: "Everyone mention + admin mention last + reply/mention support + optional audio/image",
    category: "group"
  },

  onStart: async function ({ api, event, args }) {
    const axios = require("axios");
    const adminUID = "61566927465098";

    // Only admin can use this command
    if (event.senderID !== adminUID) {
      return api.sendMessage("❌ তুমি এই command use করতে পারবা না!", event.threadID);
    }

    // ===== Send Everyone + Admin Tag =====
    async function sendEveryoneTag() {
      const threadInfo = await api.getThreadInfo(event.threadID);
      const participantIDs = threadInfo.participantIDs;

      // Everyone mention
      const mentions = participantIDs.map(uid => ({
        tag: "everyone",
        id: uid,
        fromIndex: 0
      }));

      // Admin mention last
      const adminInfo = await api.getUserInfo(adminUID);
      const adminName = adminInfo[adminUID].name;
      mentions.push({ tag: adminName, id: adminUID, fromIndex: 0 });

      // Message
      const body = args.join(" ") || `@everyone চিপা থেকে বের হও 😏\nনা হলে ${adminName} কে একটা বউ দাও 😆`;

      // Optional: Direct audio or Imgur image
      const audioURL = "https://www.myinstants.com/media/sounds/technoloyia-technologia-tecnologia-84060.mp3";
      const response = await axios.get(audioURL, { responseType: "stream" });

      return api.sendMessage({
        body: body,
        mentions: mentions,
        attachment: response.data // Audio stream, no local save
      }, event.threadID);
    }

    // ===== Reply Tag Support =====
    async function sendReplyTag(uid) {
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

    // ===== Command Execution =====
    // /tag2 all
    if (args && args[0] === "all") {
      return sendEveryoneTag();
    }

    // Reply message
    if (event.type === "message_reply") {
      return sendReplyTag(event.messageReply.senderID);
    }

    // Mention tag
    if (Object.keys(event.mentions).length > 0) {
      const uid = Object.keys(event.mentions)[0];
      return sendReplyTag(uid);
    }

    return api.sendMessage("reply বা /tag2 all বা @user ব্যবহার করো 😏", event.threadID);
  }
};
