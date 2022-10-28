const mongoose = require('mongoose');

const projectUserSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    project_id: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    
}, {timestamps: true});

module.exports = mongoose.model('projectUser', projectUserSchema);