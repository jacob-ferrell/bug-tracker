const mongoose = require('mongoose');
const { Schema } = mongoose;

const ticketUserSchema = mongoose.Schema({
    user_id: {type: Schema.Types.ObjectId, ref: 'User'},
    ticket_id: {type: Schema.Types.ObjectId, ref: 'Project'},
    
}, {timestamps: true});

module.exports = mongoose.model('TicketUser', ticketUserSchema);