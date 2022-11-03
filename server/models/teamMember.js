const mongoose = require('mongoose');

const teamMemberSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    team_id: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    
}, {timestamps: true});

module.exports = mongoose.model('TeamMember', teamMemberSchema);