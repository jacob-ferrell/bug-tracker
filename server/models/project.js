const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectSchema = mongoose.Schema({
    name: String,
    description: String,
    creator: {type: Schema.Types.ObjectId, ref: 'User'},
    tickets: [{type: Schema.Types.ObjectId, ref: 'Ticket'}],
    users: [{type: Schema.Types.ObjectId, ref: 'ProjectUser'}],

}, {timestamps: true});

module.exports = mongoose.model('Project', projectSchema);