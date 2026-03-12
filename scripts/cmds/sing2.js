const axios = require("axios");

module.exports = {
  config: {
    name: "sing",
    aliases: ["song", "music", "play"],
    version: "2.0",
    author: "Naim",
    role: 0,
    shortDescription: "Play song from YouTube",
    longDescription: "Search and play song from YouTube",
    category: "media",
    guide: "{pn} <song name>"
  },

  onStart: async function ({ api, event, args }) {
    try {

      if (!args[0]) {
        return api.sendMessage("🎵 | Song name dao Abbu", event.threadID);
      }

      const query = args.join(" ");

      api.sendMessage("🔎 | YouTube theke song khuja hocche...", event.threadID);

      // search API
      const search = await axios.get(`https://apis-samir.onrender.com/api/ytsearch?query=${encodeURIComponent(query)}`);

      const video = search.data.result[0];

      if (!video) {
        return api.sendMessage("❌ | Song pawa jay nai", event.threadID);
      }

      const title = video.title;
      const duration = video.duration;
      const thumbnail = video.thumbnail;
      const url = video.url;

      // download API
      const dl = await axios.get(`https://apis-samir.onrender.com/api/ytmp3?url=${url}`);
      const audioUrl = dl.data.download;

      const stream = await global.utils.getStreamFromURL(audioUrl);

      api.sendMessage({
        body: `🎧 𝗡𝗔𝗜𝗠 𝗠𝗨𝗦𝗜𝗖 𝗣𝗟𝗔𝗬𝗘𝗥\n\n📀 Title: ${title}\n⏱ Duration: ${duration}\n🎵 Quality: 128kbps\n🔗 Source: YouTube`,
        attachment: stream
      }, event.threadID);

    } catch (error) {
      console.log(error);
      api.sendMessage("❌ | Song download error", event.threadID);
    }
  }
};
