module.exports.config = {
  name: "r",
  version: "5.0.0",
  hasPermssion: 0,
  credits: "Naim",
  description: "Admin only stylish refresh with emoji animation",
  commandCategory: "group",
  usages: "/refresh [amount]",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {

  const adminIDs = ["61585368534877"]; // 👑 Abbu UID

  // Only admin check
  if (!adminIDs.includes(event.senderID)) {
    return api.sendMessage("❌ Only admin can use this command!", event.threadID);
  }

  // Amount from args, default 5
  let amount = parseInt(args[0]);
  if (!amount || amount < 1) amount = 5;
  if (amount > 50) amount = 50; // maximum 50

  // Emoji colors
  const colors = ["🖤","❤","💛","💚","💙","💜"];

  let msg = "";

  // Build message
  for (let i = 0; i < amount; i++) {
    colors.forEach(color => {
      msg += `${color}\n`.repeat(4); // 4 lines of same emoji
    });
    msg += `\n✨ Group Refresh #${i+1} ✨\n\n`; // optional header
  }

  // Send main animation/message
  await api.sendMessage(msg, event.threadID);

  // Completion message after short delay
  setTimeout(() => {
    api.sendMessage("✅ Group refresh complete!", event.threadID);
  }, 1000);
};
