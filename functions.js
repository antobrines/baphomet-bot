const { AttachmentBuilder } = require("discord.js");
const { Baphomet } = require("./baphomet.model");
const { createLogger } = require('./log');
const logger = createLogger('cron');

const sendMessage = async (channel, time = 15) => {
    const date = new Date();
    const baphomet = await findCurrentBaphomet();
    const day = date.toLocaleString("fr-FR", { weekday: "long" });
    if (baphomet) {
      logger.info(`Baphomet is: ${baphomet.localisation} at ${baphomet.date[0].hour}`);
      if (baphomet.date.some((date) => date.day === day)) {
        const hour = getHour();
        var baphometDate = baphomet.date.find((date) => date.day === day).hour;
        baphometHour = baphometDate.split(":")[0];
        if (hour === baphometHour) {
          logger.info(`Baphomet hour is ${baphomet.date[0].hour}`);
          const attachments = new AttachmentBuilder(baphomet.image);
          logger.info(`Sending message with params: ${baphomet.localisation} in ${time} minutes (${baphometDate})`);
          channel.send({
            content: `Le baphomet est à ${baphomet.localisation} dans ${time} minutes (${baphometDate}) ! <@&1058173757069463643>`,
            files: [attachments],
          });
          logger.info(`Message sent`);
        }
      }
    }
    return false;
  };
  
  const sendMessageWithParams = async (channel, message) => {
    logger.info(`Sending message with params: ${message}`);
    await channel.send(`${message} <@&1058173757069463643>`);
    logger.info(`Message sent`);
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
    logger.info(`Current baphomet: ${baphomet.localisation} at ${baphomet.date[0].hour}`);
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

exports.sendMessage = sendMessage;
exports.sendMessageWithParams = sendMessageWithParams;
exports.getHour = getHour;
exports.findCurrentBaphomet = findCurrentBaphomet;
exports.createBaphomet = createBaphomet;
