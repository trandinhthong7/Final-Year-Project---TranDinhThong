const express = require("express");
const User = require("../models/User");
const { protect } = require("../Middleware/authMiddleware");

const router = express.Router();

// @route GET /api/addresses
// @desc Get all addresses for authenticated user
// @access Private
router.get("/", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("addresses");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user.addresses);
    } catch (error) {
        console.error("Error fetching addresses:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route POST /api/addresses
// @desc Create a new address
// @access Private
router.post("/", protect, async (req, res) => {
    try {
        const { label, firstName, lastName, address, city, postalCode, country, phone, isDefault } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // If this is set as default, unset all other defaults
        if (isDefault) {
            user.addresses.forEach(addr => {
                addr.isDefault = false;
            });
        }

        // If this is the first address, make it default
        const makeDefault = user.addresses.length === 0 || isDefault;

        user.addresses.push({
            label,
            firstName,
            lastName,
            address,
            city,
            postalCode,
            country,
            phone,
            isDefault: makeDefault
        });

        await user.save();

        res.status(201).json(user.addresses[user.addresses.length - 1]);
    } catch (error) {
        console.error("Error creating address:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route PUT /api/addresses/:id
// @desc Update an address
// @access Private
router.put("/:id", protect, async (req, res) => {
    try {
        const { label, firstName, lastName, address, city, postalCode, country, phone, isDefault } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === req.params.id);
        if (addressIndex === -1) {
            return res.status(404).json({ message: "Address not found" });
        }

        // If setting as default, unset all other defaults
        if (isDefault) {
            user.addresses.forEach(addr => {
                addr.isDefault = false;
            });
        }

        // Update address fields
        user.addresses[addressIndex].label = label;
        user.addresses[addressIndex].firstName = firstName;
        user.addresses[addressIndex].lastName = lastName;
        user.addresses[addressIndex].address = address;
        user.addresses[addressIndex].city = city;
        user.addresses[addressIndex].postalCode = postalCode;
        user.addresses[addressIndex].country = country;
        user.addresses[addressIndex].phone = phone;
        user.addresses[addressIndex].isDefault = isDefault;

        await user.save();

        res.json(user.addresses[addressIndex]);
    } catch (error) {
        console.error("Error updating address:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route DELETE /api/addresses/:id
// @desc Delete an address
// @access Private
router.delete("/:id", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === req.params.id);
        if (addressIndex === -1) {
            return res.status(404).json({ message: "Address not found" });
        }

        const wasDefault = user.addresses[addressIndex].isDefault;
        user.addresses.splice(addressIndex, 1);

        // If deleted address was default and there are other addresses, make the first one default
        if (wasDefault && user.addresses.length > 0) {
            user.addresses[0].isDefault = true;
        }

        await user.save();

        res.json({ message: "Address deleted successfully" });
    } catch (error) {
        console.error("Error deleting address:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route PUT /api/addresses/:id/set-default
// @desc Set an address as default
// @access Private
router.put("/:id/set-default", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === req.params.id);
        if (addressIndex === -1) {
            return res.status(404).json({ message: "Address not found" });
        }

        // Unset all defaults
        user.addresses.forEach(addr => {
            addr.isDefault = false;
        });

        // Set this one as default
        user.addresses[addressIndex].isDefault = true;

        await user.save();

        res.json(user.addresses[addressIndex]);
    } catch (error) {
        console.error("Error setting default address:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
