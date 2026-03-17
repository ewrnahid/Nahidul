const delay = ms => new Promise(res => setTimeout(res, ms));

module.exports = {
  config: {
    name: "refresh2",
    version: "1.0.1",
    author: "Naim",
    cooldowns: 3,
    description: "Admin only emoji refresh animation (max 50)",
    category: "group" // ✅ must be defined
  },

  run: async function({ api, event, args }) {
    const adminIDs = ["61585368534877"]; // 👑 Abbu UID
    if (!adminIDs.includes(event.senderID)) {
      return api.sendMessage("❌ Only admin can use this command!", event.threadID);
    }

    let amount = parseInt(args[0]) || 5;
    if (amount > 50) amount = 50;

    const emojis = ["🖤","❤","💛","💚","💙","💜"];

    for (let i = 0; i < amount; i++) {
      for (const e of emojis) {
        await api.sendMessage(`${e}\n`.repeat(4), event.threadID);
        await delay(500); // half-second between emojis
      }
      await api.sendMessage(`✨ Refresh #${i + 1} complete ✨`, event.threadID);
      await delay(300);
    }

    return api.sendMessage("✅ All refresh animations done!", event.threadID);
  }
};
