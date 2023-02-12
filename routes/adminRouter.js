// const express = require('express');
// const { checkAuth } = require('../authentication/authorization');
// const { makeAdmin } = require('../controllers/adminControllers');
// const { checkRole } = require('../middlewares/checkRole');

// const adminRouter = express.Router();

// // adminRouter.put('/admin/makeAdmin', checkAuth, checkRole, makeAdmin);
// adminRouter.get('/makeAdmin', (req, res) => {
//     res.send('ok');
// });

// module.exports = adminRouter;

const express = require('express');
const adminRouter = express.Router();

adminRouter.get('/makeAdmin', (req, res) => {
    console.log(1);
    res.sendStatus(200);
});

module.exports = {
    adminRouter
};
