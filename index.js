const { Client, GatewayIntentBits, AttachmentBuilder } = require("discord.js");
const cron = require("node-cron");
const dotenv = require("dotenv");
const { Baphomet } = require("./baphomet.model");
const { db } = require("./db");

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const channelId = "1043524016280973353";

const task1 = cron.schedule(
  "0 20 21 * * *",
  async () => {
    console.log("Cron job 1 started");
    await db();
    const channel = client.channels.cache.get(channelId);
    await sendMessage(channel, 10);
  },
  { timezone: "Europe/Paris" }
);

const task2 = cron.schedule(
  "0 0 21 * * *",
  async () => {
    console.log("Cron job 2 started");
    await db();
    const channel = client.channels.cache.get(channelId);
    await sendMessage(channel, 10);
  },
  { timezone: "Europe/Paris" }
);

const task3 = cron.schedule(
  "0 30 0 * * *",
  async () => {
    console.log("Cron job 3 started");
    await sendMessageWithParams(channel, "N'oubliez pas d'aller chercher votre énergie à la base de la guilde !");
  },
  { timezone: "Europe/Paris" }
);


task1.start();
task2.start();
task3.start();

const sendMessage = async (channel, time = 15) => {
  const date = new Date();
  const baphomet = await findCurrentBaphomet();
  const day = date.toLocaleString("fr-FR", { weekday: "long" });
  if (baphomet) {
    console.log(`Baphomet is: ${baphomet.localisation} at ${baphomet.date[0].hour}`);
    if (baphomet.date.some((date) => date.day === day)) {
      const hour = getHour();
      var baphometDate = baphomet.date.find((date) => date.day === day).hour;
      baphometHour = baphometDate.split(":")[0];
      if (hour === baphometHour) {
        console.log(`Baphomet hour is ${baphomet.date[0].hour}`);
        const attachments = new AttachmentBuilder(baphomet.image);
        console.log(`Sending message`);
        channel.send({
          content: `Le baphomet est à ${baphomet.localisation} dans ${time} minutes (${baphometDate}) ! <@&1058173757069463643>`,
          files: [attachments],
        });
        console.log(`Message sent`);
      }
    }
  }
  return false;
};

const sendMessageWithParams = async (channel, message) => {
  console.log(`Sending message with params: ${message}`);
  await channel.send({
    content: `${message} <@&1058173757069463643>`,
  });
  console.log(`Message sent`);
}

const getHour = () => {
  const date = new Date();
  const options = { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const formatter = new Intl.DateTimeFormat('fr-FR', options);
  const timeString = formatter.format(date);
  const hour = timeString.split(":")[0];
  return hour;
}

const findCurrentBaphomet = async () => {
  const date = new Date();
  const hour = getHour();
  const baphomet = await Baphomet.findOne({
    date: {
      $elemMatch: { 
        day: date.toLocaleString("fr-FR", { weekday: "long" }),
        hour: { $regex: `^${hour}` },
      },
    },
  });
  console.log(`Current baphomet: ${baphomet.localisation} at ${baphomet.date[0].hour}`);
  return baphomet;
};

const createBaphomet = async (date, image, localisation) => {
  await db();
  const baphomet = await Baphomet.findOne({ localisation });
  if (baphomet) {
    baphomet.date.push({
      day: date.toLocaleString("fr-FR", { weekday: "long" }),
      hour: `${date.getHours()}:${date.getMinutes()}`,
    });
    await baphomet.save();
  } else {
    await Baphomet.create({
      date: {
        day: date.toLocaleString("fr-FR", { weekday: "long" }),
        hour: `${date.getHours()}:${date.getMinutes()}`,
      },
      image,
      localisation,
    });
  }
};

client.login(process.env.DISCORD_TOKEN);
client.on("ready", async () => {
  await db();
  client.user.setActivity("Je suis Coco42");
});
