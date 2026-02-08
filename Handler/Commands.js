const fs = require('fs');
const chalk = require('chalk');

module.exports = (bot) => {
    const commandFiles = fs.readdirSync('./Commands/').filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`../Commands/${file}`);

        // Use the name from the SlashCommandBuilder data if available, otherwise from prefix metadata
        const name = command.data?.name || command.prefix?.name;

        if (name) {
            bot.commands.set(name, command);
            console.log(chalk.blue(`[COMMAND] ▸ Loaded ${file}`));

            if (command.prefix?.aliases && Array.isArray(command.prefix.aliases)) {
                command.prefix.aliases.forEach((alias) => {
                    bot.commands.set(alias, command);
                });
            }
        }
    }

    // Handle subfolders if any
    const commandSubFolders = fs.readdirSync('./Commands/').filter((folder) => !folder.endsWith('.js') && fs.lstatSync(`./Commands/${folder}`).isDirectory());

    for (const folder of commandSubFolders) {
        const subCommandFiles = fs.readdirSync(`./Commands/${folder}/`).filter((file) => file.endsWith('.js'));

        for (const file of subCommandFiles) {
            const command = require(`../Commands/${folder}/${file}`);
            const name = command.data?.name || command.prefix?.name;

            if (name) {
                bot.commands.set(name, command);
                console.log(chalk.blue(`[COMMAND] ▸ Loaded ${folder}/${file}`));

                if (command.prefix?.aliases && Array.isArray(command.prefix.aliases)) {
                    command.prefix.aliases.forEach((alias) => {
                        bot.commands.set(alias, command);
                    });
                }
            }
        }
    }
};
