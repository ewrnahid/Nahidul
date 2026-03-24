const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");

module.exports.config = {
  name: "love3",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Naim ❤️",
  description: "Real Couple DP + Love SMS",
  commandCategory: "fun",
  usages: "/love3 @mention",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const mentionID = Object.keys(event.mentions)[0];
  if (!mentionID) return api.sendMessage("👉 যাকে love DP দিতে চাও তাকে @mention দাও 💖", event.threadID);

  const senderID = event.senderID;
  const senderName = "You"; // sender নাম নিতে চাইলে API লাগবে
  const mentionedName = event.mentions[mentionID];
  const mentions = [{ id: mentionID, tag: mentionedName }];

  try {
    // Cache folder ensure
    await fs.ensureDir(__dirname + "/cache");

    // Get profile pictures
    const avatar1 = `https://graph.facebook.com/${senderID}/picture?width=512&height=512`;
    const avatar2 = `https://graph.facebook.com/${mentionID}/picture?width=512&height=512`;

    // Create canvas
    const width = 800;
    const height = 400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#ff758c");
    gradient.addColorStop(1, "#ff7eb3");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw hearts randomly
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 50;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Load avatars
    const img1 = await loadImage(avatar1);
    const img2 = await loadImage(avatar2);
    const radius = 80;

    // Draw sender avatar
    ctx.save();
    ctx.beginPath();
    ctx.arc(width/4, height/2, radius, 0, Math.PI*2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img1, width/4 - radius, height/2 - radius, radius*2, radius*2);
    ctx.restore();

    // Draw mentioned avatar
    ctx.save();
    ctx.beginPath();
    ctx.arc((width*3)/4, height/2, radius, 0, Math.PI*2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img2, (width*3)/4 - radius, height/2 - radius, radius*2, radius*2);
    ctx.restore();

    // Draw connecting heart
    ctx.fillStyle = "#fff";
    ctx.font = "bold 50px Sans";
    ctx.textAlign = "center";
    ctx.fillText("💖", width/2, height/2 + 20);

    // Save image
    const path = __dirname + "/cache/love3.png";
    fs.writeFileSync(path, canvas.toBuffer("image/png"));

    // Random love messages
    const messages = [
      `💖 ${mentionedName}, তুমি আমার জীবনের সবচেয়ে সুন্দর অনুভূতি...`,
      `🌸 ${mentionedName}, তোমাকে ভাবলেই মনটা শান্ত হয়ে যায়...`,
      `💫 ${mentionedName}, তুমি না থাকলে আমার দিন অসম্পূর্ণ লাগে...`,
      `🌹 ${mentionedName}, তুমি আমার হাসির কারণ...`,
      `💞 ${mentionedName}, তোমার সাথে কথা বললেই সব কষ্ট দূরে চলে যায়...`,
      `💌 ${mentionedName}, তুমি আমার হৃদয়ের একমাত্র প্রিয়জন...`,
      `💖 ${mentionedName}, তোমাকে ভাবলেই চোখে হাসি আসে...`,
      `🌸 ${mentionedName}, তুমি আমার জীবনের রঙিন স্বপ্ন...`,
      `💫 ${mentionedName}, তোমার সাথে থাকলে সময় থমকে যায়...`,
      `🌹 ${mentionedName}, তুমি আমার আনন্দের কারণ...`
    ];

    const randomMsg = messages[Math.floor(Math.random() * messages.length)];

    // Send message with attachment
    api.sendMessage({
      body: randomMsg,
      mentions,
      attachment: fs.createReadStream(path)
    }, event.threadID, () => fs.unlinkSync(path));

  } catch (err) {
    console.log(err);
    api.sendMessage("❌ Error হয়েছে! পুনরায় চেষ্টা করো।", event.threadID);
  }
};
