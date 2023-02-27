const mongoose = require('mongoose');

const donorHealthSchema = new mongoose.Schema(
    {
        BMI: {
            type: Number
        },
        dateOfBirth: {
            type: Date,
            required: true
        },
        height: {
            type: String,
            required: true
        },
        weight: {
            type: Number,
            required: true
        },

        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true
        },

        hiv: {
            type: String,
            enum: ['Yes', 'No'],
            required: true
        },
        hypertension: {
            type: String,
            enum: ['Yes', 'No'],
            required: true
        },
        smoke: {
            type: String,
            enum: ['Yes', 'No'],
            required: true
        },
        lastBloodDonation: {
            type: Date,
            required: true
        }
    },
    { timestamps: true }
);

const DonorHealth = mongoose.model('DonorHealth', donorHealthSchema);

module.exports = { DonorHealth };
