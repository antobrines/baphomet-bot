const mongoose = require('mongoose');
const types = mongoose.Schema.Types;
const baphometSchema = mongoose.Schema({
  date: [{
    day: {
      type: types.String, 
      required: true,
    },
    hour: {
      type: types.String,
      required: true,
    },
  }],
  image: {
    type: types.String,
    required: true,
  },
  localisation: {
    type: types.String,
    required: true,
  }
});

const Baphomet = mongoose.model('Baphomet', baphometSchema);
module.exports = { Baphomet };