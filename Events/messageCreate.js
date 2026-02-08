const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'messageCreate',
    async execute(message, bot) {
        try {
            if (!message.guild || message.author.bot) return;

            const prefix = bot.prefix;

            const sendPrefixEmbed = () => {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                    .setTitle('`🪄` ▸ Prefix')
                    .setDescription(`> *The bot prefix is \`${prefix}\`.*`)
                    .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                    .setColor(bot.color)
                    .setTimestamp();
                return message.reply({ embeds: [embed] });
            };

            if (message.content.startsWith(`<@${bot.user.id}>`) || message.content.startsWith(`<@!${bot.user.id}>`)) {
                const mention = message.content.startsWith(`<@${bot.user.id}>`) ? `<@${bot.user.id}>` : `<@!${bot.user.id}>`;
                const args = message.content.slice(mention.length).trim().split(/ +/);
                const commandName = args.shift()?.toLowerCase();

                if (!commandName) {
                    return sendPrefixEmbed();
                }

                const command = bot.commands.get(commandName);
                if (!command || !command.run) {
                    return sendPrefixEmbed();
                }

                await command.run(bot, message, args);
            } else if (message.content.startsWith(prefix)) {
                const args = message.content.slice(prefix.length).trim().split(/ +/);
                const commandName = args.shift()?.toLowerCase();

                const command = bot.commands.get(commandName);
                if (!command || !command.run) return;

                await command.run(bot, message, args);
            }
        } catch (e) {
            console.error(e);
        }
    },
};
