const mongoose = require('mongoose');
require('dotenv').config(); // for access the dot env vars
const mongoURL = process.env.DB_CONNECTION_STRING;

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURL, () => {
            console.log('DB connected successfully ');
        });
    } catch (err) {
        console.log(err);
    }
};

module.exports = connectDB;
