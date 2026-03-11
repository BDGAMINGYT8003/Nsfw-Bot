const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, SlashCommandBuilder } = require('discord.js');

exports.help = {
  name: 'help',
  aliases: ['h', 'commands'],
  description: 'Displays a navigable menu of all bot commands.',
  use: 'help',
};

exports.slash = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Displays a navigable menu of all bot commands.')
  .setDMPermission(false);

const buildHelpPayload = (bot, guild, user, color, selectedPage = 0) => {
    // Collect unique commands
    const commandNames = new Set();
    const allCommands = Array.from(bot.commands.values()).filter(command => {
        if (!commandNames.has(command.help.name)) {
            commandNames.add(command.help.name);
            return true;
        }
        return false;
    });

    // Sort alphabetically
    allCommands.sort((a, b) => a.help.name.localeCompare(b.help.name));

    // Chunk into pages of 10
    const CHUNK_SIZE = 10;
    const pages = [];
    for (let i = 0; i < allCommands.length; i += CHUNK_SIZE) {
        pages.push(allCommands.slice(i, i + CHUNK_SIZE));
    }

    if (selectedPage < 0 || selectedPage >= pages.length) selectedPage = 0;
    const currentCommands = pages[selectedPage] || [];

    const description = currentCommands.map(command => {
        return `**${bot.prefix}${command.help.use}**\n> ${command.help.description}`;
    }).join('\n\n');

    const embed = new EmbedBuilder()
        .setTitle('`🪄` ▸ Help Menu')
        .setDescription(description || 'No commands found.')
        .setFooter({ text: `Page ${selectedPage + 1}/${pages.length} • ${user.username}`, iconURL: user.displayAvatarURL({ dynamic: true }) })
        .setColor(color)
        .setTimestamp();

    // Build Select Menu Options
    const options = pages.map((pageCmds, index) => {
        const firstCmd = pageCmds[0].help.name;
        const lastCmd = pageCmds[pageCmds.length - 1].help.name;
        return {
            label: `Page ${index + 1}`,
            description: `Commands ${firstCmd} to ${lastCmd}`,
            value: index.toString(),
            default: index === selectedPage
        };
    });

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('help_select')
        .setPlaceholder('Select a page to browse commands')
        .addOptions(options);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    return { embeds: [embed], components: pages.length > 1 ? [row] : [] };
};

exports.run = async (bot, message, args) => {
    const payload = buildHelpPayload(bot, message.guild, message.author, bot.color, 0);
    return message.reply(payload);
};

exports.execute = async (bot, interaction) => {
    const payload = buildHelpPayload(bot, interaction.guild, interaction.user, bot.color, 0);
    return interaction.reply(payload);
};

exports.handleInteraction = async (bot, interaction) => {
    if (interaction.isStringSelectMenu() && interaction.customId === 'help_select') {
        const selectedPage = parseInt(interaction.values[0], 10);
        const payload = buildHelpPayload(bot, interaction.guild, interaction.user, bot.color, selectedPage);
        await interaction.update(payload);
    }
};