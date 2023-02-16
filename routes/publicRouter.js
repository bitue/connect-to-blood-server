const express = require('express');
const { getBlogs, getBlogById } = require('../controllers/publicController');

const publicRouter = express.Router();

publicRouter.get('/getBlogs', getBlogs);
publicRouter.get('/getBlogById', getBlogById);

module.exports = {
    publicRouter
};
