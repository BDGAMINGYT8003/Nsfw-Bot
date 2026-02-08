const { Client, Collection, GatewayIntentBits, Partials, REST, Routes } = require('discord.js');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
    ],
    partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember],
    allowedMentions: { repliedUser: false }
});

bot.commands = new Collection();

// Configuration from Replit Secrets
const TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
bot.prefix = process.env.BOT_PREFIX || '!';
bot.color = '#2b2d31'; // Default color

// Load Handlers
['Commands', 'Events', 'anticrash'].forEach(handler => {
    try {
        require(`./Handler/${handler}`)(bot);
    } catch (error) {
        console.error(chalk.red(`[HANDLER ERROR] ▸ Failed to load ${handler}:`), error.stack);
    }
});

async function registerSlashCommands() {
    const commands = [];

    // Scan Commands directory recursively
    const getCommandFiles = (dir) => {
        let files = [];
        if (!fs.existsSync(dir)) return files;
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            if (fs.lstatSync(fullPath).isDirectory()) {
                files = files.concat(getCommandFiles(fullPath));
            } else if (item.endsWith('.js')) {
                files.push(fullPath);
            }
        }
        return files;
    };

    const commandFiles = getCommandFiles('./Commands');

    for (const filePath of commandFiles) {
        try {
            const command = require(`./${filePath}`);
            if (command.data) {
                commands.push(command.data.toJSON());
            }
        } catch (error) {
            console.error(chalk.red(`[REGISTRATION ERROR] ▸ Failed to load command for registration at ${filePath}:`), error.stack);
        }
    }

    const rest = new REST({ version: '10' }).setToken(TOKEN);

    try {
        console.log(chalk.cyan(`[!] — Starting to refresh application (/) commands...`));

        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands },
        );

        console.log(chalk.green(`[!] — Successfully reloaded application (/) commands.`));
    } catch (error) {
        console.error(chalk.red(`[!] — Error reloading application (/) commands:`), error.stack);
    }
}

bot.login(TOKEN).then(() => {
    console.log(chalk.magenta.bold(`
    ╔════════════════════════════════════════════════════╗
    ║                                                    ║
    ║  ${bot.user.tag} is now online!         ║
    ║  Prefix: ${bot.prefix}                                     ║
    ║                                                    ║
    ╚════════════════════════════════════════════════════╝
    `));
    registerSlashCommands();
}).catch((err) => {
    console.log(chalk.red('[!] — Please configure a valid bot token in Replit Secrets'));
    console.error(chalk.red(err.stack));
});

// Robust Error Handling for the process
process.on('unhandledRejection', (reason, promise) => {
    console.error(chalk.red(' [UNHANDLED REJECTION] ▸'), reason.stack || reason);
});

process.on('uncaughtException', (err, origin) => {
    console.error(chalk.red(' [UNCAUGHT EXCEPTION] ▸'), err.stack);
});
