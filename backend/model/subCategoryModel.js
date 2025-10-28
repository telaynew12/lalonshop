const { default: mongoose } = require("mongoose");
const { db } = require("../db.config");

module.exports = db.model('SubCategory', new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
}, {
    timestamps: true,
}))