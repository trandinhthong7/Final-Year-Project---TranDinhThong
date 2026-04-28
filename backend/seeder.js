const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/User");
const Cart = require("./models/Cart");
const products = require("./test-data/20-products.json");

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

// Import products into database
const importData = async () => {
    try {
        await connectDB();

        // Get admin user (or create one if doesn't exist)
        await User.deleteMany({});
        let adminUser = await User.findOne({ role: "admin" });
        
        if (!adminUser) {
            console.log("No admin user found. Creating default admin...");
            adminUser = await User.create({
                username: "Admin",
                email: "admin@tdtstadium.com",
                password: "admin123456",
                role: "admin"
            });
            console.log("Admin user created:", adminUser.email);
        }

        // Clear existing products
        await Product.deleteMany({});
        console.log("Existing products deleted");

        // Add user ID to each product and calculate price
        const productsWithUser = products.map(product => ({
            ...product,
            user: adminUser._id,
            price: product.originalPrice // Will be recalculated by pre-save hook
        }));

        // Insert products one by one to trigger pre-save hooks
        console.log("Importing products...");
        const createdProducts = [];
        
        for (let i = 0; i < productsWithUser.length; i++) {
            const product = new Product(productsWithUser[i]);
            await product.save(); // This triggers the pre-save hook
            createdProducts.push(product);
            console.log(`✓ Imported: ${product.name} (Stock: ${product.countInStock})`);
        }

        // Delete all carts from database
        await Cart.deleteMany({});
        console.log("All carts deleted successfully!");

        console.log(`\n${createdProducts.length} products imported successfully!`);

        // Display summary
        console.log("\n=== Import Summary ===");
        console.log(`Total Products: ${createdProducts.length}`);
        
        const bootCount = createdProducts.filter(p => p.category === "BOOTS").length;
        const gloveCount = createdProducts.filter(p => p.category === "GLOVES").length;
        const accessoryCount = createdProducts.filter(p => p.category === "ACCESSORIES").length;
        
        console.log(`- BOOTS: ${bootCount}`);
        console.log(`- GLOVES: ${gloveCount}`);
        console.log(`- ACCESSORIES: ${accessoryCount}`);
        
        const totalStock = createdProducts.reduce((sum, p) => sum + p.countInStock, 0);
        console.log(`Total Stock: ${totalStock} units`);
        console.log("=====================\n");

        process.exit(0);
    } catch (error) {
        console.error("Error importing data:", error);
        process.exit(1);
    }
};

// Delete all products from database
const destroyData = async () => {
    try {
        await connectDB();

        await Product.deleteMany({});
        console.log("All products deleted successfully!");

        process.exit(0);
    } catch (error) {
        console.error("Error deleting data:", error);
        process.exit(1);
    }
};

// Command line arguments
if (process.argv[2] === "-d") {
    destroyData();
} else {
    importData();
}