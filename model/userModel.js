const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            trim: true,
            min: [6, 'valid email address needed !'],
            required: [true, 'Email address is required '],
            unique: true
        },
        password: {
            type: String,
            min: [6, 'password should be minimum 6 length'],
            required: true
        },
        phone: {
            type: String,
            required: true,
            unique: [true, 'Phone number is already used !']
        },
        role: {
            type: String,
            enum: ['Admin', 'User', 'Donar'],
            required: [true, 'role is required']
        },
        location: {
            type: String,
            required: true,
            unique: [true, 'Location is required !']
        },
        NID: {
            type: String,
            required: true,
            min: [10, 'Invalid Nid']
        }
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
