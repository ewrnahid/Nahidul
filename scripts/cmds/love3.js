const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "love3",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Naim ❤️",
  description: "Single mention love message + DP",
  category: "fun",
  usages: "/love3 @mention",
  cooldowns: 5
};

module.exports.onStart = async function({ api, event }) {
  const mentions = Object.keys(event.mentions);

  if (mentions.length === 0) {
    return api.sendMessage("💖 যাকে Love দিতে চাও তাকে @mention করো।", event.threadID);
  }

  const mentionID = mentions[0];
  const name = event.mentions[mentionID];
  const mentionObjects = [{ id: mentionID, tag: name }];
  const senderID = event.senderID;

  // API for couple DP (sender + mentioned user)
  const avatar1 = `https://graph.facebook.com/${senderID}/picture?width=512&height=512`;
  const avatar2 = `https://graph.facebook.com/${mentionID}/picture?width=512&height=512`;

  const imgUrl = `https://api.popcat.xyz/couple?avatar1=${encodeURIComponent(avatar1)}&avatar2=${encodeURIComponent(avatar2)}`;
  const path = __dirname + "/cache/love3.png";

  try {
    const response = await axios({ url: imgUrl, method: "GET", responseType: "stream" });
    const writer = fs.createWriteStream(path);
    response.data.pipe(writer);

    writer.on("finish", async () => {
      const messages = [
        `💖 ${name}, তুমি আমার জীবনের সবচেয়ে সুন্দর অনুভূতি...`,
        `🌸 ${name}, তোমাকে ভাবলেই মনটা শান্ত হয়ে যায়...`,
        `💫 ${name}, তুমি না থাকলে আমার দিন অসম্পূর্ণ লাগে...`,
        `🌹 ${name}, তুমি আমার হাসির কারণ...`,
        `💞 ${name}, তোমার সাথে কথা বললেই সব কষ্ট দূরে চলে যায়...`,
        `💌 ${name}, তুমি আমার সবকিছুর আনন্দ...`,
        `❤️ ${name}, তোমার ছাড়া জীবন ফাঁকা মনে হয়...`,
        `💘 ${name}, তুমি আমার হৃদয়ের beat...`,
        `✨ ${name}, তোমার presence সবকিছু সুন্দর করে তোলে...`,
        `💟 ${name}, তুমি আমার স্বপ্নের অংশ...`,
        `🌹 ${name}, তোমার স্মৃতি সবসময় পাশে থাকে...`,
        `💖 ${name}, তোমার জন্য আমার অনুভূতি অনন্ত...`,
        `💞 ${name}, তুমি আমার motivation...`,
        `💫 ${name}, তুমি আমার reason to smile...`,
        `💌 ${name}, তোমার জন্য আমার ভালোবাসা অসীম...`,
        `🌸 ${name}, তুমি আমার আনন্দের source...`,
        `❤️ ${name}, তোমার presence life bright করে...`,
        `💘 ${name}, তুমি আমার lucky charm...`,
        `✨ ${name}, তুমি সব tension দূরে সরিয়ে দাও...`,
        `💟 ${name}, তোমার নিয়ে সব সময় খুশি থাকি...`
      ];

      const randomMsg = messages[Math.floor(Math.random() * messages.length)];

      api.sendMessage({
        body: randomMsg,
        mentions: mentionObjects,
        attachment: fs.createReadStream(path)
      }, event.threadID, () => fs.unlinkSync(path));
    });

    writer.on("error", () => {
      api.sendMessage("❌ Image load করতে সমস্যা হচ্ছে!", event.threadID);
    });

  } catch (err) {
    api.sendMessage("❌ Error হয়েছে! পুনরায় চেষ্টা করো।", event.threadID);
  }
};
