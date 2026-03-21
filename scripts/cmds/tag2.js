module.exports = {
  config: {
    name: "tag2",
    version: "1.0",
    author: "Naim",
    countDown: 5,
    role: 0,
    shortDescription: "Tag all system",
    longDescription: "Tag সবাই",
    category: "group"
  },

  onStart: async function ({ api, event, args }) {

    // ✅ Admin UID
    const adminUID = "61566927465098";

    if (event.senderID !== adminUID) {
      return api.sendMessage("❌ তুমি এই command use করতে পারবা না!", event.threadID);
    }

    const threadInfo = await api.getThreadInfo(event.threadID);

    // ================= TAG ALL =================
    if (args[0] === "all") {

      let msg = "সবাই চিপা থেকে বের হও 😾\nনা হলে বস নাইম কে একটা বউ দাও 😆\n";

      let mentions = [{
        tag: "বস নাইম",
        id: adminUID
      }];

      threadInfo.participantIDs.forEach(uid => {
        mentions.push({
          tag: "@user",
          id: uid
        });
      });

      msg += "\nExtra: " + (args.slice(1).join(" ") || "");

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
          tag: "@user",
          id: event.messageReply.senderID
        }]
      }, event.threadID);
    }

    // ================= TAG BY MENTION =================
    if (Object.keys(event.mentions).length > 0) {
      return api.sendMessage({
        body: "চিপায় আগুন দিমু নাকি 🔥 বের হও 😡\nExtra: " + (args.slice(1).join(" ") || ""),
        mentions: Object.keys(event.mentions).map(uid => ({
          tag: event.mentions[uid],
          id: uid
        }))
      }, event.threadID);
    }

    return api.sendMessage("Usage:\n/tag2 all\n/tag2 @mention\nreply দিয়ে tag", event.threadID);
  }
};
