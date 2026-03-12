const axios = require("axios");

module.exports = {
  config: {
    name: "music",
    aliases: ["song","play","ytmusic"],
    version: "3.0",
    author: "Naim",
    role: 0,
    shortDescription: "All-in-one Music Command",
    category: "media",
    guide: "{pn} <song name or YouTube link>"
  },

  onStart: async function({ api, event, args }) {
    if (!args[0]) return api.sendMessage("🎵 | Song name dao Abbu", event.threadID);

    const query = args.join(" ");
    try {
      api.sendMessage("🔎 | YouTube theke search hocche...", event.threadID);

      // 🔎 Search YouTube
      const search = await axios.get(`https://apis-samir.onrender.com/api/ytsearch?query=${encodeURIComponent(query)}`);
      const results = search.data.result.slice(0,5); // top 5

      if (!results.length) return api.sendMessage("❌ | Song pawa jay nai", event.threadID);

      // Show top 5 results
      let msg = "🔎 Top 5 Results:\n\n";
      results.forEach((v,i)=>{ msg += `${i+1}. ${v.title} ⏱ ${v.duration}\n`; });
      msg += "\nReply 1-5 to select song";

      api.sendMessage(msg, event.threadID, async (err, info) => {

        const handleReply = async (reply) => {
          if (!reply.body.match(/^[1-5]$/)) return;

          const choice = parseInt(reply.body) - 1;
          const video = results[choice];

          // 🎵 MP3 Download
          const dl = await axios.get(`https://apis-samir.onrender.com/api/ytmp3?url=${video.url}`);
          const audio = await global.utils.getStreamFromURL(dl.data.download);

          // 📜 Lyrics
          let lyrics = "";
          try {
            const l = await axios.get(`https://api.popcat.xyz/lyrics?song=${encodeURIComponent(video.title)}`);
            lyrics = `\n📜 Lyrics:\n${l.data.lyrics.slice(0,2000)}`;
          } catch {}

          // Send final message
          api.sendMessage({
            body: `🎧 ${video.title}\n⏱ ${video.duration}${lyrics}`,
            attachment: audio,
            image: (video.thumbnail ? await global.utils.getStreamFromURL(video.thumbnail) : null)
          }, event.threadID);
        };

        global.client.on("message", function onReply(r) {
          if (r.threadID === event.threadID && /^[1-5]$/.test(r.body)) handleReply(r);
        });

      });

    } catch(e) {
      console.log(e);
      api.sendMessage("❌ | Music command error", event.threadID);
    }
  }
};
