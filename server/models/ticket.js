const mongoose = require('mongoose');
const { Schema } = mongoose;

const ticketSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    creator: {type: Schema.Types.ObjectId, ref: 'User'},
    project_id: {type: Schema.Types.ObjectId, ref: 'Project'},
    priority: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },

}, {timestamps: true});

module.exports = mongoose.model('Ticket', ticketSchema);