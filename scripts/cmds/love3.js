const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "love3",
  version: "3.1.0",
  hasPermission: 0,
  credits: "Naim ❤️",
  description: "Real Couple DP Image + Love SMS",
  commandCategory: "fun",
  usages: "/love @mention",
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

  try {
    const avatar1 = `https://graph.facebook.com/${senderID}/picture?width=512&height=512`;
    const avatar2 = `https://graph.facebook.com/${mentionID}/picture?width=512&height=512`;

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

      // 💌 20+ Love Messages
      const loveMessages = [
        `💖 ${name}, তুমি আমার জীবনের সবচেয়ে সুন্দর অনুভূতি...`,
        `🌸 ${name}, তোমাকে ভাবলেই মনটা শান্ত হয়ে যায়...`,
        `💫 ${name}, তুমি না থাকলে আমার দিন অসম্পূর্ণ লাগে...`,
        `🌹 ${name}, তুমি আমার হাসির কারণ...`,
        `💞 ${name}, তোমার সাথে কথা বললেই সব কষ্ট দূরে চলে যায়...`,
        `✨ ${name}, তুমি আমার ছোট্ট সুখের দুনিয়া...`,
        `💜 ${name}, তোমার হাসিটা আমার সবচেয়ে প্রিয়...`,
        `🌙 ${name}, তুমি আমার রাতের স্বপ্ন আর দিনের ভাবনা...`,
        `🔥 ${name}, তুমি আমার হৃদয়ের একমাত্র special মানুষ...`,
        `🌺 ${name}, তুমি ছাড়া কিছুই ভালো লাগে না...`,
        `💘 ${name}, তোমার ভালোবাসায় আমি হারিয়ে যাই...`,
        `🌷 ${name}, তোমার সাথে কাটানো সময়গুলো সবচেয়ে সুন্দর...`,
        `💓 ${name}, তুমি আমার heart এর heartbeat...`,
        `🌼 ${name}, তুমি থাকলেই সবকিছু perfect লাগে...`,
        `💝 ${name}, তুমি আমার জীবনের সবচেয়ে বড় উপহার...`,
        `🌹 ${name}, তোমার চোখে আমি আমার পৃথিবী দেখি...`,
        `💟 ${name}, তোমাকে ছাড়া আমি কিছুই না...`,
        `🌸 ${name}, তুমি আমার life এর happiness...`,
        `💗 ${name}, তুমি থাকলেই সব দুঃখ দূরে চলে যায়...`,
        `✨ ${name}, তুমি আমার dream come true...`,
        `💞 ${name}, তুমি আমার forever person...`,
        `🌙 ${name}, তুমি আমার রাতের চাঁদ...`,
        `💖 ${name}, সবসময় আমার পাশে থেকো plz...`
      ];

      const msg = loveMessages[Math.floor(Math.random() * loveMessages.length)];

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
    api.sendMessage("❌ Error হয়েছে!", event.threadID);
  }
};
