const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios');
const chalk = require('chalk');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tentacle')
        .setDescription('Displays a NSFW tentacle image.'),
    prefix: {
        name: 'tentacle',
        aliases: [],
        description: 'Displays a NSFW tentacle image.',
        use: 'tentacle',
    },
    async run(bot, message, args) {
        if (!message.channel.nsfw) {
            const embed = new EmbedBuilder()
                .setTitle('`❌` ▸ Not NSFW channel')
                .setDescription(`> *This command can only be used in NSFW channels.*`)
                .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setColor('Red')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        try {
            const response = await axios.get('https://nekobot.xyz/api/image?type=tentacle', { timeout: 10000, headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' } });
            const embed = new EmbedBuilder()
                .setTitle('`🔞` ▸ NSFW Tentacle Image')
                .setImage(response.data.message)
                .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                .setColor(bot.color)
                .setTimestamp();

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setEmoji('📎')
                        .setLabel(' ▸ Link')
                        .setStyle(ButtonStyle.Link)
                        .setURL(response.data.message)
                );

            return message.reply({ embeds: [embed], components: [row] });
        } catch (error) {
            console.error(chalk.red('[COMMAND ERROR] ▸ Error in tentacle command:'));
            console.error(chalk.red(error.stack));
            const embed = new EmbedBuilder()
                .setTitle('`❌` ▸ Error occurred')
                .setDescription(`> *An error occurred while fetching the image. Please try again later.*`)
                .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setColor('Red')
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }
    },
    async execute(bot, interaction) {
        if (!interaction.channel.nsfw) {
            const embed = new EmbedBuilder()
                .setTitle('`❌` ▸ Not NSFW channel')
                .setDescription(`> *This command can only be used in NSFW channels.*`)
                .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setColor('Red')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await interaction.deferReply();

        try {
            const response = await axios.get('https://nekobot.xyz/api/image?type=tentacle', { timeout: 10000, headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' } });
            const embed = new EmbedBuilder()
                .setTitle('`🔞` ▸ NSFW Tentacle Image')
                .setImage(response.data.message)
                .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setColor(bot.color)
                .setTimestamp();

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setEmoji('📎')
                        .setLabel(' ▸ Link')
                        .setStyle(ButtonStyle.Link)
                        .setURL(response.data.message)
                );

            return interaction.editReply({ embeds: [embed], components: [row] });
        } catch (error) {
            console.error(chalk.red('[COMMAND ERROR] ▸ Error in tentacle command:'));
            console.error(chalk.red(error.stack));
            const embed = new EmbedBuilder()
                .setTitle('`❌` ▸ Error occurred')
                .setDescription(`> *An error occurred while fetching the image. Please try again later.*`)
                .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setColor('Red')
                .setTimestamp();
            return interaction.editReply({ embeds: [embed] });
        }
    }
};
