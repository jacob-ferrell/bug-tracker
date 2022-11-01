const mongoose = require('mongoose');
const ProjectUser = require('./projectUser');
const { Schema } = mongoose;

const projectSchema = mongoose.Schema({
    name: String,
    description: String,
    creator: String,
    tickets: [{type: Schema.Types.ObjectId, ref: 'Ticket'}],
    users: [Object],

}, {timestamps: true});

module.exports = mongoose.model('Project', projectSchema);