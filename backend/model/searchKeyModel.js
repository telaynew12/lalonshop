const { default: mongoose } = require("mongoose");
const { db } = require("../db.config");

module.exports = db.model('SearchKey', new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    count: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
}))