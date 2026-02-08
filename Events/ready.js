const chalk = require('chalk');

module.exports = {
  name: 'ready',
  once: true,
  async execute(bot) {
    await bot.user.setPresence({ activities: [{ name: 'By nekrxs.', type: 5 }], status: 'idle' });
    console.log(chalk.green.bold('[READY]') + chalk.white(` ▸ Bot is online as ${bot.user.tag}`));
  },
};
