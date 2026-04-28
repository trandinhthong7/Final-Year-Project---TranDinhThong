const express = require('express');
const User = require("../models/User");
const { protect, admin } = require("../Middleware/authMiddleware");

const router = express.Router();

// @route GET /api/admin/users
// @desc Get all users (admin only)
// @access Private (Admin only)
router.get("/", protect, admin, async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// @route POST /api/admin/users
// @desc Create a new user (admin only)
// @access Private (Admin only)
router.post("/", protect, admin, async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const user = new User({
            username,
            email,
            password,
            role: role || "user"
        });

        await user.save();
        
        // Return user without password
        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        };
        
        res.status(201).json(userResponse);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// @route PUT /api/admin/users/:id
// @desc Update a user (admin only)
// @access Private (Admin only)
router.put("/:id", protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        
        // Return user without password
        const userResponse = {
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            createdAt: updatedUser.createdAt
        };
        
        res.status(200).json(userResponse);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// @route DELETE /api/admin/users/:id
// @desc Delete a user (admin only)
// @access Private (Admin only)
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

module.exports = router;