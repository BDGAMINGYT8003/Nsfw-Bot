const fs = require('fs');
const chalk = require('chalk');

module.exports = (bot) => {
    const eventFiles = fs.readdirSync('./Events/').filter((file) => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(`../Events/${file}`);

        if (event.name) {
            if (event.once) {
                bot.once(event.name, (...args) => event.execute(...args, bot));
            } else {
                bot.on(event.name, (...args) => event.execute(...args, bot));
            }
            console.log(chalk.yellow(`[EVENT] ▸ Loaded ${file}`));
        }
    }

    const eventSubFolders = fs.readdirSync('./Events/').filter((folder) => !folder.endsWith('.js') && fs.lstatSync(`./Events/${folder}`).isDirectory());

    for (const folder of eventSubFolders) {
        const subEventFiles = fs.readdirSync(`./Events/${folder}/`).filter((file) => file.endsWith('.js'));

        for (const file of subEventFiles) {
            const event = require(`../Events/${folder}/${file}`);

            if (event.name) {
                if (event.once) {
                    bot.once(event.name, (...args) => event.execute(...args, bot));
                } else {
                    bot.on(event.name, (...args) => event.execute(...args, bot));
                }
                console.log(chalk.yellow(`[EVENT] ▸ Loaded ${folder}/${file}`));
            }
        }
    }
};
