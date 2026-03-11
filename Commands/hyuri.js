const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hyuri')
    .setDescription('Displays a NSFW hyuri image.'),
  help: {
    name: 'hyuri',
    aliases: [],
    description: 'Displays a NSFW hyuri image.',
    use: 'hyuri',
  },
  async run(bot, message, args, config) {
    bot.db.incrementUsage('hyuri');
    return this.sendImage(bot, message, config, message.author, message.guild, message.channel);
  },
  async execute(bot, interaction, options, config) {
    bot.db.incrementUsage('hyuri');
    return this.sendImage(bot, interaction, config, interaction.user, interaction.guild, interaction.channel);
  },
  async sendImage(bot, context, config, user, guild, channel) {
    if (config.nsfwChannel && !channel.nsfw) {
      const embed = new EmbedBuilder()
        .setTitle('`❌` ▸ Not NSFW channel')
        .setDescription(`> *This command can only be used in NSFW channels.*`)
        .setFooter({ text: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
        .setColor('Red')
        .setTimestamp();
      return context.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      const response = await axios.get('https://nekobot.xyz/api/image?type=hyuri');

      const embed = new EmbedBuilder()
        .setTitle('`🔞` ▸ NSFW hyuri image')
        .setImage(response.data.message)
        .setFooter({ text: guild ? guild.name : user.username, iconURL: guild ? guild.iconURL({ dynamic: true }) : user.displayAvatarURL({ dynamic: true }) })
        .setColor(config.color)
        .setTimestamp();

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setEmoji('📎')
            .setLabel(' ▸ Link')
            .setStyle(ButtonStyle.Link)
            .setURL(response.data.message)
        );

      return context.reply({ embeds: [embed], components: [row] });
    } catch {
      const embed = new EmbedBuilder()
        .setTitle('`❌` ▸ Error occurred')
        .setDescription(`> *An error occurred while fetching the image. Please try again later.*`)
        .setFooter({ text: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
        .setColor('Red')
        .setTimestamp();
      return context.reply({ embeds: [embed], ephemeral: true });
    }
  }
};
