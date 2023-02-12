const bcrypt = require('bcrypt');
const { User } = require('../model/userModel');
const JWT = require('jsonwebtoken');
require('dotenv').config();

const signUp = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;
        console.log(role);

        const hashPassword = await bcrypt.hash(password, 10);
        console.log(hashPassword);

        const user = new User({ ...req.body, email, password: hashPassword, role });
        console.log(user);
        await user.save();
        // token make start by email and mongo table id
        const tokenPayload = { email, role: user.role, id: user._id };
        const token = JWT.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '10d' });
        // authorization  headers  client response  has token
        res.set('authorization-token', token);

        res.json({
            message: 'user created success',
            user
        }).status(200);
    } catch (err) {
        res.status(401).send(err.message);
    }
};

const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const dbUser = await User.findOne({ email });
        console.log(dbUser);

        if (dbUser) {
            const isValidPassword = await bcrypt.compare(password, dbUser.password);
            if (isValidPassword) {
                // all is ok
                // token generation
                const token = JWT.sign(
                    { email, role: dbUser.role, id: dbUser._id },
                    process.env.JWT_SECRET,
                    { expiresIn: '10h' }
                );
                // token add to res header
                res.set('authorization-token', token);
                res.json({
                    user: dbUser,
                    status: 'ok'
                });
            } else {
                res.send('Auth error').status(401);
            }
        } else {
            res.send('Auth error').status(401);
        }
    } catch (err) {
        res.send('Auth error').status(401);
    }
};

const userProtected = (req, res, next) => {
    if (req.tokenPayload) {
        res.json({
            email: req.tokenPayload,
            status: 'ok'
        });
    } else {
        res.json({
            message: 'Unprotected route for him !'
        });
    }
};

module.exports = {
    signUp,
    signIn,
    userProtected
};
