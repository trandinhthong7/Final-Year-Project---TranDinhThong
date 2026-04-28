const express = require('express');
const Product = require("../models/Product");
const { protect, admin } = require("../Middleware/authMiddleware");

const router = express.Router();

// @route GET /api/admin/products
// @desc Get all products (admin only)
// @access Private (Admin only)
router.get("/", protect, admin, async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// @route GET /api/admin/products/:id
// @desc Get a single product by ID (admin only)
// @access Private (Admin only)
router.get("/:id", protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// @route POST /api/admin/products
// @desc Create a new product (admin only)
// @access Private (Admin only)
router.post("/", protect, admin, async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({ message: "Product created successfully", product });
    } catch (error) {
        console.error("Error creating product:", error);
        if (error.code === 11000) {
            return res.status(400).json({ message: "SKU already exists" });
        }
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// @route PUT /api/admin/products/:id
// @desc Update a product (admin only)
// @access Private (Admin only)
router.put("/:id", protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Update all fields from request body
        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined) {
                product[key] = req.body[key];
            }
        });

        const updatedProduct = await product.save();
        res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        console.error("Error updating product:", error);
        if (error.code === 11000) {
            return res.status(400).json({ message: "SKU already exists" });
        }
        res.status(500).json({ message: "Internal server error", error: error.message });   
    }
});

// @route DELETE /api/admin/products/:id
// @desc Delete a product (admin only)
// @access Private (Admin only)
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

module.exports = router;