const { default: mongoose } = require("mongoose");
const { db } = require("../db.config");

module.exports = db.model('Review', new mongoose.Schema({
    rating: {
        type: Number,
        required: true,
    },
    review: {
        type: String,
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    media: [
        new mongoose.Schema({
            name: {
                type: String,
                required: true,
            },
            type: {
                type: String,
                required: true,
            },
        })
    ],
}, {
    timestamps: true,
}))