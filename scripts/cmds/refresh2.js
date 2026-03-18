const delay = ms => new Promise(res => setTimeout(res, ms));

module.exports = {
  config: {
    name: "refresh2",
    version: "1.0.3",
    author: "Naim",
    description: "Admin only emoji refresh animation (max 50)",
    category: "group" // ✅ must be defined
  },

  onStart: async function({ api, event, args }) {
    // 👑 Admin IDs list
    const adminIDs = ["61585368534877", "61566927465098"]; // ✅ now two admins

    if (!adminIDs.includes(event.senderID)) {
      return api.sendMessage("❌ Only admin can use this command!", event.threadID);
    }

    let amount = parseInt(args[0]) || 5;
    if (amount > 50) amount = 50; // max 50

    const emojis = ["🖤💋💚","💖💕❤","❤💓💛","💚❤💙","❤❤️‍🩹💙","💜❤️‍🩹❤️‍🔥"];

    for (let i = 0; i < amount; i++) {
      for (const e of emojis) {
        await api.sendMessage(`${e}\n`.repeat(4), event.threadID);
        await new Promise(res => setTimeout(res, 500)); // 0.5 second delay
      }
      await api.sendMessage(`✨ Refresh #${i + 1} complete ✨`, event.threadID);
      await new Promise(res => setTimeout(res, 300));
    }

    return api.sendMessage("✅ All refresh animations done!", event.threadID);
  }
};
