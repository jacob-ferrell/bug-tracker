const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    
}, {timestamps: true});

module.exports = mongoose.model('UserInfo', userSchema);