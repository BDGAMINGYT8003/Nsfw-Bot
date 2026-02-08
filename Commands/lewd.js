const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lewd')
        .setDescription('Displays a NSFW lewd image.'),
    prefix: {
        name: 'lewd',
        aliases: [],
        description: 'Displays a NSFW lewd image.',
        use: 'lewd',
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
            const response = await axios.get('https://nekobot.xyz/api/image?type=lewd');
            const embed = new EmbedBuilder()
                .setTitle('`🔞` ▸ NSFW Lewd Image')
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
        } catch {
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
            const response = await axios.get('https://nekobot.xyz/api/image?type=lewd');
            const embed = new EmbedBuilder()
                .setTitle('`🔞` ▸ NSFW Lewd Image')
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
        } catch {
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
