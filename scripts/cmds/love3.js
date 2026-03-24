const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "love3",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Naim",
  description: "Real Couple DP Image + Lovely Love SMS",
  commandCategory: "fun",
  usages: "/love3 @mention",
  cooldowns: 5
};

module.exports.onStart = async function ({ api, event }) {
  const mentions = Object.keys(event.mentions);

  if (!mentions.length) {
    return api.sendMessage("👉 যাকে love DP দিতে চাও তাকে @mention দাও 💖", event.threadID);
  }

  const senderID = event.senderID;
  const mentionID = mentions[0];
  const name = event.mentions[mentionID];

  try {
    // 👤 Profile pictures
    const avatar1 = `https://graph.facebook.com/${senderID}/picture?width=512&height=512`;
    const avatar2 = `https://graph.facebook.com/${mentionID}/picture?width=512&height=512`;

    // 💖 Couple DP API
    const imgUrl = `https://api.popcat.xyz/couple?avatar1=${encodeURIComponent(avatar1)}&avatar2=${encodeURIComponent(avatar2)}`;
    const path = __dirname + "/cache/couple.png";

    const response = await axios({ url: imgUrl, method: "GET", responseType: "stream" });
    const writer = fs.createWriteStream(path);
    response.data.pipe(writer);

    writer.on("finish", () => {
      const messages = [
        `💖 ${name}, তুমি আমার জীবনের সবচেয়ে সুন্দর অনুভূতি...`,
        `🌸 ${name}, তোমাকে ভাবলেই মনটা শান্ত হয়ে যায়...`,
        `💫 ${name}, তুমি না থাকলে আমার দিন অসম্পূর্ণ লাগে...`,
        `🌹 ${name}, তুমি আমার হাসির কারণ...`,
        `💞 ${name}, তোমার সাথে কথা বললেই সব কষ্ট দূরে চলে যায়...`,
        `💘 ${name}, তুমি আমার জীবনকে রঙিন করেছো...`,
        `🌷 ${name}, তোমার হাসি আমার প্রিয়...`,
        `💌 ${name}, তুমি ছাড়া সব ফাঁকা লাগে...`,
        `✨ ${name}, তুমি আমার ভালোবাসার নক্ষত্র...`,
        `🌺 ${name}, তোমার সাথে থাকা আনন্দের...`,
        `💖 ${name}, তুমি আমার হৃদয়ের চাবিকাঠি...`,
        `💝 ${name}, তোমাকে ভাবলেই ভালো লাগে...`,
        `🌸 ${name}, তুমি আমার সুখের কারণ...`,
        `💫 ${name}, তোমার সাথে প্রতিটি মুহূর্ত সুন্দর...`,
        `🌹 ${name}, তুমি আমার স্বপ্নের মানুষ...`,
        `💞 ${name}, তোমার সাথে কথা বললে মন শান্তি পায়...`,
        `💘 ${name}, তুমি আমার জীবনের অমূল্য রত্ন...`,
        `🌷 ${name}, তোমার ভালোবাসা আমাকে শক্তি দেয়...`,
        `💌 ${name}, তুমি আমার হৃদয়ের সবচেয়ে বড় আনন্দ...`,
        `✨ ${name}, তোমার চোখের আলোতে আমি হারাই...`
      ];

      // Random message select
      const msg = messages[Math.floor(Math.random() * messages.length)];

      api.sendMessage({
        body: msg,
        mentions: [{ id: mentionID, tag: name }],
        attachment: fs.createReadStream(path)
      }, event.threadID, () => fs.unlinkSync(path));
    });

    writer.on("error", () => {
      api.sendMessage("❌ Image load করতে সমস্যা হচ্ছে!", event.threadID);
    });

  } catch (err) {
    console.error(err);
    api.sendMessage("❌ Error হয়েছে! পুনরায় চেষ্টা করো।", event.threadID);
  }
};
