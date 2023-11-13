const mongoose = require('mongoose');
const types = mongoose.Schema.Types;
const baphometSchema = mongoose.Schema({
    date: [{
        day: {
            type: String, 
            required: true,
        },
        hour: {
            type: String,
            required: true,
        },
    }],
    image: {
        type: String,
        required: true,
    },
    localisation: {
        type: String,
        required: true,
    }
});

const Baphomet = mongoose.model('Baphomet', baphometSchema);
module.exports = { Baphomet };