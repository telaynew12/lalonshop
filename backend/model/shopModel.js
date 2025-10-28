const { default: mongoose } = require("mongoose");
const { db } = require("../db.config");

module.exports = db.model('Shop', new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    location: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    since: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'inactive', 'suspended'],
    },
    documents: [
        {
            type: String,
        }
    ],
}, {
    timestamps: true,
}))