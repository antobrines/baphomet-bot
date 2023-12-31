const { Client, GatewayIntentBits, Events } = require('discord.js');
const { createLogger } = require('./log');
const cron = require('node-cron');
const dotenv = require('dotenv');
const { db } = require('./db');
const { sendMessage, sendMessageWithParams } = require('./functions');
dotenv.config();

// commands
const craft = require('./commands/craft');

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
    // add to it a list of 'Faire 2 quêtes répétitives' 'Fait 3 ...', 'Faire 2 combat arène
    message += '\n\n**Faire 2 quêtes répétitives**\n**Faire 3 chemins de l\'entraînement**\n**Faire 1 défis quotidien**';
    await sendMessageWithParams(channel, message);
  },
  { timezone: 'Europe/Paris' }
);

task1.start();
task2.start();
task3.start();


client.on('ready', async () => {
  await db();
  logger.info(`Logged in as ${client.user.tag} !`);
  client.user.setActivity('Je suis Coco42');
  client.user.setUsername('Wyvria Bot');
});


const handleInteraction = async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;
  if (commandName === 'craft') {
    await craft.execute(interaction);
  }
};

client.on(Events.InteractionCreate, handleInteraction);

// eslint-disable-next-line no-undef
client.login(process.env.DISCORD_TOKEN);