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
            enum: ['user', 'donor', 'admin'],
            default: 'user'
        },
        donorHealth: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'DonorHealth'
        },

        location: {
            type: String,
            required: [true, 'Location is required !']
        },
        lastDonationDate: Date,

        bloodType: {
            type: String,
            enum: ['A+', 'A-', 'AB+', 'AB-', 'O+', 'O-', 'B+', 'B-'],
            required: [true, 'You need to add valid blood group ']
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            }
        }
    },
    { timestamps: true }
);

userSchema.index({ location: '2dsphere' });

const User = mongoose.model('User', userSchema);

module.exports = { User };
