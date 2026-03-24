const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "love3",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Naim ❤️",
  description: "Real Couple DP + Random Love SMS",
  commandCategory: "fun",
  usages: "/love3 @mention",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const mentionID = Object.keys(event.mentions)[0];
  if (!mentionID) {
    return api.sendMessage("👉 যাকে love DP দিতে চাও তাকে @mention দাও 💖", event.threadID);
  }

  const senderID = event.senderID;
  const name = event.mentions[mentionID];
  const mentions = [{ id: mentionID, tag: name }];

  // 20+ lovely messages
  const messages = [
    `💖 ${name}, তুমি আমার জীবনের সবচেয়ে সুন্দর অনুভূতি...`,
    `🌸 ${name}, তোমাকে ভাবলেই মনটা শান্ত হয়ে যায়...`,
    `💫 ${name}, তুমি না থাকলে আমার দিন অসম্পূর্ণ লাগে...`,
    `🌹 ${name}, তুমি আমার হাসির কারণ...`,
    `💞 ${name}, তোমার সাথে কথা বললেই সব কষ্ট দূরে চলে যায়...`,
    `💕 ${name}, তুমি আমার স্বপ্নের রাজকুমারী...`,
    `💓 ${name}, তুমি ছাড়া আমি অসম্পূর্ণ...`,
    `💗 ${name}, তোমার হাসি আমার দিনকে আলোকিত করে...`,
    `💘 ${name}, তুমি আমার ভালোবাসার একমাত্র মানুষ...`,
    `💖 ${name}, সব সময় পাশে থাকো, আমি তোমার জন্য সব করব...`,
    `🌸 ${name}, তুমি আমার জীবনের সবথেকে বড় সুখ...`,
    `💫 ${name}, তোমার কথা ভাবলেই হৃদয় নাচে...`,
    `🌹 ${name}, তুমি আমার প্রতিটি মুহূর্তের আনন্দ...`,
    `💞 ${name}, তুমি আমার জীবনের আশীর্বাদ...`,
    `💕 ${name}, তুমি আমার ভালোবাসার প্রতীক...`,
    `💓 ${name}, তোমার সাথে থাকা মানে স্বপ্নের মত...`,
    `💗 ${name}, তুমি ছাড়া আমার জীবন ফাঁকা...`,
    `💘 ${name}, তুমি আমার হৃদয়ের শান্তি...`,
    `💖 ${name}, তুমি সবসময় আমার পাশে থাকো...`,
    `🌸 ${name}, তুমি আমার জীবনের সবচেয়ে সুন্দর অভিজ্ঞতা...`
  ];

  try {
    // Profile pics
    const avatar1 = `https://graph.facebook.com/${senderID}/picture?width=512&height=512`;
    const avatar2 = `https://graph.facebook.com/${mentionID}/picture?width=512&height=512`;

    // Couple DP API
    const imgUrl = `https://api.popcat.xyz/couple?avatar1=${encodeURIComponent(avatar1)}&avatar2=${encodeURIComponent(avatar2)}`;
    const path = __dirname + "/cache/couple.png";

    const response = await axios({
      url: imgUrl,
      method: "GET",
      responseType: "stream"
    });

    const writer = fs.createWriteStream(path);
    response.data.pipe(writer);

    writer.on("finish", () => {
      // Random message
      const msg = messages[Math.floor(Math.random() * messages.length)];

      api.sendMessage({
        body: msg,
        mentions,
        attachment: fs.createReadStream(path)
      }, event.threadID, () => fs.unlinkSync(path));
    });

    writer.on("error", () => {
      api.sendMessage("❌ Image load করতে সমস্যা হচ্ছে!", event.threadID);
    });

  } catch (err) {
    api.sendMessage("❌ Error হয়েছে! পুনরায় চেষ্টা করো।", event.threadID);
    console.error(err);
  }
};
