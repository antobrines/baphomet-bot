const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const myFormat = winston.format.printf(({ level, message }) => {
  const date = new Date();
  const options = { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const formatter = new Intl.DateTimeFormat('fr-FR', options);
  const timeString = formatter.format(date);
  // day is like 'samedi 20/01/2021'
  const day = date.toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' });
  const formattedDate = `${day} ${timeString}`;
  return `${formattedDate} | ${level}: ${message}`;
});

const createTransports = (folderName) => {
  const transports = [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ];
  if (folderName) {
    transports.push(
      new DailyRotateFile({
        filename: `logs/${folderName}/%DATE%.log`,
        datePattern: 'DD-MM-YYYY',
        zippedArchive: true,
        format: winston.format.combine(winston.format.timestamp(), myFormat),
      })
    );
  }

  return transports;
};

const createLogger = (logPath) => {
  const logger = winston.createLogger({
    transports: createTransports(logPath),
  });

  return logger;
};

module.exports = { createLogger };