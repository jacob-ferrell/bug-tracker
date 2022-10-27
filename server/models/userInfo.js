const mongoose = require('mongoose');

const userInfoSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    email: {
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

module.exports = mongoose.model('UserInfo', userInfoSchema);