const { Client, Collection, GatewayIntentBits, Partials, REST, Routes } = require('discord.js');
const chalk = require('chalk');
const fs = require('fs');
const db = require('./Database/db.js');

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember],
  allowedMentions: { repliedUser: false }
});

bot.commands = new Collection();
bot.db = db;

// Load Handlers
console.log(chalk.blue.bold('\n--- Initializing Bot ---'));

require('./Handler/Commands.js')(bot);
require('./Handler/Events.js')(bot);
require('./Handler/anticrash.js')(bot);

const TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

if (!TOKEN) {
  console.log(chalk.red.bold('[ERROR]') + chalk.white(' ▸ BOT_TOKEN is not defined in environment variables.'));
  process.exit(1);
}

bot.login(TOKEN).then(async () => {
  console.log(chalk.green.bold('[SUCCESS]') + chalk.white(` ▸ Logged in as ${bot.user.tag}`));

  // Register Slash Commands
  if (CLIENT_ID && bot.slashCommands && bot.slashCommands.length > 0) {
    const rest = new REST({ version: '10' }).setToken(TOKEN);
    try {
      console.log(chalk.yellow.bold('[INFO]') + chalk.white(' ▸ Started refreshing global application (/) commands.'));

      await rest.put(
        Routes.applicationCommands(CLIENT_ID),
        { body: bot.slashCommands },
      );

      console.log(chalk.green.bold('[SUCCESS]') + chalk.white(' ▸ Successfully reloaded global application (/) commands.'));
    } catch (error) {
      console.error(chalk.red.bold('[ERROR]') + chalk.white(' ▸ Failed to register slash commands:'), error);
    }
  } else if (!CLIENT_ID) {
    console.log(chalk.yellow.bold('[WARNING]') + chalk.white(' ▸ CLIENT_ID not provided. Slash commands will not be registered.'));
  }
}).catch((err) => {
  console.log(chalk.red.bold('[ERROR]') + chalk.white(' ▸ Failed to login:'), err);
});
