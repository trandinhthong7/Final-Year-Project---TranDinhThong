const express = require('express');
const Order = require("../models/Order");
const { protect, admin } = require("../Middleware/authMiddleware");

const router = express.Router();

// @route GET /api/admin/orders
// @desc Get all orders (admin only)
// @access Private (Admin only)
router.get("/", protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate("user", "username email")
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});


// @route PUT /api/admin/orders/:id/deliver
// @desc Mark order as delivered (admin only)   
// @access Private (Admin only)
router.put("/:id", protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        
        order.status = req.body.status || order.status;
        order.isDelivered = req.body.status === "Delivered" ? true : order.isDelivered;
        order.deliveredAt = req.body.status === "Delivered" ? Date.now() : order.deliveredAt;
        
        const updatedOrder = await order.save();
        
        // Populate user field before sending response
        await updatedOrder.populate("user", "username email");
        
        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// @route DELETE /api/admin/orders/:id
// @desc Delete an order (admin only)
// @access Private (Admin only)
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        await Order.deleteOne({});
        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

module.exports = router;