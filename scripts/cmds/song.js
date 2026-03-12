const axios = require("axios");
const fs = require("fs");

const baseApiUrl = async () => {
  const base = await axios.get(
    "https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json"
  );
  return base.data.api;
};

module.exports = {
  config: {
    name: "sing",
    version: "1.1.6",
    aliases: ["music", "play"],
    author: "dipto | fix by Naim",
    countDown: 5,
    role: 0,
    description: {
      en: "Download audio from YouTube"
    },
    category: "media",
    guide: {
      en: "{pn} <song name | youtube link>"
    }
  },

  onStart: async ({ api, args, event, commandName }) => {

    if (!args[0])
      return api.sendMessage("⚠️ | Please enter a song name.", event.threadID);

    const checkurl = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/))((\w|-){11})/;

    let videoID;
    const urlYtb = checkurl.test(args[0]);

    // ===== YOUTUBE LINK =====
    if (urlYtb) {
      const match = args[0].match(checkurl);
      videoID = match ? match[1] : null;

      try {
        const { data } = await axios.get(
          `${await baseApiUrl()}/ytDl3?link=${videoID}&format=mp3`
        );

        const file = await downloadFile(data.downloadLink, "audio.mp3");

        return api.sendMessage(
          {
            body: data.title,
            attachment: file
          },
          event.threadID,
          () => fs.unlinkSync("audio.mp3"),
          event.messageID
        );

      } catch (err) {
        return api.sendMessage("❌ Download failed.", event.threadID);
      }
    }

    // ===== SEARCH SONG =====
    let keyWord = args.join(" ");

    let result;
    try {
      result = (
        await axios.get(
          `${await baseApiUrl()}/ytFullSearch?songName=${encodeURIComponent(keyWord)}`
        )
      ).data.slice(0, 6);
    } catch (err) {
      return api.sendMessage("❌ Search error.", event.threadID);
    }

    if (!result || result.length === 0)
      return api.sendMessage("⭕ No results found.", event.threadID);

    let msg = "";
    let thumbnails = [];

    for (let i = 0; i < result.length; i++) {
      const info = result[i];

      msg += `${i + 1}. ${info.title}\nTime: ${info.time}\nChannel: ${info.channel.name}\n\n`;

      thumbnails.push(getStream(info.thumbnail));
    }

    api.sendMessage(
      {
        body: msg + "🔎 Reply with number (1-6)",
        attachment: await Promise.all(thumbnails)
      },
      event.threadID,
      (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName,
          messageID: info.messageID,
          author: event.senderID,
          result
        });
      },
      event.messageID
    );
  },

  // ===== REPLY =====
  onReply: async ({ api, event, Reply }) => {
    try {

      if (event.senderID !== Reply.author)
        return;

      const choice = parseInt(event.body);
      const result = Reply.result;

      if (isNaN(choice) || choice < 1 || choice > result.length)
        return api.sendMessage("⚠️ Invalid number.", event.threadID);

      const video = result[choice - 1];

      const { data } = await axios.get(
        `${await baseApiUrl()}/ytDl3?link=${video.id}&format=mp3`
      );

      const file = await downloadFile(data.downloadLink, "audio.mp3");

      api.unsendMessage(Reply.messageID);

      api.sendMessage(
        {
          body: `🎵 ${data.title}\n📀 Quality: ${data.quality}`,
          attachment: file
        },
        event.threadID,
        () => fs.unlinkSync("audio.mp3"),
        event.messageID
      );

    } catch (err) {
      console.log(err);
      api.sendMessage("❌ Audio send failed.", event.threadID);
    }
  }
};

// ===== DOWNLOAD FILE =====
async function downloadFile(url, path) {
  const response = await axios.get(url, {
    responseType: "arraybuffer"
  });

  fs.writeFileSync(path, Buffer.from(response.data));
  return fs.createReadStream(path);
}

// ===== THUMBNAIL STREAM =====
async function getStream(url) {
  const response = await axios.get(url, {
    responseType: "stream"
  });
  return response.data;
}
