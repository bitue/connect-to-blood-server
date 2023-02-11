const mongoose = require('mongoose');
require('dotenv').config(); // for access the dot env vars

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING, () => {
            console.log('DB connected successfully ');
        });
    } catch (err) {
        console.log(err);
    }
};

module.exports = connectDB;
