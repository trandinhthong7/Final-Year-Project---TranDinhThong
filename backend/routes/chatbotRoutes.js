// backend/routes/chatbotRoutes.js
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Product = require('../models/Product');
const router = express.Router();

// Initialize Gemini SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to detect if user is asking for products
const isProductQuery = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Greetings and casual conversation (must be short and only greeting)
    const greetings = /\b(hi|hello|hey|good morning|good afternoon|good evening|thanks|thank you|bye|goodbye)\b/;
    if (greetings.test(lowerMessage) && lowerMessage.length < 30 && !lowerMessage.match(/\b(boot|shoe|glove|ball|sock|play|indoor|outdoor|grass|field)\b/)) {
        return false;
    }
    
    // Irrelevant requests
    const irrelevant = /\b(password|pass|money|cash|free|discount code|coupon|hack|credit card|personal|address|phone|email)\b/;
    if (irrelevant.test(lowerMessage)) {
        return false;
    }
    
    // Product-related keywords (expanded with play context)
    const productKeywords = /\b(show|find|looking for|need|want|buy|purchase|recommend|suggest|boot|boots|shoe|shoes|glove|gloves|ball|balls|sock|socks|tape|product|equipment|gear|nike|adidas|puma|under armour|mizuno|new balance|uhlsport|thuong dinh|play|playing|indoor|outdoor|futsal|artificial|grass|turf|field|pitch)\b/;
    
    return productKeywords.test(lowerMessage);
};

// Helper function to detect brand from user query
const detectBrand = (message) => {
    const lowerMessage = message.toLowerCase();
    
    const brands = {
        'nike': 'Nike',
        'adidas': 'Adidas',
        'puma': 'Puma',
        'mizuno': 'Mizuno',
        'new balance': 'New Balance',
        'under armour': 'Under Armour',
        'uhlsport': 'Uhlsport',
        'thuong dinh': 'Thuong Dinh',
        'soka': 'Soka'
    };
    
    for (const [key, value] of Object.entries(brands)) {
        if (lowerMessage.includes(key)) {
            return value;
        }
    }
    
    return null;
};

// Helper function to detect category from user query
const detectCategory = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Football boots keywords
    if (lowerMessage.match(/\b(boot|boots|shoe|shoes|cleats|cleat|footwear|studs)\b/)) {
        return 'BOOTS';
    }
    
    // Goalkeeper gloves keywords
    if (lowerMessage.match(/\b(glove|gloves|goalkeeper|keeper|goalie)\b/)) {
        return 'GLOVES';
    }
    
    // Accessories keywords
    if (lowerMessage.match(/\b(ball|balls|sock|socks|tape|tapes|accessory|accessories|equipment)\b/)) {
        return 'ACCESSORIES';
    }
    
    return null; // No specific category detected
};

// Helper function to enhance query for better search
const enhanceQuery = (message) => {
    let enhanced = message;
    
    // Map common terms to football-specific terms
    const termMappings = {
        'shoe': 'football boot',
        'shoes': 'football boots',
        'cleat': 'football boot',
        'cleats': 'football boots',
        'keeper': 'goalkeeper',
        'goalie': 'goalkeeper',
        'in house': 'indoor',
        'indoor': 'indoor football boot',
        'futsal': 'indoor football boot',
        'play indoor': 'indoor football boot',
        'play in house': 'indoor football boot'
    };
    
    Object.entries(termMappings).forEach(([from, to]) => {
        const regex = new RegExp(`\\b${from}\\b`, 'gi');
        enhanced = enhanced.replace(regex, to);
    });
    
    return enhanced;
};

