const express = require("express");
const axios = require("axios");
const { protect } = require("../Middleware/authMiddleware");

const router = express.Router();

// PayPal API base URL
const PAYPAL_API = process.env.PAYPAL_MODE === "live" 
    ? "https://api-m.paypal.com" 
    : "https://api-m.sandbox.paypal.com";

// Get PayPal access token
const getPayPalAccessToken = async () => {
    const auth = Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    try {
        const response = await axios.post(
            `${PAYPAL_API}/v1/oauth2/token`,
            "grant_type=client_credentials",
            {
                headers: {
                    Authorization: `Basic ${auth}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error("Error getting PayPal access token:", error.response?.data || error.message);
        throw new Error("Failed to authenticate with PayPal");
    }
};

// @route POST /api/paypal/create-order
// @desc Create PayPal order
// @access Private
router.post("/create-order", protect, async (req, res) => {
    const { amount } = req.body;

    console.log("📝 Creating PayPal order:", { 
        amount, 
        userId: req.user?._id,
        hasClientId: !!process.env.PAYPAL_CLIENT_ID,
        hasClientSecret: !!process.env.PAYPAL_CLIENT_SECRET,
        mode: process.env.PAYPAL_MODE
    });

    if (!amount || amount <= 0) {
        console.error("❌ Invalid amount:", amount);
        return res.status(400).json({ message: "Invalid amount" });
    }

    // Check if PayPal credentials exist
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
        console.error("❌ PayPal credentials not configured");
        return res.status(500).json({ 
            message: "PayPal is not configured on the server. Please contact support." 
        });
    }

    try {
        const accessToken = await getPayPalAccessToken();
        console.log("✅ Got PayPal access token");

        const response = await axios.post(
            `${PAYPAL_API}/v2/checkout/orders`,
            {
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: "USD",
                            value: amount.toFixed(2),
                        },
                    },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("✅ PayPal order created:", response.data.id);
        res.json({ orderID: response.data.id });
    } catch (error) {
        console.error("❌ Error creating PayPal order:", error.response?.data || error.message);
        res.status(500).json({ 
            message: "Failed to create PayPal order",
            error: error.response?.data?.message || error.message 
        });
    }
});

// @route POST /api/paypal/capture-order/:orderID
// @desc Capture PayPal order
// @access Private
router.post("/capture-order/:orderID", protect, async (req, res) => {
    const { orderID } = req.params;

    console.log("📝 Capturing PayPal order:", { orderID, userId: req.user?._id });

    if (!orderID) {
        console.error("❌ Order ID is missing");
        return res.status(400).json({ message: "Order ID is required" });
    }

    try {
        const accessToken = await getPayPalAccessToken();
        console.log("✅ Got PayPal access token for capture");

        const response = await axios.post(
            `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("✅ PayPal order captured:", orderID);
        res.json(response.data);
    } catch (error) {
        console.error("❌ Error capturing PayPal order:", error.response?.data || error.message);
        res.status(500).json({ 
            message: "Failed to capture PayPal order",
            error: error.response?.data?.message || error.message 
        });
    }
});

module.exports = router;
