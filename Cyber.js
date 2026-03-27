const { spawn } = require("child_process");

console.log("====================================");
console.log("🤖 NAIM BOT SYSTEM STARTING...");
console.log("====================================");

function startProject() {
	const child = spawn("node", ["Cyber.js"], {
		cwd: __dirname,
		stdio: "inherit",
		shell: true
	});

	child.on("close", (code) => {
		console.log(`⚠️ Bot exited with code: ${code}`);

		// Restart system
		setTimeout(() => {
			console.log("🔄 Restarting bot...");
			startProject();
		}, 3000);
	});
}

startProject();
