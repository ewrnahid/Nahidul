module.exports = {
  config: {
    name: "refresh",
    version: "1.1",
    author: "Naim",
    role: 1,
    description: "Remove deactivated accounts",
    category: "group",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    const { threadID } = event;

    try {
      const threadInfo = await api.getThreadInfo(threadID);
      const botID = api.getCurrentUserID();
      let removed = 0;

      const tasks = threadInfo.userInfo
        .filter(user => user.id != botID && (!user.name || user.name === "Facebook User"))
        .map(async user => {
          try {
            await api.removeUserFromGroup(user.id, threadID);
            removed++;
          } catch {}
        });

      await Promise.all(tasks);

      api.sendMessage(
        `🐸 | Refresh Complete!\n⚡ Removed Deactivated Accounts: ${removed}`,
        threadID
      );

    } catch (err) {
      api.sendMessage("❌ | Refresh Failed!", threadID);
    }
  }
};
