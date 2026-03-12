const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
config: {
name: "info2",
author: "Tokodori | Edit: Naim",
role: 0,
shortDescription: "Owner information",
longDescription: "Show owner information with profile picture",
category: "admin",
guide: "{pn}"
},

onStart: async function ({ api, event }) {

const uid = "61585368534877";
const cacheFolder = path.join(__dirname, "cache");
const imgPath = path.join(cacheFolder, "owner.png");

if (!fs.existsSync(cacheFolder)) {
fs.mkdirSync(cacheFolder, { recursive: true });
}

if (!fs.existsSync(imgPath)) {

const imgURL = `https://graph.facebook.com/${uid}/picture?height=720&width=720`;

const response = await axios({
url: imgURL,
method: "GET",
responseType: "stream"
});

const writer = fs.createWriteStream(imgPath);
response.data.pipe(writer);

writer.on("finish", () => {
sendMsg();
});

} else {
sendMsg();
}

function sendMsg() {

const msg = `
╔══════════════════════╗
        👑 OWNER INFO 👑
╚══════════════════════╝

┏━━━━━━━━━━━━━━━━━━┓
┃ 👤 Name      : NAHIDUL ISLAM NAIM
┃ 🚹 Gender    : Male
┃ 🎂 Age       : 17+
┃ 📏 Height    : 5.9ft
┃ 💍 Relation  : Single
┃ 🎓 Work      : Student
┗━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━┓
┃ 🌐 Facebook
┃ https://www.facebook.com/NATOKBAZ.NAIM1
┗━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━┓
┃ 📍 Permanent Address
┃ BIASH, SINGRA, NATORE
┃
┃ 📍 Current Address
┃ AUKPARA, SAVAR, DHAKA
┗━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━┓
┃ 📧 Gmail
┃ inobita179@gmail.com
┃
┃ 💬 WhatsApp
┃ wa.me/+8801710498589
┃
┃ ✈ Telegram
┃ t.me/NAHIDULISLAMN
┗━━━━━━━━━━━━━━━━━━┛

╔══════════════════════╗
   🔰 OWNER OF NAHIDUL BOT
╚══════════════════════╝
`;

api.sendMessage({
body: msg,
attachment: fs.createReadStream(imgPath)
}, event.threadID, event.messageID);

}

}
};
