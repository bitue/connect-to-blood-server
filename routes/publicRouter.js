const express = require('express');
const { checkAuth } = require('../authentication/authorization');
// const { checkAuth } = require('../authentication/authorization');
const { getBlogs, getBlogByBlogId } = require('../controllers/publicController');

const publicRouter = express.Router();

publicRouter.get('/getBlogs', getBlogs);
publicRouter.get('/getBlogByBlogId', getBlogByBlogId);
publicRouter.get('/getUserByToken', checkAuth, (req, res) => {
    console.log(req.tokenPayload, ' token payload');
    res.json(req.tokenPayload);
});

module.exports = {
    publicRouter
};
