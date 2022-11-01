const mongoose = require('mongoose');
const Project = require('./project');
const { Schema } = mongoose;


const userInfoSchema = mongoose.Schema({
    user_id: String,
    firstName: String,
    lastName: String,
    projects: [{type: Schema.Types.ObjectId, ref: 'Project'}]
    
}, {timestamps: true});

module.exports = mongoose.model('UserInfo', userInfoSchema);