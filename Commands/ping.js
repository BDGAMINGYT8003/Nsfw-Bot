const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Checks the bot latency.'),

  help: {
    name: 'ping',
    aliases: ['latency'],
    description: 'Checks the bot latency.',
    use: 'ping',
  },

  async execute(interaction, bot) {
    const start = Date.now();

    // Database interaction example
    const pingCount = bot.db.get('pingCount') || 0;
    bot.db.set('pingCount', pingCount + 1);

    const embed = new EmbedBuilder()
      .setTitle('`🏓` ▸ Pong!')
      .setDescription(`> *Calculating latency...*`)
      .setColor('#2b2d31')
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('ping:refresh')
        .setLabel('Refresh')
        .setStyle(ButtonStyle.Primary)
    );

    const msg = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });
    const end = Date.now();

    const finalEmbed = new EmbedBuilder()
      .setTitle('`🏓` ▸ Pong!')
      .addFields(
        { name: '`📡` ▸ Latency', value: `> *${end - start}ms*`, inline: true },
        { name: '`📶` ▸ API Latency', value: `> *${Math.round(bot.ws.ping)}ms*`, inline: true },
        { name: '`📊` ▸ Times Pinged', value: `> *${pingCount + 1}*`, inline: true }
      )
      .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setColor('#2b2d31')
      .setTimestamp();

    await interaction.editReply({ embeds: [finalEmbed] });
  },

  async run(bot, message, args, config) {
    const start = Date.now();

    // Database interaction example
    const pingCount = bot.db.get('pingCount') || 0;
    bot.db.set('pingCount', pingCount + 1);

    const embed = new EmbedBuilder()
      .setTitle('`🏓` ▸ Pong!')
      .setDescription(`> *Calculating latency...*`)
      .setColor(config.color)
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('ping:refresh')
        .setLabel('Refresh')
        .setStyle(ButtonStyle.Primary)
    );

    const msg = await message.reply({ embeds: [embed], components: [row] });
    const end = Date.now();

    const finalEmbed = new EmbedBuilder()
      .setTitle('`🏓` ▸ Pong!')
      .addFields(
        { name: '`📡` ▸ Latency', value: `> *${end - start}ms*`, inline: true },
        { name: '`📶` ▸ API Latency', value: `> *${Math.round(bot.ws.ping)}ms*`, inline: true },
        { name: '`📊` ▸ Times Pinged', value: `> *${pingCount + 1}*`, inline: true }
      )
      .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setColor(config.color)
      .setTimestamp();

    await msg.edit({ embeds: [finalEmbed] });
  },

  async onComponentInteraction(interaction, bot) {
    if (interaction.customId === 'ping:refresh') {
      const start = Date.now();

      const pingCount = bot.db.get('pingCount') || 0;

      const embed = new EmbedBuilder()
        .setTitle('`🏓` ▸ Pong! (Refreshed)')
        .addFields(
          { name: '`📶` ▸ API Latency', value: `> *${Math.round(bot.ws.ping)}ms*`, inline: true },
          { name: '`📊` ▸ Total Pings', value: `> *${pingCount}*`, inline: true }
        )
        .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setColor('#2b2d31')
        .setTimestamp();

      await interaction.update({ embeds: [embed] });
    }
  }
};
