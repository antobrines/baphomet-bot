const { Client, GatewayIntentBits, AttachmentBuilder } = require("discord.js");
const cron = require("node-cron");
const dotenv = require("dotenv");
const { Baphomet } = require("./baphomet.model");
const { db } = require("./db");

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const channelId = "1043524016280973353";

const task1 = cron.schedule(
  "0 52 21 * * *",
  async () => {
    await db();
    const channel = client.channels.cache.get(channelId);
    await sendMessage(channel, 10);
  },
  { timezone: "Europe/Paris" }
);

const task2 = cron.schedule(
  "0 25 0 * * *",
  async () => {
    await db();
    const channel = client.channels.cache.get(channelId);
    await sendMessage(channel, 10);
  },
  { timezone: "Europe/Paris" }
);

task1.start();
task2.start();

const sendMessage = async (channel, time = 15) => {
  const date = new Date();
  const baphomet = await findCurrentBaphomet();
  const day = date.toLocaleString("fr-FR", { weekday: "long" });
  if (baphomet) {
    if (baphomet.date.some((date) => date.day === day)) {
      const hour = getHour();
      var baphometDate = baphomet.date.find((date) => date.day === day).hour;
      baphometHour = baphometDate.split(":")[0];
      console.log(hour, baphomet);
      if (hour === baphometHour) {
        const attachments = new AttachmentBuilder(baphomet.image);
        channel.send({
          content: `Le baphomet est à ${baphomet.localisation} dans ${time} minutes (${baphometDate}) !`,
          files: [attachments],
        });
      }
    }
  }
  return false;
};

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
  console.log(timeString, hour);
  console.log(date.toLocaleString("fr-FR", { weekday: "long" }));
  const baphomet = await Baphomet.findOne({
    date: {
      $elemMatch: { 
        day: date.toLocaleString("fr-FR", { weekday: "long" }),
        hour: { $regex: `^${hour}` },
      },
    },
  });
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
  const baphomet = await findCurrentBaphomet();
  console.log(baphomet);
  // createBaphomet(
  //   new Date(Date.now()),
  //   "https://cdn.discordapp.com/attachments/1156329477031329853/1170512688003154150/image.png?ex=65594fe3&is=6546dae3&hm=4fea8867255224d64fc4d4b640c505f1d9c40ac0c3512988c9b0c3f5331463b0&",
  //   "Rukurangma"
  // );
  // + 86400000
  client.user.setActivity("Je suis Coco42");
});
