const mongoose = require('mongoose');
const { Schema } = mongoose;

const teamMemberSchema = mongoose.Schema({
    user_id: {type: Schema.Types.ObjectId, ref: 'User'},
    team_id: {type: Schema.Types.ObjectId, ref: 'Team'},
    role: {
        type: String,
        required: true
    },
    
}, {timestamps: true});

module.exports = mongoose.model('TeamMember', teamMemberSchema);