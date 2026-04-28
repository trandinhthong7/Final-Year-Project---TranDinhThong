const express = require("express");
const User = require("../models/User");
const jwt= require("jsonwebtoken");
const { protect } = require("../Middleware/authMiddleware");

const router = express.Router();

// @route POST /api/users/register
// @desc Register a new user
// @access Public
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    try{
        //Register user
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        user = new User({ username, email, password });
        await user.save();
        
        // Create JWT token
        const payload = { user: { id: user._id, role: user.role } };

        //Sign token
        jwt.sign(payload, process.env.JWT_SECRET, 
            { expiresIn: "60h" }, 
            (err, token) => {
                if (err) throw err;
                
                //Send the user and token in the response
                res.status(201).json({
                    user: {
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    },
                    token,
                });
            });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// @route POST /api/users/login
// @desc Authenticate user and get token
// @access Public
router.post("/login", async (req, res) => {
    try {
        // Check if body exists
        if (!req.body) {
            return res.status(400).json({ message: "Request body is missing" });
        }

        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        //Find user by email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        //Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        //Create JWT token
        const payload = { user: { id: user._id, role: user.role } };

        //Sign token
        jwt.sign(payload, process.env.JWT_SECRET, 
            { expiresIn: "60h" }, 
            (err, token) => {
                if (err) throw err;
                
                //Send the user and token in the response
                res.json({
                    user: {
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    },
                    token,
                });
            });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Server error" });
    }

});

// @route GET /api/users/profile
// @desc Get user profile
// @access Private
router.get("/profile", protect, async (req, res) => {
    res.json(req.user);
});

// @route PUT /api/users/profile
// @desc Update user profile
// @access Private
router.put("/profile", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Update fields if provided
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        
        // Update password if provided
        if (req.body.password) {
            user.password = req.body.password;
        }
        
        const updatedUser = await user.save();
        
        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;