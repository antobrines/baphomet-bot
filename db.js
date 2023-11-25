const mongoose = require('mongoose');
const dotenv = require("dotenv");
const { createLogger } = require('./log');
const logger = createLogger('db');
dotenv.config();
const db = async () => {
    await mongoose.connect(process.env.MONGO_URL, {});
    logger.info("Connected to db");
}

module.exports = { db };


