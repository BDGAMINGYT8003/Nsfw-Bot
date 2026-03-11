const Discord = require('discord.js');
const chalk = require('chalk');
const fs = require('fs');
const { REST, Routes } = require('discord.js');
require('dotenv').config();

// Secrets from environment
const BOT_TOKEN = process.env.BOT_TOKEN;
const BOT_PREFIX = process.env.BOT_PREFIX || '!';
const CLIENT_ID = process.env.CLIENT_ID;

const bot = new Discord.Client({
  allowedMentions: { repliedUser: false },
  intents: 3276799,
  partials: [
    Discord.Partials.Channel,
    Discord.Partials.Message,
    Discord.Partials.User,
    Discord.Partials.GuildMember,
    Discord.Partials.Reaction,
    Discord.Partials.ThreadMember,
    Discord.Partials.GuildScheduledEvent
  ]
});

bot.commands = new Discord.Collection();
bot.slashCommands = new Discord.Collection();
bot.setMaxListeners(70);

// Set up Config structure
bot.config = {
  token: BOT_TOKEN,
  prefix: BOT_PREFIX,
  clientId: CLIENT_ID,
  color: "#2b2d31",
  nsfwChannel: true
};

console.log(chalk.bold.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
console.log(chalk.bold.magenta('                       Starting NSFW Bot...                                      '));
console.log(chalk.bold.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

// Initialize Database
const db = require('./Handler/database');
bot.db = db;

// Load commands and prepare slash commands data
const slashCommandsData = [];

console.log(chalk.yellow('[i] Loading commands...'));

const loadCommands = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = `${dir}/${file}`;
    const stat = fs.lstatSync(fullPath);
    if (stat.isDirectory()) {
      loadCommands(fullPath);
    } else if (file.endsWith('.js')) {
      const command = require(`./${fullPath}`);
      if (command.help && command.help.name) {
        bot.commands.set(command.help.name, command);
        if (command.help.aliases && Array.isArray(command.help.aliases)) {
          command.help.aliases.forEach(alias => bot.commands.set(alias, command));
        }
      }

      if (command.data) {
        bot.slashCommands.set(command.data.name, command);
        slashCommandsData.push(command.data.toJSON());
      }
      console.log(chalk.green(`[+] Loaded command: ${file}`));
    }
  }
};

loadCommands('Commands');

// Load events
const loadEvents = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = `${dir}/${file}`;
    const stat = fs.lstatSync(fullPath);
    if (stat.isDirectory()) {
      loadEvents(fullPath);
    } else if (file.endsWith('.js')) {
      const event = require(`./${fullPath}`);
      if (event.once) {
        bot.once(event.name, (...args) => event.execute(...args, bot));
      } else {
        bot.on(event.name, (...args) => event.execute(...args, bot));
      }
      console.log(chalk.green(`[+] Loaded event: ${file}`));
    }
  }
};

console.log(chalk.yellow('[i] Loading events...'));
loadEvents('Events');

const anticrashHandler = require('./Handler/anticrash');
anticrashHandler(bot);

bot.login(BOT_TOKEN).then(async () => {
  console.log(chalk.bold.green(`[!] — Logged in as ${bot.user.tag} (${bot.user.id})`));

  if (CLIENT_ID && BOT_TOKEN) {
    const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);
    try {
      console.log(chalk.yellow(`[i] Started refreshing ${slashCommandsData.length} application (/) commands.`));

      await rest.put(
        Routes.applicationCommands(CLIENT_ID),
        { body: slashCommandsData },
      );

      console.log(chalk.bold.green(`[!] Successfully reloaded application (/) commands globally.`));
    } catch (error) {
      console.error(chalk.red('[!] Error registering slash commands:'), error);
    }
  } else {
    console.log(chalk.red('[!] CLIENT_ID or BOT_TOKEN is missing. Skipping slash command registration.'));
  }

}).catch(() => {
  console.log(chalk.red('[!] — Please configure a valid bot token in environment variables.'));
});
