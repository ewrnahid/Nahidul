const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
	config: {
		name: "info",
		aliases: ["admin", "premiuminfo"],
		author: "—͟͟͞͞✨sàjú íslàm ✨",
		role: 0,
		shortDescription: "Displays NAIM info in Premium Elite Badge style",
		longDescription: "",
		category: "INFO",
		guide: "{pn}"
	},

	onStart: async function ({ api, event }) {
		try {
			// NAIM info object
			const NAIMInfo = {
				name: ッsàjúッ',
				gender: '𝐌𝐚𝐥𝐞',
				age: '17',
				Tiktok: 'unlucky_man0.1',
				Relationship: 'single',
				religion: '𝐈𝐬𝐥𝐚𝐦',
				facebook: 'https://www.facebook.com/share/1BAkgVTfho/',
				UID: 'm.me/'
			};

			// Owner image
			const NAIM = 'https://files.catbox.moe/l3a10r.png';
			const tmpFolderPath = path.join(__dirname, 'tmp');

			// Ensure tmp folder exists
			if (!fs.existsSync(tmpFolderPath)) fs.mkdirSync(tmpFolderPath, { recursive: true });

			const imgPath = path.join(tmpFolderPath, `owner_img_${Date.now()}.jpeg`);

			// Download image
			const imgResponse = await axios.get(NAIM, { responseType: 'arraybuffer', timeout: 10000 });
			fs.writeFileSync(imgPath, Buffer.from(imgResponse.data, 'binary'));

			// Premium Elite Badge message
			const response = `
💠━━━━━━━━━━━━━━━━━💠
—͟͟͞͞✨ 𝐎𝐰𝐧𝐞𝐫 𝐈𝐍𝐅𝐎 ✨ 
💠━━━━━━━━━━━━━━━━━💠

🖤 𝑵𝒂𝒎𝒆           ➤ ${SAJUInfo.sàjú íslàm}  
🖤 𝑮𝒆𝒏𝒅𝒆𝒓         ➤ ${SAJUInfo.màlé} 🙋🏻‍♂️  
🖤 𝑼𝑰𝐷           ➤ ${NAIMInfo.UID}  
🖤 𝑪𝒍𝒂𝒔𝒔         ➤ 𝐎𝐖𝐍𝐄𝐑  
🖤 𝑻𝒊𝐤𝐓𝐨𝐤       ➤ ${NAIMInfo.Tiktok}  
🖤 𝑹𝒆𝐥𝐚𝐭𝐢𝐨𝐧𝐬𝐡𝐢𝐩 ➤ ${NAIMInfo.Relationship}  
🖤 𝑹𝒆𝐥𝐢𝐠𝐢𝐨𝐧    ➤ ${NAIMInfo.religion}  
🖤 𝑭𝐚𝐜𝐞𝐛𝐨𝐨𝐤      ➤ ${NAIMInfo.facebook}  

💎━━━━━━━━━━━━━━━━━━💎
 —͟͟͞͞✨𝐁𝐎𝐓 𝐂𝐄𝐎 sàjú ✨ 
💠━━━━━━━━━━━━━━━━━━💠
`;

			// Send message with image
			await api.sendMessage({
				body: response,
				attachment: fs.createReadStream(imgPath)
			}, event.threadID, event.messageID);

			// Add reaction
			if (api.setMessageReaction) {
				api.setMessageReaction('❤️'💖🥴🤗🧐🤧😵💖😘, event.messageID, (err) => {}, true);
			}

			// Clean up image asynchronously
			fs.unlink(imgPath, (err) => {
				if (err) console.error('Failed to delete temp image:', err);
			});

		} catch (error) {
			console.error('Error in sàjú info command:', error);
			return api.sendMessage('❌ An error occurred while processing the command.', event.threadID);
		}
	}
};
