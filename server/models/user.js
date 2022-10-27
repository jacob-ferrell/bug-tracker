const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    password: {
        type: String,
        required: true
    },
    
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);