const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Bot aktif');
});

app.listen(3000, () => {
  console.log('Web server çalışıyor.');
});
const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const token = process.env.TOKEN;

client.once('ready', () => {
  console.log(`Bot aktif: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content === '+join') {

    if (!message.member.voice.channel) {
      return message.reply('Önce bir ses kanalına gir.');
    }

    try {
      joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
      });

      message.reply('✅ Ses kanalına girdim!');

    } catch (err) {
      console.error(err);
      message.reply('❌ Ses kanalına giremedim.');
    }
  }
});

client.login(token);
