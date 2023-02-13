const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../model/userModel');
require('dotenv').config();

const checkAuth = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        res.status(401).send('Unauthorized 1 !');
    } else {
        try {
            console.log(authorization);
            const token = authorization.split(' ')[1];

            const decode = JWT.verify(token, process.env.JWT_SECRET);
            // check to database again !
            console.log(decode);

            const userDb = await User.findOne({
                $and: [{ email: decode.email }, { role: decode.role }, { _id: decode.id }]
            });
            console.log(userDb, 'userDB');

            if (!userDb) {
                res.status(401).send('Unauthorized 2 !');
            }

            // all ok !
            req.tokenPayload = userDb;
            //req.role = userDB.role
            next();
        } catch (err) {
            res.status(401).send(err.message);
        }
    }
};

module.exports = {
    checkAuth
};
