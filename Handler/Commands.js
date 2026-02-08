const fs = require('fs');
const chalk = require('chalk');
const path = require('path');

module.exports = (bot) => {
    const commandsPath = path.join(__dirname, '../Commands');

    const loadCommands = (dir) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            if (fs.lstatSync(fullPath).isDirectory()) {
                loadCommands(fullPath);
            } else if (file.endsWith('.js')) {
                try {
                    const command = require(fullPath);
                    const name = command.data?.name || command.prefix?.name;

                    if (name) {
                        bot.commands.set(name, command);
                        console.log(chalk.blue(`[COMMAND] ▸ Loaded ${file}`));

                        if (command.prefix?.aliases && Array.isArray(command.prefix.aliases)) {
                            command.prefix.aliases.forEach((alias) => {
                                bot.commands.set(alias, command);
                            });
                        }
                    } else {
                        console.warn(chalk.yellow(`[COMMAND WARNING] ▸ ${file} is missing a name.`));
                    }
                } catch (error) {
                    console.error(chalk.red(`[COMMAND ERROR] ▸ Failed to load ${file}:`));
                    console.error(chalk.red(error.stack));
                }
            }
        }
    };

    if (fs.existsSync(commandsPath)) {
        loadCommands(commandsPath);
    } else {
        console.error(chalk.red(`[COMMAND ERROR] ▸ Commands directory not found at ${commandsPath}`));
    }
};
