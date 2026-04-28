const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const { protect } = require("../Middleware/authMiddleware");

// @route GET /api/orders/
// @desc Get orders for authenticated user
// @access Private (Authenticated users only)
router.get("/", protect, async (req, res) => {
    try {
        //Find orders for the authenticated user
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// @route GET /api/orders/:id
// @desc Get order details by ID
// @access Private (Authenticated users only)
router.get("/:id", protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "username email");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

module.exports = router;