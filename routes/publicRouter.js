const express = require('express');
const { Blog } = require('../model/blogModel');

const publicRouter = express.Router();

publicRouter.get('/getBlogs', async (req, res) => {
    try {
        const blogs = await Blog.find().populate(['user', 'comments']).limit(10);
        // console.log(blogs);
        res.json({
            data: blogs,
            status: 'ok'
        });
    } catch (err) {
        res.status(403).send(err.message);
    }
});

module.exports = {
    publicRouter
};
