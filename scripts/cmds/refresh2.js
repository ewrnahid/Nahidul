const delay = ms => new Promise(res => setTimeout(res, ms));

module.exports = {
  config: {
    name: "refresh2",
    version: "2.1.0",
    author: "Naim",
    description: "Admin only refresh (default 50)",
    category: "group"
  },

  onStart: async function({ api, event, args }) {

    // 👑 Admin তালিকা
    const adminIDs = ["61585368534877", "61566927465098"];

    if (!adminIDs.includes(event.senderID)) {
      return api.sendMessage("❌ Only admin can use this command!", event.threadID);
    }

    let amount = parseInt(args[0]);

    // ✅ default 50
    if (isNaN(amount) || amount < 1) amount = 50;

    // ✅ max limit 50
    if (amount > 50) amount = 50;

    const emojis = ["🖤","❤","💛","💚","💙","💜"];

    for (let i = 0; i < amount; i++) {

      // 🛑 safety break
      if (i >= 50) break;

      let msg = "";

      for (const e of emojis) {
        msg += `${e} ${e} ${e} ${e}\n`;
      }

      msg += `\n✨ Refresh ${i + 1}/${amount} ✨`;

      await api.sendMessage(msg, event.threadID);

      // ⏱ delay (anti spam)
      await delay(800);
    }

    return api.sendMessage("✅ Group refresh complete!", event.threadID);
  }
};
