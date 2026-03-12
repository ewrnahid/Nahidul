const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");

module.exports = {
  config: {
    name: "info2",
    author: "Naim | Edit by Tokodori",
    role: 0,
    shortDescription: "Owner + Bot Dashboard",
    longDescription: "Show owner info and bot system stats in one dashboard",
    category: "system",
    guide: "{pn}"
  },

  onStart: async function ({ api, event, Users, Threads }) {

    const videoURL = "https://files.catbox.moe/o9e2cg.mp4";
    const cacheFolder = path.join(__dirname, "cache");
    const videoPath = path.join(cacheFolder, "owner.mp4");

    if (!fs.existsSync(cacheFolder)) fs.mkdirSync(cacheFolder, { recursive: true });

    // Auto Reaction
    api.setMessageReaction("👑", event.messageID, () => {}, true);

    if (!fs.existsSync(videoPath)) {
      const response = await axios({
        url: videoURL,
        method: "GET",
        responseType: "stream"
      });
      const writer = fs.createWriteStream(videoPath);
      response.data.pipe(writer);
      writer.on("finish", () => sendMsg());
    } else {
      sendMsg();
    }

    async function sendMsg() {

      // Bot system info
      const uptime = process.uptime();
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);

      const ping = Date.now() - event.timestamp;

      const allUsers = await Users.getAll();
      const allThreads = await Threads.getAll();

      const ramUsage = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);

      // CPU usage bar
      const cpus = os.cpus();
      const cpuLoad = cpus.reduce((acc, cpu) => {
        const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
        return acc + (1 - cpu.times.idle / total);
      }, 0) / cpus.length;

      const cpuPercent = Math.round(cpuLoad * 100);
      const totalBars = 20;
      const filledBars = Math.round(cpuPercent / 100 * totalBars);
      const emptyBars = totalBars - filledBars;
      const cpuBar = `|${'█'.repeat(filledBars)}${'░'.repeat(emptyBars)}| ${cpuPercent}%`;

      // Dashboard message using your box layout
      const msg = `
───────────────────╮
      👑 𝙊𝙒𝙉𝙀𝙍 𝙋𝙍𝙊𝙁𝙄𝙇𝙀 👑
╰───────────────────────╯

╔══════════════════════╗
┃ 👤 Name     : NAHIDUL ISLAM NAIM
┃ 🚹 Gender   : Male
┃ 🎂 Age      : 17+
┃ 📏 Height   : 5.9ft
┃ 💍 Status   : Single
┃ 🎓 Work     : Student
╚══════════════════════╝

╔══════════════════════╗
┃ 🌐 Facebook
┃ https://www.facebook.com/NATOKBAZ.NAIM1
┃
┃ 📧 Gmail
┃ ntnaim34@gmail.com
┃
┃ 💬 WhatsApp
┃ wa.me/+8801810769343
┃
┃ ✈ Telegram
┃ t.me/NAHIDULISLAMN
╚══════════════════════╝

╔══════════════════════╗
┃ 📍 Permanent Address
┃ BIASH, SINGRA, NATORE
┃
┃ 📍 Current Address
┃ AUKPARA, SAVAR, DHAKA
╚══════════════════════╝

╔══════════════════════╗
┃ BOT SYSTEM
┃ Ping       : ${ping} ms
┃ Uptime     : ${hours}h ${minutes}m ${seconds}s
┃ Users      : ${allUsers.length}
┃ Groups     : ${allThreads.length}
┃ RAM Usage  : ${ramUsage} MB
┃ CPU Usage  : ${cpuBar}
╚══════════════════════╝
`;

      api.sendMessage({
        body: msg,
        attachment: fs.createReadStream(videoPath)
      }, event.threadID, event.messageID);

    } // end sendMsg

  } // end onStart
}; // end module.exports
