const fs = require('fs');
const chalk = require('chalk');
const path = require('path');

module.exports = (bot) => {
    const eventsPath = path.join(__dirname, '../Events');

    const loadEvents = (dir) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            if (fs.lstatSync(fullPath).isDirectory()) {
                loadEvents(fullPath);
            } else if (file.endsWith('.js')) {
                try {
                    const event = require(fullPath);
                    if (event.name) {
                        if (event.once) {
                            bot.once(event.name, (...args) => event.execute(...args, bot));
                        } else {
                            bot.on(event.name, (...args) => event.execute(...args, bot));
                        }
                        console.log(chalk.yellow(`[EVENT] ▸ Loaded ${file}`));
                    } else {
                        console.warn(chalk.yellow(`[EVENT WARNING] ▸ ${file} is missing a name.`));
                    }
                } catch (error) {
                    console.error(chalk.red(`[EVENT ERROR] ▸ Failed to load ${file}:`));
                    console.error(chalk.red(error.stack));
                }
            }
        }
    };

    if (fs.existsSync(eventsPath)) {
        loadEvents(eventsPath);
    } else {
        console.error(chalk.red(`[EVENT ERROR] ▸ Events directory not found at ${eventsPath}`));
    }
};
