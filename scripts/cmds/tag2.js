module.exports = {
  config: {
    name: "tag2",
    version: "3.4",
    author: "Naim",
    countDown: 5,
    role: 0,
    shortDescription: "Tag everyone system",
    longDescription: "Tag all members + admin with profile pic",
    category: "group"
  },

  // ✅ args added here
  onStart: async function ({ api, event, args }) {

    const adminUID = "61566927465098";

    if (event.senderID !== adminUID) {
      return api.sendMessage("❌ তুমি এই command use করতে পারবা না!", event.threadID);
    }

    const axios = require("axios");

    // ===== FUNCTION =====
    async function sendEveryoneTag() {
      const threadInfo = await api.getThreadInfo(event.threadID);

      // Everyone mention
      let mentions = threadInfo.participantIDs.map(uid => ({
        tag: "everyone",
        id: uid
      }));

      // Admin mention last
      const adminInfo = await api.getUserInfo(adminUID);
      const adminName = adminInfo[adminUID].name;
      mentions.push({ tag: adminName, id: adminUID });

      // Admin profile picture
      const imgURL = `https://graph.facebook.com/${adminUID}/picture?width=512&height=512`;
      const img = (await axios.get(imgURL, { responseType: "stream" })).data;

      // Message: everyone + admin mention
      const msg =
`@everyone চিপা থেকে বের হও 😏
না হলে ${adminName} কে একটা বউ দাও 😆`;

      return api.sendMessage({
        body: msg,
        mentions: mentions,
        attachment: img
      }, event.threadID);
    }

    // ===== COMMAND =====
    if (args && args[0] === "all") { // ✅ check args
      return sendEveryoneTag();
    }

    // ===== REPLY TAG =====
    if (event.type === "message_reply") {
      const uid = event.messageReply.senderID;
      const info = await api.getUserInfo(uid);
      const name = info[uid].name;

      const imgURL = `https://graph.facebook.com/${uid}/picture?width=512&height=512`;
      const img = (await axios.get(imgURL, { responseType: "stream" })).data;

      const msg =
`কিরে কার চিপায় আছোস 😏
চিপায় আগুন দিমু নাকি 🔥 বের হও
@${name}`;

      return api.sendMessage({
        body: msg,
        mentions: [{ tag: name, id: uid }],
        attachment: img
      }, event.threadID);
    }

    // ===== MENTION TAG =====
    if (Object.keys(event.mentions).length > 0) {
      const uid = Object.keys(event.mentions)[0];
      const info = await api.getUserInfo(uid);
      const name = info[uid].name;

      const imgURL = `https://graph.facebook.com/${uid}/picture?width=512&height=512`;
      const img = (await axios.get(imgURL, { responseType: "stream" })).data;

      const msg =
`কিরে কার চিপায় আছোস 😏
চিপায় আগুন দিমু নাকি 🔥 বের হও
@${name}`;

      return api.sendMessage({
        body: msg,
        mentions: [{ tag: name, id: uid }],
        attachment: img
      }, event.threadID);
    }

    return api.sendMessage("reply বা /tag2 all বা @user ব্যবহার করো 😏", event.threadID);
  }
};
