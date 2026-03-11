const fs = require('fs');
const path = require('path');

const commandsDir = path.join(__dirname, 'Commands');
const files = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

for (const file of files) {
  const filePath = path.join(commandsDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  let newContent = `const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

`;

  // Special handling for help.js
  if (file === 'help.js') {
    newContent = `const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays the list of commands.')
    .addStringOption(option =>
      option.setName('command')
        .setDescription('The command to get help for')
        .setRequired(false)
    ),
  help: {
    name: 'help',
    aliases: ['h', 'aide'],
    description: 'Displays the list of commands.',
    use: 'help [command]',
  },
  async run(bot, message, args, config) {
    bot.db.incrementUsage('help');
    const commandArg = args[0];
    return this.sendHelp(bot, message, commandArg, config, message.author);
  },
  async execute(bot, interaction, options, config) {
    bot.db.incrementUsage('help');
    const commandArg = options.getString('command');
    return this.sendHelp(bot, interaction, commandArg, config, interaction.user);
  },
  async sendHelp(bot, context, commandArg, config, user) {
    if (!commandArg) {
      const commandNames = new Set();
      const commandsList = bot.commands.filter(command => {
        if (!commandNames.has(command.help.name)) {
          commandNames.add(command.help.name);
          return true;
        }
        return false;
      }).map(command => {
        return \`\\\`\${config.prefix}\${command.help.use}\\\`\\n*— \${command.help.description}*\`;
      }).join('\\n');

      const embed = new EmbedBuilder()
        .setTitle('\`🪄\` ▸ Help menu')
        .setDescription(commandsList)
        .setFooter({ text: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
        .setColor(config.color)
        .setTimestamp();
      return context.reply({ embeds: [embed] });
    } else {
      const command = bot.commands.get(commandArg);
      if (!command) {
        const embed = new EmbedBuilder()
          .setTitle('\`❌\` ▸ Invalid arguments')
          .setDescription('> *Please provide an existing command.*')
          .setFooter({ text: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
          .setColor('Red')
          .setTimestamp();
        return context.reply({ embeds: [embed], ephemeral: true });
      } else {
        const embed = new EmbedBuilder()
          .setTitle(\`\\\`🪄\\\` ▸ \${command.help.name}\`)
          .setDescription(\`> *Command:* \\\`\${config.prefix}\${command.help.use}\\\`\\n> *Description:* \\\`\${command.help.description}\\\`\\n> *Aliases:* \${command.help.aliases.map(a => \`\\\`\${a}\\\`\`).join(', ') || '\`None.\`'}\`)
          .setFooter({ text: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
          .setColor(config.color)
          .setTimestamp();
        return context.reply({ embeds: [embed] });
      }
    }
  }
};
`;
  } else {
    const nameMatch = content.match(/name:\s*'([^']+)'/);
    const descMatch = content.match(/description:\s*'([^']+)'/);
    const useMatch = content.match(/use:\s*'([^']+)'/);
    const typeMatch = content.match(/type=([^']+)'/);

    if (!nameMatch || !descMatch || !useMatch) {
      console.log(`Skipping ${file} due to missing metadata`);
      continue;
    }

    const name = nameMatch[1];
    const desc = descMatch[1];
    const use = useMatch[1];
    const type = typeMatch ? typeMatch[1] : name;

    newContent += `module.exports = {
  data: new SlashCommandBuilder()
    .setName('${name}')
    .setDescription('${desc}'),
  help: {
    name: '${name}',
    aliases: [],
    description: '${desc}',
    use: '${use}',
  },
  async run(bot, message, args, config) {
    bot.db.incrementUsage('${name}');
    return this.sendImage(bot, message, config, message.author, message.guild, message.channel);
  },
  async execute(bot, interaction, options, config) {
    bot.db.incrementUsage('${name}');
    return this.sendImage(bot, interaction, config, interaction.user, interaction.guild, interaction.channel);
  },
  async sendImage(bot, context, config, user, guild, channel) {
    if (config.nsfwChannel && !channel.nsfw) {
      const embed = new EmbedBuilder()
        .setTitle('\`❌\` ▸ Not NSFW channel')
        .setDescription(\`> *This command can only be used in NSFW channels.*\`)
        .setFooter({ text: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
        .setColor('Red')
        .setTimestamp();
      return context.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      const response = await axios.get('https://nekobot.xyz/api/image?type=${type}');

      const embed = new EmbedBuilder()
        .setTitle('\`🔞\` ▸ ${desc.replace('Displays a ', '').replace('.', '')}')
        .setImage(response.data.message)
        .setFooter({ text: guild ? guild.name : user.username, iconURL: guild ? guild.iconURL({ dynamic: true }) : user.displayAvatarURL({ dynamic: true }) })
        .setColor(config.color)
        .setTimestamp();

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setEmoji('📎')
            .setLabel(' ▸ Link')
            .setStyle(ButtonStyle.Link)
            .setURL(response.data.message)
        );

      return context.reply({ embeds: [embed], components: [row] });
    } catch {
      const embed = new EmbedBuilder()
        .setTitle('\`❌\` ▸ Error occurred')
        .setDescription(\`> *An error occurred while fetching the image. Please try again later.*\`)
        .setFooter({ text: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
        .setColor('Red')
        .setTimestamp();
      return context.reply({ embeds: [embed], ephemeral: true });
    }
  }
};
`;
  }

  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log(`Migrated ${file}`);
}
