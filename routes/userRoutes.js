const express = require('express');
const { checkAuth } = require('../authentication/authorization');
const { signUp, signIn, userProtected } = require('../controllers/userControllers');
const userRouter = express.Router();

// sign up by any user
userRouter.post('/signup', signUp);
userRouter.post('/signin', signIn);
userRouter.get('/protected', checkAuth, userProtected);

module.exports = {
    userRouter
};
