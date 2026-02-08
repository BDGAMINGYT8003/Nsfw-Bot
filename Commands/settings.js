const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../database/Database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('settings')
        .setDescription('Manage bot settings.')
        .addSubcommand(sub =>
            sub.setName('setcolor')
                .setDescription('Set the embed color.')
                .addStringOption(option => option.setName('color').setDescription('Hex color code (e.g. #ff0000)').setRequired(true)))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    prefix: {
        name: 'settings',
        aliases: ['set'],
        description: 'Manage bot settings.',
        use: 'settings <subcommand> [args]',
    },
    async run(bot, message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply('You do not have permission to use this command.');
        }

        const subcommand = args[0]?.toLowerCase();

        if (subcommand === 'setcolor') {
            const color = args[1];
            if (!/^#[0-9A-F]{6}$/i.test(color)) {
                return message.reply('Please provide a valid hex color code (e.g. #ff0000).');
            }

            db.set(`guild_${message.guild.id}_color`, color);
            bot.color = color; // Update local cache if needed, or better: fetch from DB in each command

            const embed = new EmbedBuilder()
                .setTitle('`✅` ▸ Success')
                .setDescription(`> *The embed color has been set to \`${color}\`.*`)
                .setColor(color)
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        } else {
            return message.reply('Usage: `!settings setcolor <#hex>`');
        }
    },
    async execute(bot, interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'setcolor') {
            const color = interaction.options.getString('color');
            if (!/^#[0-9A-F]{6}$/i.test(color)) {
                return interaction.reply({ content: 'Please provide a valid hex color code (e.g. #ff0000).', ephemeral: true });
            }

            db.set(`guild_${interaction.guild.id}_color`, color);
            bot.color = color;

            const embed = new EmbedBuilder()
                .setTitle('`✅` ▸ Success')
                .setDescription(`> *The embed color has been set to \`${color}\`.*`)
                .setColor(color)
                .setTimestamp();
            return interaction.reply({ embeds: [embed] });
        }
    }
};
