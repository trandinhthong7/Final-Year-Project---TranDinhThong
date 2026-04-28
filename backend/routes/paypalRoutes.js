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

    if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
    }

    try {
        const accessToken = await getPayPalAccessToken();

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

        res.json({ orderID: response.data.id });
    } catch (error) {
        console.error("Error creating PayPal order:", error.response?.data || error.message);
        res.status(500).json({ 
            message: "Failed to create PayPal order",
            error: error.response?.data || error.message 
        });
    }
});

// @route POST /api/paypal/capture-order/:orderID
// @desc Capture PayPal order
// @access Private
router.post("/capture-order/:orderID", protect, async (req, res) => {
    const { orderID } = req.params;

    if (!orderID) {
        return res.status(400).json({ message: "Order ID is required" });
    }

    try {
        const accessToken = await getPayPalAccessToken();

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

        res.json(response.data);
    } catch (error) {
        console.error("Error capturing PayPal order:", error.response?.data || error.message);
        res.status(500).json({ 
            message: "Failed to capture PayPal order",
            error: error.response?.data || error.message 
        });
    }
});

module.exports = router;
