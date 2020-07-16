const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        reuired: true,
    },
    userName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    followers: [{
        userId: {
            type: String,
        },
        userName: {
            type: String,
        }
    }],
    following: [{
        userId: {
            type: String,
        },
        userName: {
            type: String,
        }
    }],
    followersCount: {
        type: Number,
        required: true,
        integer: true,
    },
    followingCount: {
        type: Number,
        required: true,
        integer: true,
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;