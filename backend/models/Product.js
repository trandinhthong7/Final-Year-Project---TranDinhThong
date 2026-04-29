const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    originalPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    countInStock: {
        type: Number,
        min: 0,
        default: 0,
    },
    sku: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        enum: ["BOOTS", "GLOVES", "ACCESSORIES"],
    },
    accessoryType: {
        type: String,
        enum: ["Balls", "Socks", "Tape", ""],
        default: "",
    },
    brand: {
        type: String,
        required: true,
    },
    age: {
        type: [String],
        default: ["Adult"],
        validate: {
            validator: function(arr) {
                return arr.length > 0 && arr.every(val => ["Adult", "Kids"].includes(val));
            },
            message: 'Age must contain at least one value from: Adult, Kids'
        }
    },
    tags: {
        type: [String],
        default: [],
    },
    // Color variants with their own sizes and stock (for BOOTS and GLOVES)
    colorVariants: [{
        color: {
            type: String,
            required: true,
        },
        hexCode: {
            type: String,
            default: "",
        },
        images: {
            type: [String],
            default: [],
        },
        sizeStock: [{
            size: {
                type: String,
                required: true,
            },
            stock: {
                type: Number,
                required: true,
                min: 0,
                default: 0,
            }
        }]
    }],
    // Stock for ACCESSORIES (no color variants)
    accessoryStock: {
        type: Map,
        of: Number,
        default: {}
    },
    // Boot-specific fields
    outsole: {
        type: String,
        enum: ["Firm Ground", "Artificial Grass", "Indoor", ""],
        default: "",
    },
    material: {
        type: String,
        enum: ["Leather", "Synthetic", ""],
        default: "",
    },
    player: {
        type: String,
        enum: ["None", "Cristiano Ronaldo", "Lionel Messi", "Neymar Jr.", "Kylian Mbappe", "Lamine Yamal", ""],
        default: "None",
    },
    images: {
        type: [String],
        default: [],
        // Main product images (used as fallback if color variants don't have images)
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    numReviews: {
        type: Number,
        default: 0,
        min: 0,
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
    isBestSeller: {
        type: Boolean,
        default: false,
    },
    isNewCollection: {
        type: Boolean,
        default: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false, // Made optional since admin creates products
    },
    metaTitle: {
        type: String,
        default: "",
    },
    metaDescription: {
        type: String,
        default: "",
    },
    metaKeywords: {
        type: [String],
        default: [],
    },
    dimensions: {
        length: { type: Number, min: 0, default: 0 },
        width: { type: Number, min: 0, default: 0 },
        height: { type: Number, min: 0, default: 0 },
    },
    weight: {
        type: Number,
        min: 0,
        default: 0,
    },
    // AI chatbot
    embedding: {
        type: [Number],
        default: []
    }
}, { timestamps: true });

// Auto-calculate price before saving
productSchema.pre("save", function() {
    if (this.isModified("originalPrice") || this.isModified("discount")) {
        this.price = (this.originalPrice - (this.originalPrice * this.discount / 100)).toFixed(2);
    }
    
    // Calculate total stock based on category
    if (this.category === "ACCESSORIES" && this.accessoryStock) {
        // For accessories, sum up accessoryStock values
        this.countInStock = Array.from(this.accessoryStock.values()).reduce((sum, val) => sum + val, 0);
    } else if (this.colorVariants && this.colorVariants.length > 0) {
        // For boots and gloves, sum up from color variants
        this.countInStock = this.colorVariants.reduce((total, variant) => {
            const variantTotal = variant.sizeStock.reduce((sum, sizeItem) => sum + sizeItem.stock, 0);
            return total + variantTotal;
        }, 0);
    }
});

// Index for better query performance
productSchema.index({ category: 1, brand: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);
