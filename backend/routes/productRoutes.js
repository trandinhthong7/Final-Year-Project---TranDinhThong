const express = require("express");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { protect } = require("../Middleware/authMiddleware");

const router = express.Router();

// @route GET /api/products/most-popular
// @desc Get most popular products (3-5 per category: boots, gloves, accessories)
// @access Public
router.get("/most-popular", async (req, res) => {
    try {
        const itemsPerCategory = 5; // 3-5 items per category

        // Aggregate orders to find most sold products
        const popularProducts = await Order.aggregate([
            { $unwind: "$orderItem" },
            {
                $group: {
                    _id: "$orderItem.productId",
                    totalSold: { $sum: "$orderItem.quantity" }
                }
            },
            { $sort: { totalSold: -1 } }
        ]);

        // Create a map of productId to totalSold
        const salesMap = {};
        popularProducts.forEach(p => {
            salesMap[p._id.toString()] = p.totalSold;
        });

        // Get products for each category
        const categories = ['BOOTS', 'GLOVES', 'ACCESSORIES'];
        const allProducts = [];

        for (const category of categories) {
            // Get all published products for this category
            const categoryProducts = await Product.find({
                category: category,
                isPublished: true
            });

            // Add sales count and check for deal tag
            const productsWithData = categoryProducts.map(product => ({
                ...product.toObject(),
                totalSold: salesMap[product._id.toString()] || 0,
                hasDeal: product.tags && product.tags.some(tag => tag.toLowerCase() === 'deal')
            }));

            // Sort by: 1) Has deal tag, 2) Total sold, 3) Random
            const sortedProducts = productsWithData.sort((a, b) => {
                // First priority: products with "deal" tag
                if (a.hasDeal && !b.hasDeal) return -1;
                if (!a.hasDeal && b.hasDeal) return 1;
                
                // Second priority: products with sales
                if (a.totalSold > 0 || b.totalSold > 0) {
                    return b.totalSold - a.totalSold;
                }
                
                // Third priority: random for products with no sales
                return Math.random() - 0.5;
            });

            // Take 3-5 items (random between 3 and 5)
            const itemCount = Math.floor(Math.random() * 3) + 3; // Random: 3, 4, or 5
            const selectedProducts = sortedProducts.slice(0, Math.min(itemCount, sortedProducts.length));
            
            allProducts.push(...selectedProducts);
        }

        res.json(allProducts);
    } catch (error) {
        console.error("Error fetching most popular products:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route GET /api/products/featured/deals
// @desc Get products with "Deal" tag
// @access Public
router.get("/featured/deals", async (req, res) => {
    try {
        const products = await Product.find({ tags: "Deal", isPublished: true })
            .sort({ createdAt: -1 })
            .limit(8);
        res.json(products);
    } catch (error) {
        console.error("Error fetching deal products:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route GET /api/products/featured/new
// @desc Get products with "New" tag
// @access Public
router.get("/featured/new", async (req, res) => {
    try {
        const products = await Product.find({ tags: "New", isPublished: true })
            .sort({ createdAt: -1 })
            .limit(8);
        res.json(products);
    } catch (error) {
        console.error("Error fetching new products:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   GET /api/products/featured/bestsellers
// @desc    Get products with "Best Seller" tag
// @access  Public
router.get("/featured/bestsellers", async (req, res) => {
    try {
        const products = await Product.find({ tags: "Best Seller", isPublished: true })
            .sort({ rating: -1, numReviews: -1 })
            .limit(8);
        res.json(products);
    } catch (error) {
        console.error("Error fetching bestseller products:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   GET /api/products
// @desc    Get all products with filtering, sorting, and pagination
// @access  Public
router.get("/", async (req, res) => {
    try {
        const {
            category,
            brand,
            age,
            tags,
            minPrice,
            maxPrice,
            outsole,
            material,
            player,
            size,
            gloveSize,
            color,
            accessoryType,
            searchQuery,
            sortBy,
            order,
            page = 1,
            limit = 12
        } = req.query;

        // Build filter object - only show published products to public
        const filter = { isPublished: true };

        if (category) filter.category = category;
        if (brand) {
            filter.brand = { $in: brand.split(",") };
        }
        if (age) {
            // Age can be an array, so check if product's age array includes the requested age
            filter.age = { $in: age.split(",") };
        }
        if (tags) filter.tags = { $in: tags.split(",") };
        if (outsole) {
            filter.outsole = { $in: outsole.split(",") };
        }
        if (material) {
            filter.material = { $in: material.split(",") };
        }
        if (player) {
            filter.player = { $in: player.split(",") };
        }
        if (accessoryType) {
            filter.accessoryType = { $in: accessoryType.split(",") };
        }
        
        // Price range filter
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        // Color filter - search in colorVariants
        if (color) {
            filter["colorVariants.color"] = { $in: color.split(",") };
        }

        // Size filter - search in colorVariants.sizeStock or accessoryStock
        // For gloves, use gloveSize parameter
        const sizeParam = gloveSize || size;
        if (sizeParam) {
            const sizes = sizeParam.split(",");
            filter.$or = [
                { "colorVariants.sizeStock.size": { $in: sizes } },
                { [`accessoryStock.${sizes[0]}`]: { $exists: true } }
            ];
        }

        // Search by name or description
        if (searchQuery) {
            filter.$or = [
                { name: { $regex: searchQuery, $options: "i" } },
                { description: { $regex: searchQuery, $options: "i" } }
            ];
        }

        // Sorting - use sortBy and order parameters
        let sortOption = {};
        if (sortBy === "price") {
            sortOption.price = order === "asc" ? 1 : -1;
        } else if (sortBy === "name") {
            sortOption.name = order === "asc" ? 1 : -1;
        } else if (sortBy === "totalSold") {
            sortOption.totalSold = order === "asc" ? 1 : -1;
        } else {
            sortOption.createdAt = -1; // Default: newest first
        }

        // Pagination
        const skip = (page - 1) * limit;

        const products = await Product.find(filter)
            .sort(sortOption)
            .limit(Number(limit))
            .skip(skip);

        const total = await Product.countDocuments(filter);

        res.json({
            products,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            totalProducts: total
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        if (error.kind === "ObjectId") {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   GET /api/products/:id/related
// @desc    Get related products (You May Also Like)
// @access  Public
router.get("/:id/related", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Find related products with priority:
        // 1. Same category AND same brand (highest priority)
        // 2. Same category (medium priority)
        // 3. Random published products (fallback)
        
        const relatedProducts = await Product.aggregate([
            {
                $match: {
                    _id: { $ne: product._id }, // Exclude current product
                    isPublished: true
                }
            },
            {
                $addFields: {
                    // Calculate relevance score
                    relevanceScore: {
                        $add: [
                            // +10 points for same category
                            { $cond: [{ $eq: ["$category", product.category] }, 10, 0] },
                            // +5 points for same brand
                            { $cond: [{ $eq: ["$brand", product.brand] }, 5, 0] }
                        ]
                    }
                }
            },
            {
                $sort: {
                    relevanceScore: -1, // Sort by relevance first
                    createdAt: -1 // Then by newest
                }
            },
            {
                $limit: 4
            }
        ]);

        res.json(relatedProducts);
    } catch (error) {
        console.error("Error fetching related products:", error);
        if (error.kind === "ObjectId") {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   POST /api/products
// @desc    Create a new product
// @access  Private (Admin only)
router.post("/", protect, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }

        // Log the request body for debugging
        console.log("Request body:", JSON.stringify(req.body, null, 2));

        const {
            name,
            description,
            originalPrice,
            discount,
            sku,
            category,
            accessoryType,
            brand,
            age,
            tags,
            outsole,
            material,
            player,
            colorVariants,
            accessoryStock,
            images,
            isPublished,
            isBestSeller,
            isNewCollection,
            metaTitle,
            metaDescription,
            metaKeywords,
            dimensions,
            weight
        } = req.body;

        // Validation
        if (!name || !description || !originalPrice || !sku || !category) {
            console.log("Validation failed:", { name, description, originalPrice, sku, category });
            return res.status(400).json({ 
                message: "Please provide all required fields: name, description, originalPrice, sku, category" 
            });
        }

        // Check if SKU already exists
        const existingProduct = await Product.findOne({ sku });
        if (existingProduct) {
            return res.status(400).json({ message: "Product with this SKU already exists" });
        }

        // Category-specific validation
        if (category === "ACCESSORIES") {
            if (!accessoryType) {
                return res.status(400).json({ message: "Accessory type is required for ACCESSORIES" });
            }
            if (!accessoryStock || Object.keys(accessoryStock).length === 0) {
                return res.status(400).json({ message: "Stock information is required for accessories" });
            }
        } else {
            // BOOTS or GLOVES
            if (!colorVariants || colorVariants.length === 0) {
                return res.status(400).json({ message: "At least one color variant is required" });
            }
            if (!age || age.length === 0) {
                return res.status(400).json({ message: "Age group is required for boots and gloves" });
            }
        }

        // Create product
        const product = new Product({
            name,
            description,
            originalPrice,
            discount: discount || 0,
            price: originalPrice, // Set initial price (will be recalculated by pre-save hook)
            sku,
            category,
            accessoryType: category === "ACCESSORIES" ? accessoryType : "",
            brand,
            age: age || ["Adult"],
            tags: tags || [],
            outsole: category === "BOOTS" ? outsole : "",
            material: category === "BOOTS" ? material : "",
            player: category === "BOOTS" ? player : "None",
            colorVariants: category !== "ACCESSORIES" ? colorVariants : [],
            accessoryStock: category === "ACCESSORIES" ? accessoryStock : {},
            images: images || [],
            isPublished: isPublished !== undefined ? isPublished : true,
            isBestSeller: isBestSeller || false,
            isNewCollection: isNewCollection || false,
            metaTitle: metaTitle || "",
            metaDescription: metaDescription || "",
            metaKeywords: metaKeywords || [],
            dimensions: dimensions || { length: 0, width: 0, height: 0 },
            weight: weight || 0,
            user: req.user._id
        });

        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private (Admin only)
router.put("/:id", protect, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }

        const {
            name,
            description,
            originalPrice,
            discount,
            sku,
            category,
            accessoryType,
            brand,
            age,
            tags,
            outsole,
            material,
            player,
            colorVariants,
            accessoryStock,
            images,
            isPublished,
            isBestSeller,
            isNewCollection,
            metaTitle,
            metaDescription,
            metaKeywords,
            dimensions,
            weight
        } = req.body;

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if SKU is being changed and if it already exists
        if (sku && sku !== product.sku) {
            const existingProduct = await Product.findOne({ sku });
            if (existingProduct) {
                return res.status(400).json({ message: "Product with this SKU already exists" });
            }
        }

        // Update fields
        if (name !== undefined) product.name = name;
        if (description !== undefined) product.description = description;
        if (originalPrice !== undefined) product.originalPrice = originalPrice;
        if (discount !== undefined) product.discount = discount;
        if (sku !== undefined) product.sku = sku;
        if (category !== undefined) product.category = category;
        if (accessoryType !== undefined) product.accessoryType = accessoryType;
        if (brand !== undefined) product.brand = brand;
        if (age !== undefined) product.age = age;
        if (tags !== undefined) product.tags = tags;
        if (outsole !== undefined) product.outsole = outsole;
        if (material !== undefined) product.material = material;
        if (player !== undefined) product.player = player;
        if (colorVariants !== undefined) product.colorVariants = colorVariants;
        if (accessoryStock !== undefined) product.accessoryStock = accessoryStock;
        if (images !== undefined) product.images = images;
        if (isPublished !== undefined) product.isPublished = isPublished;
        if (isBestSeller !== undefined) product.isBestSeller = isBestSeller;
        if (isNewCollection !== undefined) product.isNewCollection = isNewCollection;
        if (metaTitle !== undefined) product.metaTitle = metaTitle;
        if (metaDescription !== undefined) product.metaDescription = metaDescription;
        if (metaKeywords !== undefined) product.metaKeywords = metaKeywords;
        if (dimensions !== undefined) product.dimensions = dimensions;
        if (weight !== undefined) product.weight = weight;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        if (error.kind === "ObjectId") {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private (Admin only)
router.delete("/:id", protect, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        if (error.kind === "ObjectId") {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   PATCH /api/products/:id/stock
// @desc    Update stock for a specific color/size combination
// @access  Private (Admin only)
router.patch("/:id/stock", protect, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }

        const { colorIndex, sizeIndex, stock, accessorySize } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.category === "ACCESSORIES") {
            // Update accessory stock
            if (!accessorySize) {
                return res.status(400).json({ message: "Accessory size is required" });
            }
            product.accessoryStock.set(accessorySize, stock);
        } else {
            // Update color variant stock
            if (colorIndex === undefined || sizeIndex === undefined) {
                return res.status(400).json({ message: "Color index and size index are required" });
            }
            if (!product.colorVariants[colorIndex]) {
                return res.status(404).json({ message: "Color variant not found" });
            }
            if (!product.colorVariants[colorIndex].sizeStock[sizeIndex]) {
                return res.status(404).json({ message: "Size not found" });
            }
            product.colorVariants[colorIndex].sizeStock[sizeIndex].stock = stock;
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        console.error("Error updating stock:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;