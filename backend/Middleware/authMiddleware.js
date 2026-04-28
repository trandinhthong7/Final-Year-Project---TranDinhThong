const jwt= require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes
const protect = async (req, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1];
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Get user from the token
            req.user = await User.findById(decoded.user.id).select("-password");
            next();
            
        } catch (error) {
            console.error("Token verification failed:", error);
            
            // Check if token expired
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ 
                    message: "Token expired", 
                    expired: true 
                });
            }
            
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }
        else{
            res.status(401).json({ message: "Not authorized, no token provided" });
        }
    };

// Middleware to check if user is admin
const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Admin only." });
    }
};

module.exports = { protect, admin };