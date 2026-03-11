const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays the list of commands.')
    .addStringOption(option =>
      option.setName('command')
        .setDescription('The command to get help for')
        .setRequired(false)
    ),
  help: {
    name: 'help',
    aliases: ['h', 'aide'],
    description: 'Displays the list of commands.',
    use: 'help [command]',
  },
  async run(bot, message, args, config) {
    bot.db.incrementUsage('help');
    const commandArg = args[0];
    return this.sendHelp(bot, message, commandArg, config, message.author);
  },
  async execute(bot, interaction, options, config) {
    bot.db.incrementUsage('help');
    const commandArg = options.getString('command');
    return this.sendHelp(bot, interaction, commandArg, config, interaction.user);
  },
  async sendHelp(bot, context, commandArg, config, user) {
    if (!commandArg) {
      const commandNames = new Set();
      const commandsList = bot.commands.filter(command => {
        if (!commandNames.has(command.help.name)) {
          commandNames.add(command.help.name);
          return true;
        }
        return false;
      }).map(command => {
        return `\`${config.prefix}${command.help.use}\`\n*— ${command.help.description}*`;
      }).join('\n');

      const embed = new EmbedBuilder()
        .setTitle('`🪄` ▸ Help menu')
        .setDescription(commandsList)
        .setFooter({ text: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
        .setColor(config.color)
        .setTimestamp();
      return context.reply({ embeds: [embed] });
    } else {
      const command = bot.commands.get(commandArg);
      if (!command) {
        const embed = new EmbedBuilder()
          .setTitle('`❌` ▸ Invalid arguments')
          .setDescription('> *Please provide an existing command.*')
          .setFooter({ text: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
          .setColor('Red')
          .setTimestamp();
        return context.reply({ embeds: [embed], ephemeral: true });
      } else {
        const embed = new EmbedBuilder()
          .setTitle(`\`🪄\` ▸ ${command.help.name}`)
          .setDescription(`> *Command:* \`${config.prefix}${command.help.use}\`\n> *Description:* \`${command.help.description}\`\n> *Aliases:* ${command.help.aliases.map(a => `\`${a}\``).join(', ') || '`None.`'}`)
          .setFooter({ text: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
          .setColor(config.color)
          .setTimestamp();
        return context.reply({ embeds: [embed] });
      }
    }
  }
};
