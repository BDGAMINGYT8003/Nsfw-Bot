const Discord = require('discord.js');

module.exports = {
    name: 'messageCreate',
    async execute(message, bot) {
        try {
            if (!message.guild || message.author.bot) return;

            const prefix = bot.prefix;
            const color = bot.color;

            const sendPrefixEmbed = () => {
                const embed = new Discord.EmbedBuilder()
                    .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                    .setTitle('`🪄` ▸ Prefix')
                    .setDescription(`> *The bot prefix is \`${prefix}\`.*`)
                    .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                    .setColor(color)
                    .setTimestamp();
                return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
            };

            if (message.content.startsWith(`<@${bot.user.id}>`)) {
                const args = message.content.slice(`<@${bot.user.id}>`.length).trim().split(/ +/);
                const commandName = args.shift()?.toLowerCase();

                if (!commandName) {
                    return sendPrefixEmbed();
                }

                let commandFile = bot.commands.get(commandName) || bot.commands.get(bot.aliases.get(commandName));

                if (!commandFile) {
                    return sendPrefixEmbed();
                }

                await commandFile.run(bot, message, args);
            } else if (message.content.startsWith(prefix)) {
                const args = message.content.slice(prefix.length).trim().split(/ +/);
                const commandName = args.shift()?.toLowerCase();

                let commandFile = bot.commands.get(commandName) || bot.commands.get(bot.aliases.get(commandName));
                if (!commandFile) return;

                await commandFile.run(bot, message, args);
            }
        } catch (e) {
            console.error(e);
        }
    },
};