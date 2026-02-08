const { EmbedBuilder } = require('discord.js');
const chalk = require('chalk');

module.exports = {
  name: 'messageCreate',
  async execute(message, bot) {
    try {
      if (!message.guild || message.author.bot) return;

      // Debug log to check if message content is received (Intent check)
      if (message.content.length === 0 && !message.attachments.size && !message.embeds.length) {
        console.log(chalk.yellow('[WARNING]') + chalk.white(' ▸ Received message with empty content. Ensure "Message Content Intent" is enabled in Discord Developer Portal.'));
      }

      const prefix = process.env.BOT_PREFIX || '!';
      const color = '#2b2d31'; // Default color

      const sendPrefixEmbed = () => {
        const embed = new EmbedBuilder()
          .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
          .setTitle('`🪄` ▸ Prefix')
          .setDescription(`> *The bot prefix is \`${prefix}\`.*`)
          .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
          .setColor(color)
          .setTimestamp();
        return message.reply({ embeds: [embed] });
      };

      if (message.content.startsWith(`<@${bot.user.id}>`) || message.content.startsWith(`<@!${bot.user.id}>`)) {
        const mention = message.content.startsWith(`<@!${bot.user.id}>`) ? `<@!${bot.user.id}>` : `<@${bot.user.id}>`;
        const args = message.content.slice(mention.length).trim().split(/ +/);
        const commandName = args.shift()?.toLowerCase();

        if (!commandName) {
          return sendPrefixEmbed();
        }

        const command = bot.commands.get(commandName);
        if (!command) return sendPrefixEmbed();

        console.log(chalk.blue(`[PREFIX]`) + chalk.white(` ▸ Command: `) + chalk.cyan(commandName) + chalk.white(` | User: `) + chalk.yellow(message.author.tag));
        await command.run(bot, message, args, { prefix, color });
      } else if (message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift()?.toLowerCase();

        const command = bot.commands.get(commandName);
        if (!command) return;

        console.log(chalk.blue(`[PREFIX]`) + chalk.white(` ▸ Command: `) + chalk.cyan(commandName) + chalk.white(` | User: `) + chalk.yellow(message.author.tag));
        await command.run(bot, message, args, { prefix, color });
      }
    } catch (e) {
      console.error(e);
    }
  },
};
