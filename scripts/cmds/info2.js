const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "info2",
    aliases: ["ownerinfo", "personalinfo"],
    author: "Naim | Edit by Tokodori",
    role: 0,
    shortDescription: "Owner Info Only",
    longDescription: "Show only owner personal info with video",
    category: "system",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    try {
      const videoURL = "https://files.catbox.moe/o9e2cg.mp4";
      const cacheFolder = path.join(__dirname, "cache");
      const videoPath = path.join(cacheFolder, "owner.mp4");

      if (!fs.existsSync(cacheFolder)) fs.mkdirSync(cacheFolder, { recursive: true });

      // Auto Reaction
      if (api.setMessageReaction) {
        api.setMessageReaction("👑", event.messageID, () => {}, true);
      }

      // Video download
      if (!fs.existsSync(videoPath)) {
        const response = await axios({
          url: videoURL,
          method: "GET",
          responseType: "stream",
          timeout: 20000
        });

        const writer = fs.createWriteStream(videoPath);
        response.data.pipe(writer);

        writer.on("finish", () => sendMsg());
        writer.on("error", (err) => {
          console.error("Video write error:", err);
          sendMsg(); // Even if video fails, send message
        });
      } else {
        sendMsg();
      }

      async function sendMsg() {
        // Personal information only
        const msg = `
───────────────────╮
      👑 OWNER PROFILE 👑
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
`;

        // Send message with video
        api.sendMessage({
          body: msg,
          attachment: fs.existsSync(videoPath) ? fs.createReadStream(videoPath) : null
        }, event.threadID, event.messageID);
      }

    } catch (error) {
      console.error("Error in info2 command:", error);
      api.sendMessage("❌ An error occurred while sending owner info.", event.threadID);
    }
  }
};
