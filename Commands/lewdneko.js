const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lewdneko')
    .setDescription('Displays a NSFW Lewd Neko image.'),

  help: {
    name: 'lewdneko',
    aliases: [],
    description: 'Displays a NSFW Lewd Neko image.',
    use: 'lewdneko',
  },

  async execute(interaction, bot) {
    if (!interaction.channel.nsfw) {
      const embed = new EmbedBuilder()
        .setTitle('`❌` ▸ Not NSFW channel')
        .setDescription(`> *This command can only be used in NSFW channels.*`)
        .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setColor('Red')
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      const response = await axios.get('https://nekobot.xyz/api/image?type=lewdneko');
      const embed = new EmbedBuilder()
        .setTitle('`🔞` ▸ NSFW Lewd Neko Image')
        .setImage(response.data.message)
        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setColor('#2b2d31')
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setEmoji('📎')
          .setLabel(' ▸ Link')
          .setStyle(ButtonStyle.Link)
          .setURL(response.data.message)
      );

      return interaction.reply({ embeds: [embed], components: [row] });
    } catch {
      const embed = new EmbedBuilder()
        .setTitle('`❌` ▸ Error occurred')
        .setDescription(`> *An error occurred while fetching the image. Please try again later.*`)
        .setColor('Red');
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },

  async run(bot, message, args, config) {
    if (config.nsfwChannel && !message.channel.nsfw) {
      const embed = new EmbedBuilder()
        .setTitle('`❌` ▸ Not NSFW channel')
        .setDescription(`> *This command can only be used in NSFW channels.*`)
        .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setColor('Red')
        .setTimestamp();
      return message.reply({ embeds: [embed] });
    }

    try {
      const response = await axios.get('https://nekobot.xyz/api/image?type=lewdneko');
      const embed = new EmbedBuilder()
        .setTitle('`🔞` ▸ NSFW Lewd Neko Image')
        .setImage(response.data.message)
        .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
        .setColor(config.color)
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
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
        .setColor('Red');
      return message.reply({ embeds: [embed] });
    }
  }
};