router.post('/', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // Check if this is a product query
        const isProduct = isProductQuery(message);
        
        // If not a product query, respond without products
        if (!isProduct) {
            const chatModel = genAI.getGenerativeModel({ 
                model: "gemini-2.5-flash-lite",
                systemInstruction: `You are a helpful AI assistant for TDT Stadium, a football equipment store.

IMPORTANT RULES:
1. For greetings (hi, hello, hey), respond warmly and briefly introduce yourself
2. For thank you messages, respond politely
3. For irrelevant requests (passwords, money, personal info, discounts codes), politely decline and explain you can only help with product recommendations
4. Keep responses very brief (1-2 sentences)
5. Always be friendly and professional

RESPONSE EXAMPLES:
- "Hi" → "Hello! I'm the TDT Stadium assistant. I can help you find football boots, gloves, and accessories. What are you looking for?"
- "Thanks" → "You're welcome! Let me know if you need anything else."
- "Give me a discount code" → "I'm sorry, I can only help you find and recommend products. For discount codes, please contact our customer service."
- "What's your password?" → "I'm a product consultant and can only help you find football equipment. How can I assist you with boots, gloves, or accessories?"`
            });

            const chatResult = await chatModel.generateContent(message);
            const botReply = chatResult.response.text();

            return res.json({ 
                reply: botReply,
                products: [] // No products for non-product queries
            });
        }

        // Detect category and brand from user query
        const detectedCategory = detectCategory(message);
        const detectedBrand = detectBrand(message);
        
        // Enhance query for better search results
        const enhancedMessage = enhanceQuery(message);

        // 1. Convert user's message into an embedding vector
        const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
        const result = await model.embedContent(enhancedMessage);
        const queryVector = result.embedding.values;

        // 2. Perform Vector Search in MongoDB
        let relevantProducts = await Product.aggregate([
            {
                "$vectorSearch": {
                    "index": "vector_index", 
                    "path": "embedding",
                    "queryVector": queryVector,
                    "numCandidates": 20,
                    "limit": 8 // Get more products initially
                }
            },
            {
                "$project": {
                    "_id": 1,
                    "name": 1,
                    "description": 1,
                    "price": 1,
                    "category": 1,
                    "brand": 1,
                    "player": 1,
                    "outsole": 1,
                    "countInStock": 1,
                    "images": 1,
                    "colorVariants": 1
                }
            }
        ]);

        // 3. Filter products by detected category and brand
        if (detectedCategory && relevantProducts.length > 0) {
            const categoryFiltered = relevantProducts.filter(p => p.category === detectedCategory);
            
            // Only use filtered results if we found products in that category
            if (categoryFiltered.length > 0) {
                relevantProducts = categoryFiltered;
            }
        }
        
        // Filter by brand if detected
        if (detectedBrand && relevantProducts.length > 0) {
            const brandFiltered = relevantProducts.filter(p => p.brand === detectedBrand);
            
            // Only use brand filtered results if we found products from that brand
            if (brandFiltered.length > 0) {
                relevantProducts = brandFiltered;
            }
        }
        
        // Limit to maximum 4 products, but can be less
        relevantProducts = relevantProducts.slice(0, 4);

        // 4. Format the retrieved products into a text string
        let contextText = "";
        
        if (relevantProducts.length === 0) {
            contextText = "No matching products found in the database.\n\n";
        } else {
            contextText = `Found ${relevantProducts.length} relevant product(s):\n\n`;
            relevantProducts.forEach((product, index) => {
                contextText += `${index + 1}. ${product.name}\n`;
                contextText += `   Category: ${product.category}\n`;
                contextText += `   Brand: ${product.brand}\n`;
                contextText += `   Price: $${product.price}\n`;
                contextText += `   Description: ${product.description}\n`;
                if (product.player && product.player !== "None") {
                    contextText += `   Associated Player: ${product.player}\n`;
                }
                if (product.outsole) {
                    contextText += `   Outsole: ${product.outsole}\n`;
                }
                if (product.colorVariants && product.colorVariants.length > 0) {
                    const colors = product.colorVariants.map(v => v.color).join(', ');
                    contextText += `   Available Colors: ${colors}\n`;
                }
                contextText += `   In Stock: ${product.countInStock > 0 ? 'Yes' : 'No'}\n`;
                contextText += `\n`;
            });
        }
        
        // Add context about what user is looking for
        let userContext = `User is looking for: ${message}\n`;
        if (detectedCategory) {
            userContext += `Detected Category: ${detectedCategory}\n`;
        }
        if (detectedBrand) {
            userContext += `Detected Brand: ${detectedBrand}\n`;
        }
        userContext += `\n`;

        // 5. Send the context and user query to Gemini 2.5 Flash Lite
        const chatModel = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash-lite",
            systemInstruction: `You are a helpful, enthusiastic, and expert AI sales assistant for TDT Stadium, a football equipment store.

IMPORTANT RULES:
1. Use ONLY the provided product context to recommend items
2. If the user asks for "shoes" or "boots", recommend products from the BOOTS category ONLY
3. If the user asks for "gloves", recommend products from the GLOVES category ONLY
4. If the user asks for "balls", "socks", or "tape", recommend products from the ACCESSORIES category ONLY
5. If user specifies a brand (Nike, Adidas, Puma, etc.), ONLY recommend products from that brand
6. If user mentions "indoor", "in house", "futsal", recommend boots with Indoor outsole
7. If user mentions "artificial grass", "turf", "AG", recommend boots with Artificial Grass outsole
8. If user mentions "firm ground", "grass", "FG", recommend boots with Firm Ground outsole
9. If the provided products don't match the user's request (wrong category, brand, or surface), politely explain that we don't have exactly what they're looking for
10. Always mention the product category, brand, and outsole type when recommending boots
11. Keep responses friendly, concise, and easy to read (2-3 sentences max)
12. Do not make up product details or prices
13. If showing multiple products, briefly highlight what makes each one special
14. The number of products can vary (1-4), don't always expect 4 products

RESPONSE FORMAT:
- Start with a friendly acknowledgment of their request
- Recommend the products that match their needs
- Mention key features (brand, price, outsole type, special attributes)
- Keep it conversational and helpful
- If only 1-2 products found, that's fine - recommend what's available`
        });

        const prompt = `${userContext}${contextText}\n\nProvide a helpful recommendation based on these products. Remember to only recommend products that match the user's category and brand requirements.`;
        
        const chatResult = await chatModel.generateContent(prompt);
        const botReply = chatResult.response.text();

        // Send the AI's response back to the frontend
        res.json({ 
            reply: botReply,
            products: relevantProducts 
        });

    } catch (error) {
        console.error("Chatbot Error:", error);
        res.status(500).json({ error: "Something went wrong with the AI assistant." });
    }
});

module.exports = router;
