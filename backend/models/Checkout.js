const mongoose = require("mongoose");

const checkoutItemSchema = new mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        default: "",
    },
    price:{
        type: Number,
        required: true,
    },
    size: String,
    color: String,
    quantity:{
        type: Number,
        required: true,
        default: 1,
        min: 1
    }
}, { _id: false});

const checkoutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    checkoutItems: [checkoutItemSchema],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String },
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    isPaid:{
        type: Boolean,
        default: false,
    },
    paidAt: {
        type: Date,
    },
    paymentStatus: {
        type: String,
        default: "Pending",
    },
    paymentDetails: {
        type: mongoose.Schema.Types.Mixed, // Can store any payment gateway response
    },
    isFinalized: {
        type: Boolean,
        default: false,
    },
    finalizedAt: {
        type: Date,
    },
}, { timestamps: true });

module.exports = mongoose.model("Checkout", checkoutSchema);