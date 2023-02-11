// external module imports
const express = require('express');
const app = express();
const admin = express();
const cors = require('cors');
const { UserM } = require('./model/userModel');

// internal module imports

// application level middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// case sensitive routing
app.enable('case sensitive routing');

// home route
app.get('/', (req, res) => {
    res.send('home page');
});

app.post('/user', async (req, res, next) => {
    const u = req.body;
    // console.log(u);

    try {
        const user = new UserM(u);
        await user.save();
        res.send('user created success');
    } catch (err) {
        next(err);
    }
});

// not found any route error : 404
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    res.send(error);
});

// final error handling  middleware error : 500

app.use((err, req, res, next) => {
    res.status(err.status || 500).send(err.message);
});

module.exports = app;
