const { AttachmentBuilder } = require("discord.js");
const { Baphomet } = require("./baphomet.model");

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
    await channel.send(`${message} <@&1058173757069463643>`,
    );
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

exports.sendMessage = sendMessage;
exports.sendMessageWithParams = sendMessageWithParams;
exports.getHour = getHour;
exports.findCurrentBaphomet = findCurrentBaphomet;
exports.createBaphomet = createBaphomet;
