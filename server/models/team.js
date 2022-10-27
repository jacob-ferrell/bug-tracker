const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    members: {
        type: Array,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    creator: {
        type: String,
        required: true
    },
}, {timestamps: true});

module.exports = mongoose.model('Team', teamSchema);