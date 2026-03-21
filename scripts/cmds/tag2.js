module.exports = {
  name: "tag2",
  description: "Tag system with custom messages",
  author: "Naim",

  adminUIDs: ["61566927465098"],

  onStart: async function ({ api, event, args }) {

    if (!this.adminUIDs.includes(event.senderID)) {
      return api.sendMessage("❌ তুমি এই command use করতে পারবা না!", event.threadID);
    }

    const threadInfo = await api.getThreadInfo(event.threadID);

    // ================= TAG ALL =================
    if (args[0] === "all") {

      let msg = "সবাই চিপা থেকে বের হও 😾\nনা হলে ";
      msg += "বস নাইম কে একটা বউ দাও 😆\n"; // 👈 text

      let mentions = [{
        tag: "বস নাইম",
        id: "61566927465098" // 👈 তোমার UID mention
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

    return api.sendMessage("Usage:\n/tag all\n/tag @mention\nreply দিয়ে tag", event.threadID);
  }
};
