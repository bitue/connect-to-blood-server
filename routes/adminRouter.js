const express = require('express');
const { checkAuth } = require('../authentication/authorization');
const {
    getAllUsers,
    getUserById,
    banUserById,

    makeAdmin,
    allDonorReq,
    approveDonorReq,
    getAllDonor
} = require('../controllers/adminControllers');
const { checkRole } = require('../middlewares/checkRole');
const adminRouter = express.Router();

// admin can make another admin
// adminRouter.get('/makeAdmin', checkAuth, checkRole('admin'), (req, res) => {
//     console.log(1);
//     res.sendStatus(200);
// });
// admin can get all users
adminRouter.get('/getAllUsers', checkAuth, checkRole('admin'), getAllUsers);
// admin can see a user by id
adminRouter.get('/getUserById', checkAuth, checkRole('admin'), getUserById);
//admin can ban a user or donor by id
adminRouter.delete('/banUserById', checkAuth, checkRole('admin'), banUserById);
// admin can get  blogs by userid
// adminRouter.get('/getBlogsByUserId', checkAuth, checkRole('admin'), getBlogsByUserId);
// admin can make another user or donor to admin
adminRouter.put('/makeAdmin', checkAuth, checkRole('admin'), makeAdmin);
// admin can see all donor req data
adminRouter.get('/allDonorReq', checkAuth, checkRole('admin'), allDonorReq);
// admin can approve donor req and make user to donor role and add donorStatus
adminRouter.put('/approveDonorReq', checkAuth, checkRole('admin'), approveDonorReq);
// admin can see all donor and health status
adminRouter.get('/allDonorList', checkAuth, checkRole('admin'), getAllDonor);
module.exports = {
    adminRouter
};
