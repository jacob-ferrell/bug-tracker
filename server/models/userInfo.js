const mongoose = require('mongoose');
const Project = require('./project');
const { Schema } = mongoose;


const userInfoSchema = mongoose.Schema({
    user_id: String,
    email: String,
    firstName: String,
    lastName: String,
    projects: [{type: Schema.Types.ObjectId, ref: 'Project'}],
    team: [{type: Schema.Types.ObjectId, ref: 'Team'}]
    
}, {timestamps: true});

module.exports = mongoose.model('UserInfo', userInfoSchema);