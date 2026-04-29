// backend/generateEmbeddings.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Product = require("./models/Product");
const connectDB = require("./config/db");

// Load env variables
dotenv.config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateAndSaveEmbeddings = async () => {
    try {
        await connectDB();
        console.log("Connected to MongoDB");

        // Use the specific embedding model
        const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
        // Find products that don't have embeddings yet
        const products = await Product.find({ 
            $or: [{ embedding: { $exists: false } }, { embedding: { $size: 0 } }] 
        });

        console.log(`Found ${products.length} products to update.`);

        for (const product of products) {
            // Combine relevant info into one string for the AI to understand
            const textToEmbed = `
                Product Name: ${product.name}
                Category: ${product.category}
                Brand: ${product.brand}
                Description: ${product.description}
                Outsole: ${product.outsole || 'N/A'}
                Player: ${product.player || 'None'}
            `;

            // Generate the embedding
            const result = await model.embedContent(textToEmbed);
            const embedding = result.embedding.values;

            // Save the embedding to the product
            product.embedding = embedding;
            await product.save();

            console.log(`Updated embedding for: ${product.name}`);
            
            // Add a small delay to avoid hitting Gemini API rate limits
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log("Finished updating all products!");
        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

generateAndSaveEmbeddings();