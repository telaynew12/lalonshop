const { default: mongoose } = require("mongoose");
const { db } = require("../db.config");

module.exports = db.model('Courier', new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    api_key: {
        type: String,
    },
    secret_key: {
        type: String,
    },
    is_active: {
        type: Boolean,
        default: false,
    },
}));