const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, bot) {
        try {
            if (interaction.isChatInputCommand()) {
                const command = bot.slashCommands.get(interaction.commandName);

                if (!command) return;

                try {
                    await command.execute(bot, interaction);
                } catch (error) {
                    console.error(error);
                    const embed = new EmbedBuilder()
                        .setTitle('`❌` ▸ Error occurred')
                        .setDescription(`> *There was an error while executing this command!*`)
                        .setColor('Red')
                        .setTimestamp();

                    if (interaction.replied || interaction.deferred) {
                        await interaction.followUp({ embeds: [embed], ephemeral: true });
                    } else {
                        await interaction.reply({ embeds: [embed], ephemeral: true });
                    }
                }
            } else if (interaction.isButton() || interaction.isAnySelectMenu() || interaction.isModalSubmit()) {
                // Route to handleInteraction inside individual command files
                // We extract the command name from the customId (e.g. "cmdName_action")
                const customIdParts = interaction.customId.split('_');
                const commandName = customIdParts[0];

                const command = bot.slashCommands.get(commandName) || bot.commands.get(commandName);

                if (command && command.handleInteraction) {
                    try {
                        await command.handleInteraction(bot, interaction);
                    } catch (error) {
                         console.error(error);
                         const embed = new EmbedBuilder()
                             .setTitle('`❌` ▸ Error occurred')
                             .setDescription(`> *There was an error while processing this interaction!*`)
                             .setColor('Red')
                             .setTimestamp();

                         if (interaction.replied || interaction.deferred) {
                             await interaction.followUp({ embeds: [embed], ephemeral: true });
                         } else {
                             await interaction.reply({ embeds: [embed], ephemeral: true });
                         }
                    }
                }
            }
        } catch (e) {
            console.error(e);
        }
    },
};