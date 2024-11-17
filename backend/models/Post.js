const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true 
    },
    text: { 
        type: String, 
        required: true 
    },
    media: { 
        type: String, 
        required: false 
    }, // URL to uploaded media (image/video)
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    likes: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    comments: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            comment: { type: String },
            createdAt: { type: Date, default: Date.now },
        },
    ],
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
