const { EmbedBuilder, InteractionType } = require('discord.js');
const chalk = require('chalk');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, bot) {
    if (interaction.type === InteractionType.ApplicationCommand) {
      console.log(chalk.blue(`[INTERACTION]`) + chalk.white(` ▸ Command: `) + chalk.cyan(interaction.commandName) + chalk.white(` | User: `) + chalk.yellow(interaction.user.tag));
      const command = bot.commands.get(interaction.commandName);

      if (!command) return interaction.reply({ content: 'Command not found', ephemeral: true });

      try {
        await command.execute(interaction, bot);
      } catch (error) {
        console.error(error);
        const embed = new EmbedBuilder()
          .setTitle('`❌` ▸ Error')
          .setDescription('> *An error occurred while executing this command.*')
          .setColor('Red');
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ embeds: [embed], ephemeral: true });
        } else {
          await interaction.reply({ embeds: [embed], ephemeral: true });
        }
      }
    } else if (interaction.isButton() || interaction.isStringSelectMenu() || interaction.isModalSubmit()) {
      console.log(chalk.blue(`[COMPONENT]`) + chalk.white(` ▸ ID: `) + chalk.cyan(interaction.customId) + chalk.white(` | User: `) + chalk.yellow(interaction.user.tag));
      // Find the command that handles this interaction
      // We can use a customId convention like "commandName:action"
      const customId = interaction.customId;
      const commandName = customId.split(':')[0];
      const command = bot.commands.get(commandName);

      if (command && command.onComponentInteraction) {
        try {
          await command.onComponentInteraction(interaction, bot);
        } catch (error) {
          console.error(error);
        }
      }
    }
  },
};
