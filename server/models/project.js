const mongoose = require('mongoose');
const ProjectUser = require('./projectUser');

const projectSchema = mongoose.Schema({
    name: String,
    description: String,
    creator: String,
    tickets: [Object]

}, {timestamps: true});

module.exports = mongoose.model('Project', projectSchema);