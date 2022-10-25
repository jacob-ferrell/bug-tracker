const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    users: {
        type: Array,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    tickets: {
        type: Array,
        required: true
    },
}, {timestamps: true});

module.exports = mongoose.model('Project', projectSchema);