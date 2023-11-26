const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { createLogger } = require('./log');
const logger = createLogger('db');
dotenv.config();
const db = async () => {
  // eslint-disable-next-line no-undef
  await mongoose.connect(process.env.MONGO_URL, {});
  logger.info('Connected to db');
};

module.exports = { db };


