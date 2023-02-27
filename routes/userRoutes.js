const express = require('express');
const { checkAuth } = require('../authentication/authorization');

const {
    signUp,
    signIn,
    userProtected,
    createBlog,
    createComment,
    giveVote,
    deleteBlog,

    DonorHealthStatus,
    getBlogsByUserId
} = require('../controllers/userControllers');
const { checkRole } = require('../middlewares/checkRole');
const userRouter = express.Router();

// sign up by any user
userRouter.post('/signup', signUp);
userRouter.post('/signin', signIn);
userRouter.get('/protected', checkAuth, userProtected);
// create blogs by user
userRouter.post('/createBlog', checkAuth, checkRole('user'), createBlog);
// do comment by user for a blog
userRouter.post('/comment', checkAuth, checkRole('user'), createComment);
// do vote and unvote  by user
userRouter.get('/vote', checkAuth, checkRole('user'), giveVote);
// user can delete post by id
userRouter.delete('/deleteBlog', checkAuth, checkRole('user'), deleteBlog);
// user can get details by  the blogID
// already have public route
// user can get all his id by userId
userRouter.get('/getBlogsByUserId', checkAuth, checkRole('user'), getBlogsByUserId);
// user can give request to admin becoming a donor
userRouter.post('/donorRequest', checkAuth, checkRole('user'), DonorHealthStatus);

module.exports = {
    userRouter
};
