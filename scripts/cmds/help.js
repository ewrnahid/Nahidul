const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
	config: {
		name: "help",
		version: "2.1",
		author: "ULLASH + Edit by NAIM",
		countDown: 5,
		role: 0,
		shortDescription: {
			en: "Show all commands"
		},
		longDescription: {
			en: "Show command list and usage"
		},
		category: "info",
		guide: {
			en: "{pn}help or {pn}help cmdName"
		}
	},

	onStart: async function ({ message, args, event, role }) {

		const { threadID } = event;
		const prefix = getPrefix(threadID);

		// ===== SHOW ALL COMMAND =====

		if (!args[0]) {

			let msg = `
╭━━━━━━━━━━━━━◆
┃ 𝐍𝐀𝐇𝐈𝐃𝐔𝐋 ッ HELP MENU
╰━━━━━━━━━━━━━◆`;

			const categories = {};

			for (const [name, value] of commands) {

				if (value.config.role > role) continue;

				const category = value.config.category || "other";

				if (!categories[category])
					categories[category] = [];

				categories[category].push(name);
			}

			for (const category in categories) {

				msg += `\n\n╭━━〔 ${category.toUpperCase()} 〕`;

				const list = categories[category].sort();

				for (let i = 0; i < list.length; i += 2) {
					msg += `\n┃ ⭔ ${list[i]}   ⭔ ${list[i + 1] || ""}`;
				}

				msg += "\n╰━━━━━━━━━━━━━";
			}

			msg += `

╭━━〔 ENJOY 〕
┃ TOTAL CMDS: ${commands.size}
┃ TYPE: ${prefix}help <cmd>
╰━━━━━━━━━━━━━

╭━━〔 OWNER 〕
┃ ♥︎╣ 𝐍𝐀𝐇𝐈𝐃𝐔𝐋 ッ ╠♥︎
╰━━━━━━━━━━━━━`;

			const img = "https://i.postimg.cc/VNHtBxQZ/20260221-045710.png";

			return message.reply({
				body: msg,
				attachment: await global.utils.getStreamFromURL(img)
			});
		}

		// ===== SINGLE COMMAND INFO =====

		const name = args[0].toLowerCase();

		const command =
			commands.get(name) ||
			commands.get(aliases.get(name));

		if (!command)
			return message.reply("❌ Command not found");

		const config = command.config;

		const guide = config.guide?.en || "No guide available";

		const usage = guide
			.replace(/{pn}/g, prefix)
			.replace(/{p}/g, prefix)
			.replace(/{n}/g, config.name);

		const msg = `
╭━━〔 COMMAND INFO 〕
┃ NAME: ${config.name}
┃ AUTHOR: ${config.author || "Unknown"}
┃ VERSION: ${config.version || "1.0"}
┃ ROLE: ${config.role}
┃
┃ DESCRIPTION:
┃ ${config.longDescription?.en || "No description"}
┃
┃ USAGE:
┃ ${usage}
╰━━━━━━━━━━━━━`;

		return message.reply(msg);
	}
};
