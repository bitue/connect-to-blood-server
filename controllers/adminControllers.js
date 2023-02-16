const { Blog } = require('../model/blogModel');
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

const getBlogsByUserId = async (req, res, next) => {
    try {
        const userDB = await Blog.find({ user: req.query.id });
        res.json({
            data: userDB,
            status: 'ok'
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    makeAdmin,
    getAllUsers,
    getUserById,
    banUserById,
    getBlogsByUserId
};
