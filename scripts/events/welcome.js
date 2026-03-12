const { getTime, drive } = global.utils;
const { createCanvas, loadImage, registerFont } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

if (!global.temp.welcomeEvent)
  global.temp.welcomeEvent = {};

(async () => {
  try {
    const fontPath = path.join(__dirname, "cache", "english.ttf");
    if (!fs.existsSync(fontPath)) {
      console.log("u");
      const fontUrl = "https://raw.githubusercontent.com/cyber-ullash/cyber-ullash/main/english.ttf";
      const { data } = await axios.get(fontUrl, { responseType: "arraybuffer" });
      await fs.outputFile(fontPath, data);
      console.log("l");
    }
    registerFont(fontPath, { family: "ModernoirBold" });
    console.log("l");
  } catch (err) {
    console.error("❌ Font a s h error:", err);
  }
})();

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

const WELCOME_GIF_URL = "https://files.catbox.moe/5imlo7.gif";

async function sendWelcomeGifMessage(api, threadID, bodyText) {
  try {
    const gifPath = path.join(__dirname, "cache", "welcome_bot.gif");

    if (!fs.existsSync(gifPath)) {
      const { data } = await axios.get(WELCOME_GIF_URL, { responseType: "arraybuffer" });
      await fs.outputFile(gifPath, data);
    }

    await api.sendMessage(
      {
        body: bodyText,
        attachment: fs.createReadStream(gifPath)
      },
      threadID
    );
  } catch (err) {
    console.error("Failed to send welcome gif message:", err);
    try {
      await api.sendMessage(bodyText, threadID);
    } catch (e) {
      console.error("Failed to send fallback welcome message:", e);
    }
  }
}

