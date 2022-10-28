const mongoose = require('mongoose');
const Project = require('./project');

const userInfoSchema = mongoose.Schema({
    user_id: String,
    firstName: String,
    lastName: String,
    projects: [Object]
    
}, {timestamps: true});

module.exports = mongoose.model('UserInfo', userInfoSchema);