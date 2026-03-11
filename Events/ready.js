const chalk = require('chalk');

module.exports = {
  name: 'ready',
  once: true,
  execute(bot) {
    console.log(chalk.green(`[!] — Bot is fully ready and operational!`));
    // Set a custom activity if desired
    bot.user.setActivity('with commands', { type: 0 });
  },
};