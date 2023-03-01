const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            min: [100, 'title must be 100 characters!'],
            required: [true, 'title is required ']
        },
        img: {
            type: String
        },
        content: {
            type: String,
            min: [500, 'title must be 500 characters!'],
            required: true
        },

        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true
        },

        comments: [
            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'Comment'
            }
        ],
        likes: [
            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'User'
            }
        ]
    },
    { timestamps: true }
);

const Blog = mongoose.model('Blog', blogSchema);

module.exports = { Blog };
