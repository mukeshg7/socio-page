const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    body: {
        type: String,
        reuired: true,
    },
    likes: {
        type: Number,
        required: true,
        integer: true,
    },
    userName: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    likedUserIds: [{
        userId: {
            type: String
        }
    }]
    
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;