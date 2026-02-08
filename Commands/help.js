const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays the list of commands.')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('The command to get details for.')
                .setRequired(false)),
    prefix: {
        name: 'help',
        aliases: ['h', 'aide'],
        description: 'Displays the list of commands.',
        use: 'help [command]',
    },
    async run(bot, message, args) {
        if (!args[0]) {
            return this.sendHelpMenu(bot, message);
        } else {
            return this.sendCommandDetails(bot, message, args[0]);
        }
    },
    async execute(bot, interaction) {
        const commandName = interaction.options.getString('command');
        if (!commandName) {
            return this.sendHelpMenu(bot, interaction);
        } else {
            return this.sendCommandDetails(bot, interaction, commandName);
        }
    },
    async sendHelpMenu(bot, target) {
        const isInteraction = target.isChatInputCommand?.() || target.isStringSelectMenu?.();
        const user = isInteraction ? target.user : target.author;

        const commandNames = new Set();
        const commands = bot.commands.filter(cmd => {
            const name = cmd.data?.name || cmd.prefix?.name;
            if (name && !commandNames.has(name)) {
                commandNames.add(name);
                return true;
            }
            return false;
        });

        const commandsList = commands.map(cmd => {
            const name = cmd.data?.name || cmd.prefix?.name;
            const use = cmd.prefix?.use || name;
            const description = cmd.data?.description || cmd.prefix?.description;
            return `\`${bot.prefix}${use}\`\n*— ${description}*`;
        }).join('\n');

        const embed = new EmbedBuilder()
            .setTitle('`🪄` ▸ Help menu')
            .setDescription(commandsList)
            .setFooter({ text: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
            .setColor(bot.color)
            .setTimestamp();

        // Optional: Add a select menu for categories (if we had categories)
        // For now, let's just send the embed

        if (isInteraction) {
            return target.reply({ embeds: [embed] });
        } else {
            return target.reply({ embeds: [embed] });
        }
    },
    async sendCommandDetails(bot, target, commandName) {
        const isInteraction = target.isChatInputCommand?.();
        const user = isInteraction ? target.user : target.author;

        const command = bot.commands.get(commandName.toLowerCase());
        if (!command) {
            const embed = new EmbedBuilder()
                .setTitle('`❌` ▸ Invalid arguments')
                .setDescription('> *Please provide an existing command.*')
                .setFooter({ text: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
                .setColor('Red')
                .setTimestamp();
            if (isInteraction) return target.reply({ embeds: [embed], ephemeral: true });
            return target.reply({ embeds: [embed] });
        }

        const name = command.data?.name || command.prefix?.name;
        const use = command.prefix?.use || name;
        const description = command.data?.description || command.prefix?.description;
        const aliases = command.prefix?.aliases?.map(a => `\`${a}\``).join(', ') || '`None.`';

        const embed = new EmbedBuilder()
            .setTitle(`` + '`🪄` ▸ ' + name)
            .setDescription(`> *Command:* \`${bot.prefix}${use}\`\n> *Description:* \`${description}\`\n> *Aliases:* ${aliases}`)
            .setFooter({ text: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
            .setColor(bot.color)
            .setTimestamp();

        if (isInteraction) return target.reply({ embeds: [embed] });
        return target.reply({ embeds: [embed] });
    }
};
