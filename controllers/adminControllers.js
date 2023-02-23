const { Blog } = require('../model/blogModel');
const { DonorHealth } = require('../model/donorHealthModel');

const { User } = require('../model/userModel');

const makeAdmin = async (req, res, next) => {
    try {
        const resToDb = await User.updateOne({ _id: req.query.id }, { $set: { role: 'admin' } });
        res.json(resToDb);
    } catch (err) {
        next(err);
    }
};
const getAllUsers = async (req, res, next) => {
    try {
        const allUsers = await User.find({ role: 'user' }, {}, { sort: { createdAt: -1 } });
        res.json({
            data: allUsers,
            status: 'ok'
        });
    } catch (err) {
        next(err);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const userDB = await User.findById(req.query.id);
        res.json({
            data: userDB,
            status: 'ok'
        });
    } catch (err) {
        next(err);
    }
};

const banUserById = async (req, res, next) => {
    try {
        const userDeleteRes = await User.deleteOne({ _id: req.query.id });
        res.json(userDeleteRes);
    } catch (err) {
        next(err);
    }
};

// const getBlogsByUserId = async (req, res, next) => {
//     try {
//         const userDB = await Blog.find({ user: req.query.id });
//         res.json({
//             data: userDB,
//             status: 'ok'
//         });
//     } catch (err) {
//         next(err);
//     }
// };

const allDonorReq = async (req, res, next) => {
    try {
        const getAllDonorReq = await DonorHealth.find({}).populate('user');
        res.json(getAllDonorReq);
    } catch (err) {
        next(err);
    }
};

const approveDonorReq = async (req, res, next) => {
    try {
        const { id } = req.query;
        const donorReq = await DonorHealth.findById(id);
        console.log(donorReq);
        if (!donorReq) {
            res.sendStatus(403);
            return;
        } else {
            const userId = donorReq.user;
            console.log(userId, 'donorReq');
            const resDB = await User.findOneAndUpdate(
                { _id: userId },
                { role: 'donor', donorHealth: id }
            );
            // get the updated user so
            const updatedRes = await User.findById(userId);
            //
            res.json(updatedRes);
        }
    } catch (err) {
        next(err);
    }
};

const getAllDonor = async (req, res, next) => {
    try {
        const getAllDonor = await User.find({ role: 'donor' }).populate('donorHealth');
        res.json(getAllDonor);
    } catch (err) {
        next(err);
    }
};

const removeDonorReq = async (req, res, next) => {
    try {
        console.log(10);
        const { id } = req.query;
        const dltReq = await DonorHealth.deleteOne({ _id: id });
        console.log(dltReq);
        res.json(dltReq);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    makeAdmin,
    getAllUsers,
    getUserById,
    banUserById,
    allDonorReq,
    approveDonorReq,
    getAllDonor,
    removeDonorReq
};
