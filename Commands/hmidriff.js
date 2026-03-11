const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

const commandName = 'hmidriff';
const nsfwType = 'hmidriff';
const description = 'Displays a NSFW hmidriff image.';

exports.help = {
  name: commandName,
  aliases: [],
  description: description,
  use: commandName,
};

exports.slash = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription(description)
  .setDMPermission(false);

const checkNSFW = (channel, user, color) => {
    // If the environment requires NSFW channel but it's not
    if (process.env.NSFW_ONLY === 'true' && !channel.nsfw) {
        return new EmbedBuilder()
            .setTitle('`❌` ▸ Not NSFW channel')
            .setDescription('> *This command can only be used in NSFW channels.*')
            .setFooter({ text: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
            .setColor('Red')
            .setTimestamp();
    }
    return null;
};

const fetchImageAndBuildMessage = async (guild, user, color) => {
    try {
        const response = await axios.get(`https://nekobot.xyz/api/image?type=${nsfwType}`);
        const imageUrl = response.data.message;

        const embed = new EmbedBuilder()
            .setTitle(`🔞 ▸ NSFW ${commandName.charAt(0).toUpperCase() + commandName.slice(1)} Image`)
            .setImage(imageUrl)
            .setFooter({ text: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
            .setColor(color)
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`${commandName}_next`)
                    .setEmoji('🔁')
                    .setLabel(' ▸ Next Image')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setEmoji('📎')
                    .setLabel(' ▸ Link')
                    .setStyle(ButtonStyle.Link)
                    .setURL(imageUrl)
            );

        return { embeds: [embed], components: [row] };
    } catch (e) {
        console.error(e);
        const embed = new EmbedBuilder()
            .setTitle('`❌` ▸ Error occurred')
            .setDescription('> *An error occurred while fetching the image. Please try again later.*')
            .setFooter({ text: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
            .setColor('Red')
            .setTimestamp();
        return { embeds: [embed], components: [] };
    }
};

exports.run = async (bot, message, args) => {
    const color = bot.color;
    bot.db.add(`stats.${commandName}`, 1);

    const nsfwCheckEmbed = checkNSFW(message.channel, message.author, color);
    if (nsfwCheckEmbed) {
        return message.reply({ embeds: [nsfwCheckEmbed] });
    }

    const payload = await fetchImageAndBuildMessage(message.guild, message.author, color);
    return message.reply(payload);
};

exports.execute = async (bot, interaction) => {
    const color = bot.color;
    bot.db.add(`stats.${commandName}`, 1);

    const nsfwCheckEmbed = checkNSFW(interaction.channel, interaction.user, color);
    if (nsfwCheckEmbed) {
        return interaction.reply({ embeds: [nsfwCheckEmbed], ephemeral: true });
    }

    await interaction.deferReply();
    const payload = await fetchImageAndBuildMessage(interaction.guild, interaction.user, color);
    return interaction.editReply(payload);
};

exports.handleInteraction = async (bot, interaction) => {
    if (interaction.isButton() && interaction.customId === `${commandName}_next`) {
        const color = bot.color;
        bot.db.add(`stats.${commandName}`, 1);

        const nsfwCheckEmbed = checkNSFW(interaction.channel, interaction.user, color);
        if (nsfwCheckEmbed) {
            return interaction.reply({ embeds: [nsfwCheckEmbed], ephemeral: true });
        }

        await interaction.deferUpdate();
        const payload = await fetchImageAndBuildMessage(interaction.guild, interaction.user, color);
        return interaction.editReply(payload);
    }
};
