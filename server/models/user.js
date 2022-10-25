const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
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
    projects: {
        type: Array,
        required: true
    },
    tickets: {
        type: Array,
        required: true
    }
    
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);