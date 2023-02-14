const express = require('express');
const { checkAuth } = require('../authentication/authorization');
const { checkRole } = require('../middlewares/checkRole');
const adminRouter = express.Router();

adminRouter.get('/makeAdmin', checkAuth, checkRole('user'), (req, res) => {
    console.log(1);
    res.sendStatus(200);
});

module.exports = {
    adminRouter
};
