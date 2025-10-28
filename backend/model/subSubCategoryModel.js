const { default: mongoose } = require("mongoose");
const { db } = require("../db.config");

module.exports = db.model('SubSubCategory', new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
    },
}, {
    timestamps: true,
}))