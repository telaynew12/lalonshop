const { default: mongoose } = require("mongoose");
const { db } = require("../db.config");

module.exports = db.model('Category', new mongoose.Schema({
   name: {
       type: String,
       required: true,
   },
   avatar: {
       type: String,
   },
}, {
    timestamps: true,
}))