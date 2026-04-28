const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../Middleware/authMiddleware");

const router = express.Router();

//Helper function to calculate total price of cart
const calculateTotalPrice = (products) => {
    return products.reduce((total, item) => total + item.price * item.quantity, 0);
};

//Helper function to find cart by user or guest ID
const findCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({ user: userId });
    } else if (guestId) {
        return await Cart.findOne({ guestId });
    }
    return null;
};


// @route POST /api/cart
// @desc Add product to cart for guest or authenticated user
// @access Public
router.post("/", async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;
    
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let cart = await findCart(userId, guestId);

        if (!cart) {
            // Create a new cart - use provided guestId or generate one
            const finalGuestId = guestId || "guest_" + new Date().getTime();
            
            cart = new Cart({
                user: userId || undefined,
                guestId: finalGuestId,
                products: [
                    {
                        productId,
                        name: product.name,
                        image: product.images && product.images.length > 0 ? product.images[0] : "",
                        price: product.price,
                        size,
                        color,
                        quantity,
                    },
                ],
                totalPrice: product.price * quantity,
            });
        } else {
            // If cart exists, check if product already exists in cart with same size and color
            const productIndex = cart.products.findIndex(
                (p) =>
                    p.productId.toString() === productId &&
                    p.size === size &&
                    p.color === color
            );

            if (productIndex > -1) {
                // Update quantity
                cart.products[productIndex].quantity += quantity;
            } else {
                // Add new product variant to cart
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images && product.images.length > 0 ? product.images[0] : "",
                    price: product.price,
                    size,
                    color,
                    quantity,
                });
            }

            // Recalculate total price
            cart.totalPrice = calculateTotalPrice(cart.products);
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route GET /api/cart
// @desc Get user's or guest's cart
// @access Public
router.get("/", async (req, res) => {
    const { userId, guestId } = req.query;

    try {
        const cart = await findCart(userId, guestId);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        
        // Ensure all products have required fields by re-fetching from Product collection
        const updatedProducts = [];
        let needsUpdate = false;
        
        for (const item of cart.products) {
            // Check if item is missing required fields (image is optional)
            if (!item.name || (!item.price && item.price !== 0)) {
                needsUpdate = true;
                const product = await Product.findById(item.productId);
                if (product) {
                    updatedProducts.push({
                        productId: item.productId,
                        name: product.name,
                        image: product.images && product.images.length > 0 ? product.images[0] : "",
                        price: product.price,
                        size: item.size,
                        color: item.color,
                        quantity: item.quantity
                    });
                } else {
                    // Product no longer exists, skip it
                    needsUpdate = true;
                }
            } else {
                updatedProducts.push(item);
            }
        }
        
        // Update cart if needed
        if (needsUpdate) {
            cart.products = updatedProducts;
            cart.totalPrice = calculateTotalPrice(updatedProducts);
            await cart.save();
        }
        
        res.json(cart);
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route PUT /api/cart
// @desc Update product quantity in cart
// @access Public
router.put("/", async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;

    try {
        let cart = await findCart(userId, guestId);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const productIndex = cart.products.findIndex(
            (item) =>
                item.productId.toString() === productId &&
                item.size === size &&
                item.color === color
        );

        if (productIndex > -1) {
            if (quantity <= 0) {
                cart.products.splice(productIndex, 1);
            } else {
                cart.products[productIndex].quantity = quantity;
            }
            cart.totalPrice = calculateTotalPrice(cart.products);
            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: "Product not found in cart" });
        }
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route DELETE /api/cart
// @desc Remove product from cart
// @access Public
router.delete("/", async (req, res) => {
    const { productId, size, color, guestId, userId } = req.body;

    try {
        let cart = await findCart(userId, guestId);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.products = cart.products.filter(
            (item) =>
                !(item.productId.toString() === productId && item.size === size && item.color === color)
        );

        cart.totalPrice = calculateTotalPrice(cart.products);
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route POST /api/cart/merge
// @desc Merge guest cart into user cart upon login
// @access Private
router.post("/merge", protect, async (req, res) => {
    const { guestId } = req.body;

    try {
        const guestCart = await Cart.findOne({ guestId });
        
        if (!guestCart || guestCart.products.length === 0) {
            return res.status(404).json({ message: "Guest cart not found or empty" });
        }

        let userCart = await Cart.findOne({ user: req.user._id });

        if (!userCart) {
            // If user has no cart, simply assign guest cart to user
            guestCart.user = req.user._id;
            guestCart.guestId = undefined;
            await guestCart.save();
            return res.status(200).json(guestCart);
        }
        
        // Merge carts - combine products and sum quantities
        guestCart.products.forEach((guestItem) => {
            const productIndex = userCart.products.findIndex(
                (userItem) =>
                    userItem.productId.toString() === guestItem.productId.toString() &&
                    userItem.size === guestItem.size &&
                    userItem.color === guestItem.color
            );

            if (productIndex > -1) {
                // If product variant exists in user cart, sum quantities
                userCart.products[productIndex].quantity += guestItem.quantity;
            } else {
                // Otherwise, add new product variant to user cart
                userCart.products.push(guestItem);
            }
        });

        // Recalculate total price and save merged cart
        userCart.totalPrice = calculateTotalPrice(userCart.products);
        await userCart.save();

        // Delete guest cart after merging
        await Cart.findOneAndDelete({ guestId });
        
        // Send response with merged cart
        return res.status(200).json(userCart);
    } catch (error) {
        console.error("Error merging carts:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;