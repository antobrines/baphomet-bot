const { Client, GatewayIntentBits } = require('discord.js');
const { createLogger } = require('./log');
const cron = require('node-cron');
const dotenv = require('dotenv');
const { db } = require('./db');
const { sendMessage, sendMessageWithParams } = require('./functions');
dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const channelId = '1170488834979528745';
const logger = createLogger('cron');

const task1 = cron.schedule(
  '0 20 21 * * *',
  async () => {
    logger.info('Cron baphomet job started 21 20');
    await db();
    const channel = client.channels.cache.get(channelId);
    await sendMessage(channel, 10);
  },
  { timezone: 'Europe/Paris' }
);

const task2 = cron.schedule(
  '0 20 0 * * *',
  async () => {
    logger.info('Cron baphomet job started 0 20');
    await db();
    const channel = client.channels.cache.get(channelId);
    await sendMessage(channel, 10);
  },
  { timezone: 'Europe/Paris' }
);

const task3 = cron.schedule(
  '0 0 20 * * *',
  async () => {
    logger.info('Cron energy job started 20 0');
    const channel = client.channels.cache.get(channelId);
    var message = 'N\'oubliez pas d\'aller chercher votre **énergie** à la base de la guilde !';
    const date = new Date();
    const day = date.toLocaleString('fr-FR', { weekday: 'long' });
    if (day === 'samedi' || day === 'dimanche') {
      logger.info('it\'s weekend so fissure message sent');
      message = 'N\'oubliez pas d\'aller chercher votre **énergie** à la base de la guilde et de faire votre **fissure** du weekend !';
    }
    await sendMessageWithParams(channel, message);
  },
  { timezone: 'Europe/Paris' }
);

task1.start();
task2.start();
task3.start();

// eslint-disable-next-line no-undef
client.login(process.env.DISCORD_TOKEN);
client.on('ready', async () => {
  await db();
  logger.info(`Logged in as ${client.user.tag} !`);
  // const channel = client.channels.cache.get(channelId);
  // sendMessageWithParams(channel, "Nouveau format de message !", false)
  client.user.setActivity('Je suis Coco42');
  client.user.setUsername('Wyvria Bot');
});
