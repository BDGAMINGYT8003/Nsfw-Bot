const { InteractionType, EmbedBuilder } = require('discord.js');
const chalk = require('chalk');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, bot) {
        try {
            if (interaction.type === InteractionType.ApplicationCommand) {
                const command = bot.commands.get(interaction.commandName);
                if (!command || !command.execute) return;

                await command.execute(bot, interaction);
            } else if (interaction.isButton() || interaction.isStringSelectMenu() || interaction.isModalSubmit()) {
                const commandName = interaction.customId.split('_')[0];
                const command = bot.commands.get(commandName);

                if (command && command.onInteraction) {
                    await command.onInteraction(bot, interaction);
                }
            }
        } catch (e) {
            console.error(chalk.red(`[INTERACTION ERROR] ▸ Error in interactionCreate event:`));
            console.error(chalk.red(e.stack));

            const embed = new EmbedBuilder()
                .setTitle('`❌` ▸ Error')
                .setDescription('> *An error occurred while executing this interaction.*')
                .setColor('Red')
                .setTimestamp();

            try {
                if (interaction.deferred || interaction.replied) {
                    await interaction.followUp({ embeds: [embed], ephemeral: true });
                } else {
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                }
            } catch (replyError) {
                console.error(chalk.red(`[REPLY ERROR] ▸ Could not send error message to user:`));
                console.error(chalk.red(replyError.stack));
            }
        }
    },
};
