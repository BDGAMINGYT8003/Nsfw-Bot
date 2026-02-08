const { InteractionType, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, bot) {
        try {
            if (interaction.type === InteractionType.ApplicationCommand) {
                const command = bot.commands.get(interaction.commandName);
                if (!command || !command.execute) return;

                await command.execute(bot, interaction);
            } else if (interaction.isButton() || interaction.isStringSelectMenu() || interaction.isModalSubmit()) {
                // Find the command that handles this interaction
                // Often we can just check if the customId starts with the command name
                const commandName = interaction.customId.split('_')[0];
                const command = bot.commands.get(commandName);

                if (command && command.onInteraction) {
                    await command.onInteraction(bot, interaction);
                }
            }
        } catch (e) {
            console.error(e);
            const embed = new EmbedBuilder()
                .setTitle('`❌` ▸ Error')
                .setDescription('> *An error occurred while executing this interaction.*')
                .setColor('Red')
                .setTimestamp();

            if (interaction.deferred || interaction.replied) {
                await interaction.followUp({ embeds: [embed], ephemeral: true });
            } else {
                await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }
    },
};
