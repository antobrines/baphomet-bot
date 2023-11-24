const { Client, GatewayIntentBits } = require("discord.js");
const cron = require("node-cron");
const dotenv = require("dotenv");
const { db } = require("./db");
const { sendMessage, sendMessageWithParams } = require("./functions");
dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const channelId = "1170488834979528745";

const task1 = cron.schedule(
  "0 20 21 * * *",
  async () => {
    console.log("Cron baphomet job started 21 20");
    await db();
    const channel = client.channels.cache.get(channelId);
    await sendMessage(channel, 10);
  },
  { timezone: "Europe/Paris" }
);

const task2 = cron.schedule(
  "45 29 0 * * *",
  async () => {
    console.log("Cron baphomet job started 0 20");
    await db();
    const channel = client.channels.cache.get(channelId);
    await sendMessage(channel, 10);
  },
  { timezone: "Europe/Paris" }
);

const task3 = cron.schedule(
  "0 0 20 * * *",
  async () => {
    console.log("Cron energie job started");
    const channel = client.channels.cache.get(channelId);
    var message = 'N\'oubliez pas d\'aller chercher votre énergie à la base de la guilde !';
    const date = new Date();
    const day = date.toLocaleString("fr-FR", { weekday: "long" });
    if (day === "samedi" || day === "dimanche") {
      message = 'N\'oubliez pas d\'aller chercher votre énergie à la base de la guilde et de faire votre fissure du weekend !';
    }
    await sendMessageWithParams(channel, message);
  },
  { timezone: "Europe/Paris" }
);

task1.start();
task2.start();
task3.start();

client.login(process.env.DISCORD_TOKEN);
client.on("ready", async () => {
  await db();
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("Je suis Coco42");
});
