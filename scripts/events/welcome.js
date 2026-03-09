const { createCanvas, loadImage, registerFont } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

if (!global.temp.welcomeEvent) global.temp.welcomeEvent = {};

// 🎨 Font setup
(async () => {
  try {
    const fontPath = path.join(__dirname, "cache", "english.ttf");
    if (!fs.existsSync(fontPath)) {
      const fontUrl = "https://raw.githubusercontent.com/cyber-ullash/cyber-ullash/main/english.ttf";
      const { data } = await axios.get(fontUrl, { responseType: "arraybuffer" });
      await fs.outputFile(fontPath, data);
    }
    registerFont(fontPath, { family: "ModernoirBold" });
  } catch (err) {
    console.error("❌ Font error:", err);
  }
})();

// 📜 Text wrapper
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  if (!text) return y;
  const words = text.split(" ");
  let line = "";
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, y);
  return y;
}

// 🌟 Welcome text generator
const generateWelcomeMessage = ({ userName, threadName, memberCount }) => {
  return `
‎╭•┄┅═══❁🌺❁═══┅┄•╮
   আসসালামু আলাইকুম-!!🖤
╰•┄┅═══❁🌺❁═══┅┄•╯

✨🆆🅴🅻🅻 🅲🅾🅼🅴✨

❥ 𝐍𝐄𝐖 𝐌𝐄𝐌𝐁𝐄𝐑  
[ ${userName} ]

༆-✿ আপনাকে আমাদের  
${threadName}

✨🌺 এর পক্ষ থেকে স্বাগতম 🌺✨

❤️🫰 ভালোবাসা অবিরাম 🫰❤️

༆-✿ আপনি এই গ্রুপের ${memberCount} নং মেম্বার

╭•┄┅═══❁🌺❁═══┅┄•╮
   𝗡𝗔𝗜𝗠 𝗜𝗦𝗟𝗔𝗠𝗜𝗖 𝗕𝗢𝗧
╰•┄┅═══❁🌺❁═══┅┄•╯
`;
};

// 🌈 Background images
const backgrounds = [
  "https://files.catbox.moe/w1ieq5.jpg",
  "https://files.catbox.moe/c4aerh.jpg",
  "https://files.catbox.moe/mj7w5p.jpg",
  "https://files.catbox.moe/c6ody0.jpg",
  "https://files.catbox.moe/7ufcfb.jpg",
  "https://files.catbox.moe/y78bmv.jpg"
];

// 🖌️ Welcome image creator
async function createWelcomeImage(userID, userName, threadName, memberCount) {
  const canvas = createCanvas(1000, 500);
  const ctx = canvas.getContext("2d");

  const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  const bgResponse = await axios.get(randomBg, { responseType: "arraybuffer" });
  const bg = await loadImage(bgResponse.data);
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  const avatarUrl = `https://graph.facebook.com/${userID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
  let avatar;
  try {
    const response = await axios.get(avatarUrl, { responseType: "arraybuffer" });
    avatar = await loadImage(response.data);
  } catch {
    avatar = await loadImage("https://i.ibb.co/2kR9xgQ/default-avatar.png");
  }

  const avatarSize = 180;
  const avatarX = canvas.width / 2 - avatarSize / 2;
  const avatarY = 40;
  ctx.save();
  ctx.beginPath();
  ctx.arc(canvas.width / 2, avatarY + avatarSize / 2,