module.exports = {
  config: {
    name: "welcome",
    version: "2.0.0",
    author: "MAHBUB ULLASH",
    category: "events"
  },

  langs: {
    vi: {
      session1: "sáng",
      session2: "trưa",
      session3: "chiều",
      session4: "tối",
      welcomeMessage: "Cảm ơn bạn đã mời tôi vào nhóm!\nPrefix bot: %1\nĐể xem danh sách lệnh hãy nhập: %1help",
      multiple1: "bạn",
      multiple2: "các bạn",
      defaultWelcomeMessage: "Xin chào {userName}.\nChào mừng bạn đến với {boxName}.\nChúc bạn có buổi {session} vui vẻ!"
    },
    en: {
      session1: "morning",
      session2: "noon",
      session3: "afternoon",
      session4: "evening",
      welcomeMessage:"━━〔 🤖 𝗡𝗔𝗜𝗠 𝗕𝗢𝗧 〕━━━╮
│ 🕌 Assalamualaikum ☘️│ 🤭 চলে এসেছি আমি পিচ্চি নাঈম এর BOT তোমাদের মাঝে│ 💋 𝐔𝐌𝐌𝐌𝐀𝐇 𝐃𝐀𝐖 𝐍𝐀𝐈𝐌 𝐊𝐄├───────────────│ ✅ 𝗕𝗢𝗧 𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗘𝗗 𝗦𝗨𝗖𝗖𝗘𝗦𝗙𝗨𝗟│ 🔓 𝗔𝗣𝗣𝗥𝗢𝗩𝗔𝗟 𝗔𝗟𝗟𝗢𝗪 𝗜𝗡 𝗧𝗛𝗜𝗦 𝗚𝗥𝗢𝗨𝗣├───────────────│ 👨‍💻 𝗗𝗘𝗩𝗘𝗟𝗢𝗣𝗘𝗥│ MD NAHIDUL ISLAM NAIM│ 🕌 𝗥𝗘𝗟𝗜𝗚𝗜𝗢𝗡: ISLAM│ 💙 𝗥𝗘𝗟𝗔𝗧𝗜𝗢𝗡𝗦𝗛𝗜𝗣: SINGLE│ 🎂 𝗔𝗚𝗘: 17+│ 📚 𝗪𝗢𝗥𝗞: STUDENT├───────────────│⚙️ 𝗕𝗢𝗧 𝗣𝗥𝗘𝗙𝗜𝗫: %1│ 📜 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗟𝗜𝗦𝗧: %1help╰━━━━━━━━━━━━━━━╯",
      multiple1: "you",
      multiple2: "you guys",
      defaultWelcomeMessage: `Hello {userName}.\nWelcome {multiple} to the chat group: {boxName}\nHave a nice {session} 😊`
    }
  },

  onStart: async ({ threadsData, message, event, api, getLang, usersData }) => {
    if (event.logMessageType == "log:subscribe")
      return async function () {
        const { threadID } = event;
        const { nickNameBot } = global.GoatBot.config;
        const prefix = global.utils.getPrefix(threadID);
        const dataAddedParticipants = event.logMessageData.addedParticipants;
        const botID = api.getCurrentUserID();

        if (dataAddedParticipants.some((item) => item.userFbId == botID)) {
          if (nickNameBot)
            api.changeNickname(nickNameBot, threadID, botID);

          const { threadApproval } = global.GoatBot.config;
          if (threadApproval && threadApproval.enable) {
            try {
              const isAutoApprovedThread = threadApproval.autoApprovedThreads && threadApproval.autoApprovedThreads.includes(threadID);

              if (isAutoApprovedThread) {
                await threadsData.set(threadID, { approved: true });
                console.log(`Auto-approved thread ${threadID} from autoApprovedThreads list`);

                setTimeout(async () => {
                  try {
                    const text = getLang("welcomeMessage", prefix);
                    await sendWelcomeGifMessage(api, threadID, text);
                  } catch (err) {
                    console.error(`Failed to send welcome message to auto-approved thread ${threadID}:`, err.message);
                  }
                }, 2000);
                return null;
              }

              await threadsData.set(threadID, { approved: false });

              if (threadApproval.adminNotificationThreads && threadApproval.adminNotificationThreads.length > 0 && threadApproval.sendNotifications !== false) {
                setTimeout(async () => {
                  try {
                    let threadInfo = { threadName: "Unknown", participantIDs: [] };
                    let addedByName = "Unknown";

                    try {
                      try {
                        const threadData = await threadsData.get(threadID);
                        if (threadData && threadData.threadName && threadData.threadName !== "Unknown") {
                          threadInfo.threadName = threadData.threadName;
                          threadInfo.participantIDs = threadData.members || [];
                        } else {
                          throw new Error("threadsData returned unknown or empty");
                        }
                      } catch (threadsDataErr) {
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        const info = await api.getThreadInfo(threadID);
                        if (info && info.threadName) {
                          threadInfo = info;
                        } else {
                          threadInfo.threadName = `Thread ${threadID}`;
                          threadInfo.participantIDs = [];
                        }
                      }
                    } catch (err) {
                      console.error(`Failed to get thread info for ${threadID}:`, err.message);
                      threadInfo.threadName = `Thread ${threadID}`;
                      threadInfo.participantIDs = [];
                    }

                    try {
                      if (event.author) {
                        addedByName = await usersData.getName(event.author);
                        if (!addedByName || addedByName === "Unknown") {
                          try {
                            const userInfo = await api.getUserInfo(event.author);
                            if (userInfo && userInfo[event.author] && userInfo[event.author].name) {
                              addedByName = userInfo[event.author].name;
                            } else {
                              addedByName = `User ${event.author}`;
                            }
                          } catch (apiErr) {
                            addedByName = `User ${event.author}`;
                          }
                        }
                      }
                    } catch (err) {
                      console.error(`Failed to get user info:`, err.message);
                      addedByName = "Unknown User";
                    }

                    const notificationMessage =
                      `🔔 BOT ADDED TO NEW THREAD 🔔\n\n` +
                      `📋 Thread Name: ${threadInfo.threadName || "Unknown"}\n` +
                      `🆔 Thread ID: ${threadID}\n` +
                      `👤 Added by: ${addedByName}\n` +
                      `👥 Members: ${threadInfo.participantIDs?.length || 0}\n` +
                      `⏰ Time: ${new Date().toLocaleString()}\n\n` +
                      `⚠️ This thread is NOT APPROVED. Bot will not respond to any commands.\n` +
                      `Use "${prefix}mthread" to manage thread approvals.`;

                    for (let i = 0; i < threadApproval.adminNotificationThreads.length; i++) {
                      const notifyThreadID = threadApproval.adminNotificationThreads[i];
                      try {
                        if (i > 0) await new Promise(resolve => setTimeout(resolve, 1500));
                        await api.sendMessage(notificationMessage, notifyThreadID);
                      } catch (err) {
                        console.error(`Failed to send notification to thread ${notifyThreadID}:`, err.message);
                      }
                    }
                  } catch (err) {
                    console.error(`Failed to send notifications:`, err.message);
                  }
                }, 5000);
              }

              if (threadApproval.sendThreadMessage !== false) {
                setTimeout(async () => {
                  try {
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    const warningMessage =
                      `⚠️ This thread is not approved yet. Bot will not respond to any commands until approved by an admin.\n\n` +
                      `Use "${prefix}help" after approval to see available commands.`;
                    await api.sendMessage(warningMessage, threadID);
                  } catch (err) {
                    if (err.error === 1545116 || err.errorSummary === 'Thread disabled') {
                      console.log(`Thread ${threadID} is disabled, skipping approval message`);
                    } else {
                      console.error(`Failed to send approval message to thread ${threadID}:`, err.message);
                    }
                  }
                }, 10000);
              }

              return null;
            } catch (err) {
              console.error(`Thread approval system error:`, err.message);
            }
          }

          setTimeout(async () => {
            try {
              const text = getLang("welcomeMessage", prefix);
              await sendWelcomeGifMessage(api, threadID, text);
            } catch (err) {
              console.error(`Failed to send welcome message to thread ${threadID}:`, err.message);
            }
          }, 2000);
          return null;
        }

        try {
          const threadData = await threadsData.get(threadID);
          if (threadData?.settings?.sendWelcomeMessage === false)
            return;

          const threadName = threadData.threadName || "Group Chat";
          const threadInfo = await api.getThreadInfo(threadID);
          const memberCount = threadInfo.participantIDs.length;

          const user = dataAddedParticipants[0];
          const userName = user.fullName;
          const userID = user.userFbId;

          const displayUserName =
            userName && userName.trim() !== "" ? userName : "New member";
          const displayThreadName =
            threadName && threadName.trim() !== "" ? threadName : "Group chat";

          const avatarUrl = `https://graph.facebook.com/${userID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

          const backgrounds = [
            "https://files.catbox.moe/c6ody0.jpg",
            "https://files.catbox.moe/7ufcfb.jpg",
            "https://files.catbox.moe/y78bmv.jpg"
          ];
          const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];

          const canvas = createCanvas(1000, 500);
          const ctx = canvas.getContext("2d");

          const bgResponse = await axios.get(randomBg, { responseType: "arraybuffer" });
          const bg = await loadImage(bgResponse.data);
          ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

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
          ctx.arc(canvas.width / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
          ctx.restore();

          const overlayHeight = 190;
          ctx.save();
          ctx.fillStyle = "rgba(0, 0, 0, 0.60)";
          ctx.fillRect(0, canvas.height - overlayHeight, canvas.width, overlayHeight);
          ctx.restore();

          ctx.textAlign = "center";
          ctx.shadowColor = "rgba(0,0,0,0.7)";
          ctx.shadowBlur = 4;
          const centerX = canvas.width / 2;
          let currentY = canvas.height - overlayHeight + 40; // start inside overlay

          ctx.font = "bold 42px ModernoirBold";
          ctx.fillStyle = "#ffffff";
          ctx.fillText("ASSALAMUALAIKUM", centerX, currentY);

          currentY += 40;
          ctx.font = "bold 34px ModernoirBold";
          ctx.fillStyle = "#ffea00";
          if (displayUserName.length > 26) {
            ctx.font = "bold 30px ModernoirBold";
          }
          ctx.fillText(displayUserName, centerX, currentY);

          currentY += 38;
          ctx.font = "bold 28px ModernoirBold";
          ctx.fillStyle = "#ffffff";

          const line3Text = `welcome to ${displayThreadName}`;
          const maxWidth = canvas.width - 160;
          const lineHeight = 32;
          currentY = wrapText(ctx, line3Text, centerX, currentY, maxWidth, lineHeight);

          currentY += 34;
          ctx.font = "bold 24px ModernoirBold";
          ctx.fillStyle = "#00ffcc";
          ctx.fillText(`You're the ${memberCount}th member of this group`, centerX, currentY);

          const imgPath = path.join(__dirname, "cache", `welcome_${userID}.png`);
          await fs.ensureDir(path.dirname(imgPath));
          const out = fs.createWriteStream(imgPath);
          const stream = canvas.createPNGStream();
          stream.pipe(out);
          await new Promise(resolve => out.on("finish", resolve));

          message.send(
            {
              body: [
          
`╭•┄┅═══❁🌺❁═══┅┄•╮
   আসসালামু আলাইকুম-!!🖤
╰•┄┅═══❁🌺❁═══┅┄•╯

✨🆆🅴🅻🅻 🅲🅾🅼🅴✨

❥ 𝐍𝐄𝐖 𝐌𝐄𝐌𝐁𝐄𝐑  
[ ${displayUserName} ]

༆-✿ আপনাকে আমাদের  
${displayThreadName}

✨🌺 এর পক্ষ থেকে স্বাগতম 🌺✨

❤️🫰 ভালোবাসা অবিরাম 🫰❤️

༆-✿ আপনি এই গ্রুপের ${memberCount} নং মেম্বার

╭•┄┅═══❁🌺❁═══┅┄•╮
   𝗡𝗔𝗜𝗠 𝗜𝗦𝗟𝗔𝗠𝗜𝗖 𝗕𝗢𝗧
╰•┄┅═══❁🌺❁═══┅┄•╯
`
              ].join("\n"),
              attachment: fs.createReadStream(imgPath)
            },
            () => {
              try {
                fs.unlinkSync(imgPath);
              } catch (e) { }
            }
          );
        } catch (err) {
          console.error("❌ Welcome event error (canvas):", err);
        }
      };
  }
};
