const axios = require("axios");

module.exports = {
  config: {
    name: "sing2",
    aliases: ["song","play"],
    version: "1.0",
    author: "Naim",
    role: 0,
    shortDescription: "Play song",
    category: "media",
    guide: "{pn} <song name>"
  },

  onStart: async function ({ api, event, args }) {

    if (!args[0]) return api.sendMessage("🎵 | Song name dao Abbu", event.threadID);

    const query = args.join(" ");

    api.sendMessage("🔎 | Song khuja hocche...", event.threadID);

    try {

      const search = await axios.get(`https://apis-samir.onrender.com/api/ytsearch?query=${encodeURIComponent(query)}`);
      const video = search.data.result[0];

      const dl = await axios.get(`https://apis-samir.onrender.com/api/ytmp3?url=${video.url}`);

      const stream = await global.utils.getStreamFromURL(dl.data.download);

      api.sendMessage({
        body: `🎧 ${video.title}\n⏱ ${video.duration}`,
        attachment: stream
      }, event.threadID);

    } catch (e) {
      api.sendMessage("❌ Song error", event.threadID);
    }
  }
};
