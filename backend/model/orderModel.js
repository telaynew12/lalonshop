const { default: mongoose } = require("mongoose");
const { db } = require("../db.config");

module.exports = db.model('Order', new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    orderProduct: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            color: {
                type: String,
            },
            size: {
                type: String,
            },
            height: {
                type: String,
            },
            width: {
                type: String,
            },
            material: {
                type: String,
            },
            variant: {
                type: String,
            },
        }
    ],
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    address: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    subDistrict: {
        type: String,  // Upazila
        required: true,
    },
    deliveryCharge: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'accepted', 'shipped', 'delivered', 'canceled', 'returned'],
        default: 'pending',
    },
    quantity: {
        type: Number,
        required: true,
    },
    consignment_id: {
        type: String,
    },
    tracking_id: {
        type: String,
    },
}, {
    timestamps: true,
}))