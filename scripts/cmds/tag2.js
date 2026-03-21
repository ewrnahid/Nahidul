module.exports = {
  config: {
    name: "tag2",
    version: "4.3",
    author: "Naim",
    countDown: 5,
    role: 1,
    shortDescription: "Tag everyone + admin + reply support",
    longDescription: "Everyone mention + admin mention last + reply/mention support without audio",
    category: "group"
  },

  onStart: async function ({ api, event, args }) {
    const adminUID = "61566927465098";

    if (event.senderID !== adminUID) {
      return api.sendMessage("❌ তুমি এই command use করতে পারবা না!", event.threadID);
    }

    // ===== Everyone + Admin Tag =====
    async function sendEveryoneTag() {
      const threadInfo = await api.getThreadInfo(event.threadID);
      const participantIDs = threadInfo.participantIDs;

      let mentions = [];
      let body = "";

      // Everyone mention
      for (const uid of participantIDs) {
        const info = await api.getUserInfo(uid);
        const name = info[uid].name;
        body += `@${name} `;
        mentions.push({ tag: name, id: uid });
      }

      // Admin mention last
      const adminInfo = await api.getUserInfo(adminUID);
      const adminName = adminInfo[adminUID].name;
      body += `চিপা থেকে বের হও🤬😾\nনা হলে `@${adminName} কে একটা বউ দাও 😆`;
      mentions.push({ tag: adminName, id: adminUID });

      return api.sendMessage({
        body: body,
        mentions: mentions
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

      return api.sendMessage({
        body: msg,
        mentions: [{ tag: name, id: uid }]
      }, event.threadID);
    }

    // ===== Command Execution =====
    if (args && args[0] === "all") return sendEveryoneTag();

    if (event.type === "message_reply") return sendReplyTag(event.messageReply.senderID);

    if (Object.keys(event.mentions).length > 0) {
      const uid = Object.keys(event.mentions)[0];
      return sendReplyTag(uid);
    }

    return api.sendMessage("reply বা /tag2 all বা @user ব্যবহার করো 😏", event.threadID);
  }
};
