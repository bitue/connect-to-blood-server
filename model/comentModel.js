const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        comment: {
            type: String,
            min: [300, 'comments must be 300 characters!'],
            required: true
        },
        blog: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Blog',
            required: true
        },
        email: {
            type: String
        }
    },
    { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment };
