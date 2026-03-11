require('dotenv').config();
const { Client, Collection, Partials, GatewayIntentBits, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const JSONDatabase = require('./utils/Database');

// Initialize the Database
const db = new JSONDatabase('./database.json');

// Intents and Partials setup
const bot = new Client({
    allowedMentions: { repliedUser: false },
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
        Partials.Reaction,
    ]
});

// Collections
bot.commands = new Collection();
bot.slashCommands = new Collection();
bot.aliases = new Collection();
bot.db = db;

// Setup constants from process.env with fallbacks
bot.prefix = process.env.BOT_PREFIX || '!';
bot.color = process.env.EMBED_COLOR || '#2b2d31';
const token = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;

if (!token) {
    console.log(chalk.red('[!] — Please configure a valid bot token in process.env.BOT_TOKEN'));
    process.exit(1);
}

// ---------------------------------------------------------
// Load Commands and Slash Commands
// ---------------------------------------------------------
const slashCommandsArray = [];
console.log(chalk.cyan('--- Loading Commands ---'));

const loadCommands = (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            loadCommands(fullPath);
        } else if (file.endsWith('.js')) {
            const command = require(`./${fullPath.replace(/\\/g, '/')}`);

            // Prefix Command Registration
            if (command.help && command.help.name) {
                bot.commands.set(command.help.name, command);
                if (command.help.aliases && Array.isArray(command.help.aliases)) {
                    command.help.aliases.forEach(alias => bot.aliases.set(alias, command.help.name));
                }
                console.log(chalk.green(`[+] Prefix Command Loaded: ${command.help.name}`));
            }

            // Slash Command Registration
            if (command.slash && command.slash.name) {
                bot.slashCommands.set(command.slash.name, command);
                slashCommandsArray.push(command.slash.toJSON ? command.slash.toJSON() : command.slash);
                console.log(chalk.green(`[+] Slash Command Loaded: ${command.slash.name}`));
            }
        }
    }
};

loadCommands('Commands');

// ---------------------------------------------------------
// Load Events
// ---------------------------------------------------------
console.log(chalk.cyan('--- Loading Events ---'));

const loadEvents = (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            loadEvents(fullPath);
        } else if (file.endsWith('.js')) {
            const event = require(`./${fullPath.replace(/\\/g, '/')}`);
            if (event.name) {
                if (event.once) {
                    bot.once(event.name, (...args) => event.execute(...args, bot));
                } else {
                    bot.on(event.name, (...args) => event.execute(...args, bot));
                }
                console.log(chalk.blue(`[+] Event Loaded: ${event.name}`));
            }
        }
    }
};

loadEvents('Events');

// ---------------------------------------------------------
// Anti-Crash Handler
// ---------------------------------------------------------
process.on('unhandledRejection', (reason, p) => {
    console.log(chalk.red('\n[Anti-Crash] :: Unhandled Rejection/Catch'));
    console.log(reason, p);
});
process.on('uncaughtException', (err, origin) => {
    console.log(chalk.red('\n[Anti-Crash] :: Uncaught Exception/Catch'));
    console.log(err, origin);
});
process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log(chalk.red('\n[Anti-Crash] :: Uncaught Exception/Catch (MONITOR)'));
    console.log(err, origin);
});

// ---------------------------------------------------------
// Login & Sync Slash Commands
// ---------------------------------------------------------
bot.login(token).then(async () => {
    console.log(chalk.yellow(`[!] — Logged in as ${bot.user.tag} (${bot.user.id})`));

    // Register Slash Commands Globally
    if (clientId) {
        try {
            console.log(chalk.cyan(`--- Started refreshing ${slashCommandsArray.length} application (/) commands. ---`));
            const rest = new REST({ version: '10' }).setToken(token);

            await rest.put(
                Routes.applicationCommands(clientId),
                { body: slashCommandsArray },
            );

            console.log(chalk.green(`--- Successfully reloaded application (/) commands. ---`));
        } catch (error) {
            console.error(chalk.red('[!] Failed to register slash commands:'));
            console.error(error);
        }
    } else {
         console.log(chalk.red('[!] CLIENT_ID is missing in process.env, skipped global slash command registration.'));
    }
}).catch((e) => {
    console.log(chalk.red('[!] — Failed to log in. Please check your BOT_TOKEN.'));
    console.error(e);
});