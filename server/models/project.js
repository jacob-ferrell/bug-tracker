const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    tickets: {
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
    users: {
        type: Array,
        required: true
    },
}, {timestamps: true});

module.exports = mongoose.model('Project', projectSchema);