const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: [
            'admin',
            'pm',
            'user'
        ],
        default: 'user',
        required: true,
    }
}, {
    timestamps: true
});

module.exports = model('users', userSchema);