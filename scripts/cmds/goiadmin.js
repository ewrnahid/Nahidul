module.exports.config = {
  name: "goiadmin",
  version: "1.0.2",
  permission: 0,
  credits: "Naim",
  description: "Mention handler",
  prefix: true,
  category: "user",
  usages: "tag",
  cooldowns: 5,
};

module.exports.handleEvent = async function({ api, event }) {
  const ownerID = "61566927465098"; // নাইম বস
  const mentions = event.mentions ? Object.keys(event.mentions) : [];

  if (event.senderID !== ownerID && mentions.includes(ownerID)) {
    const msg = [
      "Mantion_দিস না _নাইম বস এর মন মন ভালো নেই আজকে!💔🥀",
      "- আমার সাথে কেউ সেক্স করে না, থুক্কু টেক্স করে নাহ🫂💔",
      "আমার একটা প্রিয়র খুব দরকার, কারন চোখে পানি আসার আগে নাকে সর্দি চলে আসে🤣🤣",
      "এত মেনশন না দিয়ে বক্স আসো, হট করে দিবো🤷‍ঝাং 😘🥒",
      "Mantion_দিলে চুম্মাইয়া ঠুটের কালার change কইরা,লামু 💋😾😾🔨",
      "এতু ইমুশানাল কথা বলো, তল দেশ দিয়ে অজরে বৃষ্টি হচ্ছে আমার 😭😭",
      "নাইম বস এখন বিজি, জা বলার আমাকে বলতে পারেন_!!😼🥰",
      "এতো মিনশন না দিয়ে সিংগেল নাইম রে একটা gf দে 😒 😏",
      "Mantion_না দিয়ে সিরিয়াস প্রেম করতে চাইলে ইনবক্স",
      "মেনশন দিসনা পারলে একটা gf দে",
      "Mantion_দিস না, বাঁলপাঁক্না নাইম প্রচুর বিজি 🥵🥀🤐",
      "চুমু খাওয়ার বয়স টা চকলেট🍫 খেয়ে উড়িয়ে দিলাম🤗"
    ];

    const randomMsg = msg[Math.floor(Math.random() * msg.length)];
    return api.sendMessage({ body: randomMsg }, event.threadID, event.messageID);
  }
};

// GoatBot structure require করে onStart
module.exports.onStart = async function({ api }) {
  // এখানে কিছু execute হবে না, শুধু load এর জন্য লাগছে
  return;
};
