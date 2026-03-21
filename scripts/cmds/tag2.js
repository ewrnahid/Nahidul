module.exports = {
  config: {
    name: "tag2",
    version: "2.0",
    author: "Naim",
    countDown: 5,
    role: 0,
    shortDescription: "Tag all system",
    longDescription: "Tag সবাই",
    category: "group"
  },

  onStart: async function ({ api, event, args }) {

    const adminUID = "61566927465098";

    if (event.senderID !== adminUID) {
      return api.sendMessage("❌ তুমি এই command use করতে পারবা না!", event.threadID);
    }

    const threadInfo = await api.getThreadInfo(event.threadID);

    // 👉 তোমার real name আনবো
    const userInfo = await api.getUserInfo(adminUID);
    const fullName = userInfo[adminUID].name;

    // ================= TAG ALL =================
    if (args[0] === "all") {

      let msg = "@everyone চিপা থেকে বের হও 😾\nনা হলে " + fullName + " কে একটা বউ দাও 😆";

      let mentions = [];

      // 👉 সবাইকে mention
      threadInfo.participantIDs.forEach(uid => {
        mentions.push({
          tag: "@everyone",
          id: uid
        });
      });

      // 👉 তোমার নাম দিয়ে আলাদা mention
      mentions.push({
        tag: fullName,
        id: adminUID
      });

      return api.sendMessage({
        body: msg,
        mentions: mentions
      }, event.threadID);
    }

    // ================= REPLY TAG =================
    if (event.type === "message_reply") {
      return api.sendMessage({
        body: "কিরে কার চিপায় আছোস 😏",
        mentions: [{
          tag: "user",
          id: event.messageReply.senderID
        }]
      }, event.threadID);
    }

    // ================= TAG BY MENTION =================
    if (Object.keys(event.mentions).length > 0) {
      return api.sendMessage({
        body: "চিপায় আগুন দিমু নাকি 🔥 বের হও 😡",
        mentions: Object.keys(event.mentions).map(uid => ({
          tag: event.mentions[uid],
          id: uid
        }))
      }, event.threadID);
    }

    return api.sendMessage("Usage:\n/tag2 all\n/tag2 @mention\nreply দিয়ে tag", event.threadID);
  }
};
