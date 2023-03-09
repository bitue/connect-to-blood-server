// external module imports
const express = require('express');
const app = express();
const cors = require('cors');
const { userRouter } = require('./routes/userRoutes');
const { adminRouter } = require('./routes/adminRouter');
const { publicRouter } = require('./routes/publicRouter');

// all about file upload

const multer = require('multer');
const uploadFilePath = './uploads/';
var upload = multer({
    dest : uploadFilePath 
})

// const adminRouter = require('./routes/adminRouter');

require('dotenv').config();

// internal module imports

// application level middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// case sensitive routing
app.enable('case sensitive routing');

// public routes
// home route
app.get('/', (req, res) => {
    res.send('home route');
});

// public route
app.use('/public', publicRouter);

// user routes
app.use('/', userRouter);

// admin routes

app.use('/admin', adminRouter);

// not found any route error : 404
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    console.log('no route found');
    res.send(error);
});

// final error handling  middl eware error : 500

app.use((err, req, res, next) => {
    console.log('last middleware');
    res.status(err.status || 500).send(err.message);
});

module.exports = app;
