const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { fetchImage } = require('../Utils/Fetcher');
const chalk = require('chalk');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ass')
        .setDescription('Displays a NSFW ass image.'),
    prefix: {
        name: 'ass',
        aliases: [],
        description: 'Displays a NSFW ass image.',
        use: 'ass',
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
            const imageUrl = await fetchImage('ass');
            const embed = new EmbedBuilder()
                .setTitle('`🔞` ▸ NSFW Ass Image')
                .setImage(imageUrl)
                .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                .setColor(bot.color)
                .setTimestamp();

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setEmoji('📎')
                        .setLabel(' ▸ Link')
                        .setStyle(ButtonStyle.Link)
                        .setURL(imageUrl)
                );

            return message.reply({ embeds: [embed], components: [row] });
        } catch (error) {
            console.error(chalk.red('[COMMAND ERROR] ▸ Error in command:'));
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
            const imageUrl = await fetchImage('ass');
            const embed = new EmbedBuilder()
                .setTitle('`🔞` ▸ NSFW Ass Image')
                .setImage(imageUrl)
                .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setColor(bot.color)
                .setTimestamp();

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setEmoji('📎')
                        .setLabel(' ▸ Link')
                        .setStyle(ButtonStyle.Link)
                        .setURL(imageUrl)
                );

            return interaction.editReply({ embeds: [embed], components: [row] });
        } catch (error) {
            console.error(chalk.red('[COMMAND ERROR] ▸ Error in command:'));
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
