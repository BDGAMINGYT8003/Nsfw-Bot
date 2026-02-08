const fs = require('fs');
const chalk = require('chalk');

module.exports = (bot) => {
  bot.slashCommands = [];
  const commandFiles = fs.readdirSync('./Commands/').filter((file) => file.endsWith('.js'));

  for (const file of commandFiles) {
    const props = require(`../Commands/${file}`);

    if (props.help && props.help.name) {
      bot.commands.set(props.help.name, props);
      if (props.help.aliases && Array.isArray(props.help.aliases)) {
        props.help.aliases.forEach((alias) => {
          bot.commands.set(alias, props);
        });
      }

      if (props.data) {
        bot.slashCommands.push(props.data.toJSON());
      }

      console.log(chalk.green(`[COMMAND]`) + chalk.white(` ▸ Loaded: `) + chalk.cyan(file));
    }
  }

  // Support for subfolders if any
  const commandSubFolders = fs.readdirSync('./Commands/').filter((folder) => !folder.endsWith('.js') && fs.lstatSync(`./Commands/${folder}`).isDirectory());

  for (const folder of commandSubFolders) {
    const subCommandFiles = fs.readdirSync(`./Commands/${folder}/`).filter((file) => file.endsWith('.js'));

    for (const file of subCommandFiles) {
      const props = require(`../Commands/${folder}/${file}`);

      if (props.help && props.help.name) {
        bot.commands.set(props.help.name, props);
        if (props.help.aliases && Array.isArray(props.help.aliases)) {
          props.help.aliases.forEach((alias) => {
            bot.commands.set(alias, props);
          });
        }

        if (props.data) {
          bot.slashCommands.push(props.data.toJSON());
        }

        console.log(chalk.green(`[COMMAND]`) + chalk.white(` ▸ Loaded: `) + chalk.cyan(`${folder}/${file}`));
      }
    }
  }
};
