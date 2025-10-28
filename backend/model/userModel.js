const mongoose = require("mongoose");
const { db } = require("../db.config");

module.exports = db.model('User', new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'seller'],
        required: true,
        default: 'user',
    },
    address: {
        fullAddress: {
            type: String,
        },
        district: {
            type: String,
        },
        subDistrict: {
            type: String,
        },
    },
    avatar: {
        type: String,
    },
    dob: {
        type: Date,
    }
}, {
    timestamps: true
}))