const express = require("express");
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const { protect } = require("../Middleware/authMiddleware");

const router = express.Router();

// @route POST /api/checkout
// @desc Create a new checkout session and order
// @access Private (Authenticated users only)
router.post("/", protect, async (req, res) => {
    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;
    
    if (!checkoutItems || checkoutItems.length === 0) {
        return res.status(400).json({ message: "No items to checkout" });
    }
    
    // Validate checkout items
    for (let i = 0; i < checkoutItems.length; i++) {
        const item = checkoutItems[i];
        if (!item.productId || !item.name || (!item.price && item.price !== 0)) {
            return res.status(400).json({ 
                message: `Invalid item data: ${item.name || 'Unknown product'} is missing required fields`,
                invalidItem: item
            });
        }
    }
    
    try {
        //Create a new checkout
        const newCheckout = new Checkout({
            user: req.user._id,
            checkoutItems: checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: "Pending",
            isPaid: false,
        });
        const createdCheckout = await newCheckout.save();
        res.status(201).json(createdCheckout);
    } catch (error) {
        console.error("Error creating checkout:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: "Validation error", 
                errors: Object.keys(error.errors).map(key => ({
                    field: key,
                    message: error.errors[key].message
                }))
            });
        }
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// @route GET /api/checkout/:id
// @desc Get checkout by ID
// @access Private (Authenticated users only)
router.get("/:id", protect, async (req, res) => {
    try {
        const checkout = await Checkout.findById(req.params.id).populate("user", "username email");
        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found" });
        }
        res.status(200).json(checkout);
    } catch (error) {
        console.error("Error fetching checkout:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// @route PUT /api/checkout/:id/pay
// @desc Update checkout as paid and create order
// @access Private (Authenticated users only)
router.put("/:id/pay", protect, async (req, res) => {
    const {paymentStatus, paymentDetails} = req.body;
    
    try {
        const checkout = await Checkout.findById(req.params.id);
        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found" });
        }
        
        // Case-insensitive check for payment status
        if (paymentStatus && paymentStatus.toLowerCase() === "paid") {
            checkout.isPaid = true;
            checkout.paidAt = Date.now();
            checkout.paymentStatus = "Paid";
            checkout.paymentDetails = paymentDetails;
            await checkout.save();
            res.status(200).json({ checkout, message: "Payment successful" });
        } else {
            return res.status(400).json({ message: "Invalid payment status" });
        }
    } catch (error) {
        console.error("Error processing payment:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }   
});

// @route POST /api/checkout/:id/finalize
// @desc Finalize the order after successful payment
// @access Private (Authenticated users only)
router.post("/:id/finalize", protect, async (req, res) => {
    try{
        const checkout = await Checkout.findById(req.params.id);
        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found" });
        }
        
        if (checkout.isFinalized) {
            return res.status(400).json({ message: "Order already finalized" });
        }
        
        if (!checkout.isPaid) {
            return res.status(400).json({ message: "Payment not completed" });
        }
        
        //Create a new order based on the checkout details
        const finalOrder = await Order.create({
            user: checkout.user,
            orderItem: checkout.checkoutItems,
            shippingAddress: checkout.shippingAddress,
            paymentMethod: checkout.paymentMethod,
            totalPrice: checkout.totalPrice,
            isPaid: true,
            paidAt: checkout.paidAt,
            isDelivered: false,
            paymentStatus: "Paid",
        });
        
        // Mark the checkout as finalized
        checkout.isFinalized = true;
        checkout.finalizedAt = Date.now();
        await checkout.save();
        
        //Delete the cart associated with the user
        await Cart.findOneAndDelete({ user: checkout.user });
        
        res.status(201).json(finalOrder);
    } catch (error) {
        console.error("Error finalizing order:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

module.exports = router;

