module.exports.config = {
  name: "refresh2",
  version: "5.0.0",
  hasPermssion: 0,
  credits: "Naim",
  description: "Admin only stylish refresh with emoji animation",
  commandCategory: "group",
  usages: "/refresh2 [amount]",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {

  // Only Admin IDs can use
  const adminIDs = ["61585368534877"]; // 👑 Abbu UID
  if (!adminIDs.includes(event.senderID)) {
    return api.sendMessage("❌ Only admin can use this command!", event.threadID);
  }

  // Amount input handling
  let amount = parseInt(args[0]);
  if (!amount || amount < 1) amount = 5;  // default 5
  if (amount > 50) amount = 50;           // max 50

  const colors = ["🖤","❤","💛","💚","💙","💜"];
  let msg = "";

  // Build emoji animation message
  for (let i = 0; i < amount; i++) {
    colors.forEach(color => {
      msg += `${color}\n`.repeat(4);  // 4 lines per color
    });
    msg += `\n✨ Group Refresh #${i+1} ✨\n\n`;
  }

  // Send the message
  await api.sendMessage(msg, event.threadID);

  // Final confirmation
  setTimeout(() => {
    api.sendMessage("✅ Group refresh complete!", event.threadID);
  }, 1000);
};
