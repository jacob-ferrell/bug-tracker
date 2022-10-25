const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    creator: {
        type: String,
        required: true
    },
    project: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    updated: {
        type: String,
        required: false
    }
}, {timestamps: true});

module.exports = mongoose.model('Ticket', ticketSchema);