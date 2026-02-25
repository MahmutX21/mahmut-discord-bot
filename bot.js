const { Client, GatewayIntentBits, SlashCommandBuilder, ChannelType } = require('discord.js');
const { ChannelType } = require('discord.js');
const { Client, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

const commands = [
  new SlashCommandBuilder()
    .setName('join')
    .setDescription('Botu ses kanalına sokar.')
    .addChannelOption(option =>
      option.setName('kanal')
        .setDescription('Katılınacak ses kanalı')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildVoice)
    )
    .toJSON()
];

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Slash komutları yükleniyor...');
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );
    console.log('Slash komutları yüklendi!');
  } catch (error) {
    console.error(error);
  }
})();

client.once('ready', () => {
  console.log(`Bot olarak giriş yapıldı: ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'join') {
    const channel = interaction.options.getChannel('kanal');

    if (!channel || channel.type !== ChannelType.GuildVoice) {
      return interaction.reply({ content: 'Geçerli bir ses kanalı seç!', ephemeral: true });
    }

    try {
      joinVoiceChannel({
        channelId: channel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });

      await interaction.reply({ content: `✅ ${channel.name} kanalına girdim!`, ephemeral: true });

    } catch (err) {
      console.error(err);
      await interaction.reply({ content: 'Hata oluştu!', ephemeral: true });
    }
  }
});

client.login(token);
