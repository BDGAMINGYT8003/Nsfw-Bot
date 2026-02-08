const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays the list of commands.')
    .addStringOption(option =>
      option.setName('command')
        .setDescription('The command to get details for.')
        .setRequired(false)),

  help: {
    name: 'help',
    aliases: ['h', 'aide'],
    description: 'Displays the list of commands.',
    use: 'help [command]',
  },

  async execute(interaction, bot) {
    const commandName = interaction.options.getString('command');
    const prefix = '/'; // Slash context

    if (!commandName) {
      return this.sendGeneralHelp(interaction, bot, prefix, '#2b2d31');
    }

    const command = bot.commands.get(commandName.toLowerCase());
    if (!command) {
      const embed = new EmbedBuilder()
        .setTitle('`❌` ▸ Invalid command')
        .setDescription('> *Please provide an existing command.*')
        .setColor('Red');
      return interaction.reply({ embeds: [embed], flags: [64] });
    }

    const embed = new EmbedBuilder()
      .setTitle(`\`🪄\` ▸ ${command.help.name}`)
      .setDescription(`> *Command:* \`${prefix}${command.help.use}\`\n> *Description:* \`${command.help.description}\`\n> *Aliases:* ${command.help.aliases.map(a => `\`${a}\``).join(', ') || '\`None.\`'}`)
      .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setColor('#2b2d31')
      .setTimestamp();
    return interaction.reply({ embeds: [embed] });
  },

  async run(bot, message, args, config) {
    const commandName = args[0];
    const prefix = config.prefix;

    if (!commandName) {
      return this.sendGeneralHelp(message, bot, prefix, config.color);
    }

    const command = bot.commands.get(commandName.toLowerCase());
    if (!command) {
      const embed = new EmbedBuilder()
        .setTitle('`❌` ▸ Invalid command')
        .setDescription('> *Please provide an existing command.*')
        .setColor('Red');
      return message.reply({ embeds: [embed] });
    }

    const embed = new EmbedBuilder()
      .setTitle(`\`🪄\` ▸ ${command.help.name}`)
      .setDescription(`> *Command:* \`${prefix}${command.help.use}\`\n> *Description:* \`${command.help.description}\`\n> *Aliases:* ${command.help.aliases.map(a => `\`${a}\``).join(', ') || '\`None.\`'}`)
      .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setColor(config.color)
      .setTimestamp();
    return message.reply({ embeds: [embed] });
  },

  async sendGeneralHelp(context, bot, prefix, color) {
    const commandNames = new Set();
    const uniqueCommands = [];

    bot.commands.forEach(command => {
      if (!commandNames.has(command.help.name)) {
        commandNames.add(command.help.name);
        uniqueCommands.push(command);
      }
    });

    const commandsList = uniqueCommands.map(command => {
      return `\`${prefix}${command.help.use}\`\n*— ${command.help.description}*`;
    }).join('\n');

    const embed = new EmbedBuilder()
      .setTitle('`🪄` ▸ Help menu')
      .setDescription(commandsList)
      .setColor(color)
      .setTimestamp();

    if (context.author) {
        embed.setFooter({ text: context.author.username, iconURL: context.author.displayAvatarURL({ dynamic: true }) });
    } else {
        embed.setFooter({ text: context.user.username, iconURL: context.user.displayAvatarURL({ dynamic: true }) });
    }

    const select = new StringSelectMenuBuilder()
      .setCustomId('help:select')
      .setPlaceholder('Select a command to see details')
      .addOptions(
        uniqueCommands.slice(0, 25).map(command =>
          new StringSelectMenuOptionBuilder()
            .setLabel(command.help.name)
            .setDescription(command.help.description.substring(0, 100))
            .setValue(command.help.name)
        )
      );

    const row = new ActionRowBuilder().addComponents(select);

    if (context.reply) {
      return context.reply({ embeds: [embed], components: [row] });
    }
  },

  async onComponentInteraction(interaction, bot) {
    if (interaction.customId === 'help:select') {
      const commandName = interaction.values[0];
      const command = bot.commands.get(commandName);
      const prefix = interaction.isChatInputCommand() ? '/' : (process.env.BOT_PREFIX || '!');

      const embed = new EmbedBuilder()
        .setTitle(`\`🪄\` ▸ ${command.help.name}`)
        .setDescription(`> *Command:* \`${prefix}${command.help.use}\`\n> *Description:* \`${command.help.description}\`\n> *Aliases:* ${command.help.aliases.map(a => `\`${a}\``).join(', ') || '\`None.\`'}`)
        .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setColor('#2b2d31')
        .setTimestamp();

      await interaction.update({ embeds: [embed], components: [] });
    }
  }
};
