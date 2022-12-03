const mongoose = require('mongoose');
const { Schema } = mongoose;


const notificationSchema = mongoose.Schema({
    message: String,
    project_id: {type: Schema.Types.ObjectId, ref: 'Project'},
    creator: {type: Schema.Types.ObjectId, ref: 'User'},
    ticket_id: {type: Schema.Types.ObjectId, ref: 'Ticket'},
    
}, {timestamps: true});

module.exports = mongoose.model('Notification', notificationSchema);