const express = require('express');
const router = express.Router();
const { protect } = require("../Middleware/authMiddleware");

const Subscriber = require("../models/Subscriber");

// @route POST /api/subscribers
// @desc Create a new subscriber
// @access Public
router.post("/", async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    
    try {
        // Check if subscriber already exists
        let subscriber = await Subscriber.findOne({ email });
        if (subscriber) {
            return res.status(400).json({ message: "Subscriber already exists" });
        }
        
        // Create new subscriber
        subscriber = new Subscriber({ email });
        await subscriber.save();
        
        res.status(201).json({ message: "Subscriber created successfully", subscriber });
    } catch (error) {
        console.error("Error creating subscriber:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

module.exports = router;