const { Events } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(bot) {
    await bot.user.setPresence({ activities: [{ name: 'By nekrxs.', type: 5 }], status: 'idle' });
  },
};
