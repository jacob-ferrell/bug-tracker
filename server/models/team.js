const mongoose = require('mongoose');
const { Schema } = mongoose;


const teamSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    members: [{type: Schema.Types.ObjectId, ref: 'User'}],
    creator: {
        type: String,
        required: true
    },
}, {timestamps: true});

module.exports = mongoose.model('Team', teamSchema);