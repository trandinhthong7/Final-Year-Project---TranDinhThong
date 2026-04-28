import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { fetchProductById, createProduct, updateProduct } from '../../redux/slices/adminProductSlice'

const EditProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentProduct, loading, error } = useSelector((state) => state.adminProducts);
    const isEditMode = id !== 'new';

    const [productData, setProductData] = useState({
        name: "",
        originalPrice: 0,
        discount: 0,
        price: 0,
        countInStock: 0,
        sku: "",
        category: "",
        accessoryType: "", // For ACCESSORIES category
        brand: "",
        age: ["Adult"], // Default to Adult, can be array for multiple selections
        tags: [],
        outsole: "",
        material: "",
        player: "",
        description: "",
        colorVariants: [],
        accessoryStock: {}, // For ACCESSORIES without color variants
        images: [],
        isPublished: true,
        isBestSeller: false,
        isNewCollection: false,
        metaTitle: "",
        metaDescription: "",
        metaKeywords: [],
        dimensions: {
            length: 0,
            width: 0,
            height: 0,
        },
        weight: 0,
    });

    const categoryOptions = ["BOOTS", "GLOVES", "ACCESSORIES"];
    const accessoryTypes = ["Balls", "Socks", "Tape"];
    
    // Brand options based on category and accessory type
    const getBrandOptions = () => {
        if (productData.category === "BOOTS") {
            return ["Nike", "Adidas", "Puma", "New Balance", "Mizuno", "Under Armour", "Uhlsport", "Thuong Dinh"];
        }
        if (productData.category === "GLOVES") {
            return ["Adidas", "Nike", "Puma", "Uhlsport"];
        }
        if (productData.category === "ACCESSORIES") {
            if (productData.accessoryType === "Balls" || productData.accessoryType === "Socks") {
                return ["Adidas", "Nike", "Puma", "Uhlsport"];
            }
            if (productData.accessoryType === "Tape") {
                return ["Soka"];
            }
        }
        return [];
    };
    
    // Size options based on category and accessory type
    const getSizeOptions = () => {
        if (productData.category === "BOOTS") {
            return Array.from({ length: 15 }, (_, i) => (36 + i).toString()); // 36-50
        }
        if (productData.category === "GLOVES") {
            return ["7", "8", "8.5", "9", "9.5", "10", "10.5", "11"];
        }
        if (productData.category === "ACCESSORIES") {
            if (productData.accessoryType === "Balls") {
                return ["3", "4", "5"];
            }
            if (productData.accessoryType === "Socks") {
                return ["S", "SX", "M", "L", "XL"];
            }
            if (productData.accessoryType === "Tape") {
                return []; // No sizes for tape
            }
        }
        return [];
    };
    
    // Tag options based on category and accessory type
    const getTagOptions = () => {
        if (productData.category === "ACCESSORIES") {
            return ["New", "Deal"];
        }
        return ["New", "Deal", "Best Seller"];
    };
    
    const ageOptions = ["Adult", "Kids"];
    const outsoleOptions = ["Firm Ground", "Artificial Grass", "Indoor"];
    const materialOptions = ["Leather", "Synthetic"];
    const playerOptions = ["None", "Cristiano Ronaldo", "Lionel Messi", "Neymar Jr.", "Kylian Mbappe", "Lamine Yamal"];
    const colorSuggestions = [
        "Black", "White", "Red", "Blue", "Green", "Yellow", "Orange", "Purple", 
        "Pink", "Gray", "Brown", "Navy", "Teal", "Lime", "Maroon", "Olive", 
        "Cyan", "Magenta", "Silver", "Gold", "Beige", "Turquoise", "Violet", "Indigo"
    ];

    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [colorInputs, setColorInputs] = useState({});
    const [filteredSuggestions, setFilteredSuggestions] = useState({});
    const [showColorDropdown, setShowColorDropdown] = useState({});
    const [colorImageFiles, setColorImageFiles] = useState({}); // Store image files per color variant

    useEffect(() => {
        if (isEditMode) {
            // Fetch product data for editing
            dispatch(fetchProductById(id));
        }
    }, [id, isEditMode, dispatch]);

    useEffect(() => {
        // Populate form when product data is loaded
        if (isEditMode && currentProduct) {
            setProductData({
                name: currentProduct.name || "",
                originalPrice: currentProduct.originalPrice || 0,
                discount: currentProduct.discount || 0,
                price: currentProduct.price || 0,
                countInStock: currentProduct.countInStock || 0,
                sku: currentProduct.sku || "",
                category: currentProduct.category || "",
                accessoryType: currentProduct.accessoryType || "",
                brand: currentProduct.brand || "",
                age: currentProduct.age || ["Adult"],
                tags: currentProduct.tags || [],
                outsole: currentProduct.outsole || "",
                material: currentProduct.material || "",
                player: currentProduct.player || "",
                description: currentProduct.description || "",
                colorVariants: currentProduct.colorVariants || [],
                accessoryStock: currentProduct.accessoryStock || {},
                images: currentProduct.images || [],
                isPublished: currentProduct.isPublished !== undefined ? currentProduct.isPublished : true,
                isBestSeller: currentProduct.isBestSeller || false,
                isNewCollection: currentProduct.isNewCollection || false,
                metaTitle: currentProduct.metaTitle || "",
                metaDescription: currentProduct.metaDescription || "",
                metaKeywords: currentProduct.metaKeywords || [],
                dimensions: currentProduct.dimensions || { length: 0, width: 0, height: 0 },
                weight: currentProduct.weight || 0,
            });
            
            // Initialize color inputs
            const initialColorInputs = {};
            (currentProduct.colorVariants || []).forEach((variant, index) => {
                initialColorInputs[index] = variant.color;
            });
            setColorInputs(initialColorInputs);
            
            // Set image previews if product has images
            if (currentProduct.images && currentProduct.images.length > 0) {
                setImagePreviews(currentProduct.images);
            }
        }
    }, [currentProduct, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedData = { ...productData, [name]: value };

        // Auto calculate final price if original price or discount changes
        if (name === "originalPrice" || name === "discount") {
            const orig = parseFloat(updatedData.originalPrice) || 0;
            const disc = parseFloat(updatedData.discount) || 0;
            updatedData.price = (orig - (orig * disc / 100)).toFixed(2);
        }

        setProductData(updatedData);
    };

    const handleTagChange = (tag) => {
        setProductData(prev => {
            const currentTags = prev.tags || [];
            const isSelected = currentTags.includes(tag);
            
            return {
                ...prev,
                tags: isSelected 
                    ? currentTags.filter(t => t !== tag)
                    : [...currentTags, tag]
            };
        });
    };

    const handleAgeChange = (ageOption) => {
        setProductData(prev => {
            const currentAge = Array.isArray(prev.age) ? prev.age : [prev.age];
            const isSelected = currentAge.includes(ageOption);
            
            // Ensure at least one age is always selected
            if (isSelected && currentAge.length === 1) {
                return prev; // Don't allow deselecting the last option
            }
            
            return {
                ...prev,
                age: isSelected 
                    ? currentAge.filter(a => a !== ageOption)
                    : [...currentAge, ageOption]
            };
        });
    };

    const handleAddColorVariant = () => {
        const newIndex = productData.colorVariants.length;
        setProductData(prev => ({
            ...prev,
            colorVariants: [
                ...prev.colorVariants,
                {
                    color: "",
                    hexCode: "",
                    images: [],
                    sizeStock: []
                }
            ]
        }));
        setColorInputs(prev => ({ ...prev, [newIndex]: "" }));
    };

    const handleRemoveColorVariant = (colorIndex) => {
        const colorName = productData.colorVariants[colorIndex].color || "this color";
        
        if (window.confirm(`Are you sure you want to delete ${colorName}?`)) {
            setProductData(prev => ({
                ...prev,
                colorVariants: prev.colorVariants.filter((_, idx) => idx !== colorIndex)
            }));
            
            // Clean up color input state
            setColorInputs(prev => {
                const newInputs = { ...prev };
                delete newInputs[colorIndex];
                return newInputs;
            });
            
            setFilteredSuggestions(prev => {
                const newSuggestions = { ...prev };
                delete newSuggestions[colorIndex];
                return newSuggestions;
            });
            
            toast.success(`Deleted ${colorName} successfully`, {
                duration: 2000,
            });
        }
    };

    const handleColorInputChange = (colorIndex, value) => {
        setColorInputs(prev => ({ ...prev, [colorIndex]: value }));
        
        // Update the actual color in productData
        handleColorChange(colorIndex, 'color', value);
        
        // Filter suggestions
        if (value.trim()) {
            const filtered = colorSuggestions.filter(color =>
                color.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredSuggestions(prev => ({ ...prev, [colorIndex]: filtered }));
        } else {
            setFilteredSuggestions(prev => ({ ...prev, [colorIndex]: [] }));
        }
    };

    const handleSelectSuggestion = (colorIndex, color) => {
        setColorInputs(prev => ({ ...prev, [colorIndex]: color }));
        handleColorChange(colorIndex, 'color', color);
        setFilteredSuggestions(prev => ({ ...prev, [colorIndex]: [] }));
    };

    const handleColorChange = (colorIndex, field, value) => {
        setProductData(prev => {
            const updatedVariants = [...prev.colorVariants];
            updatedVariants[colorIndex] = {
                ...updatedVariants[colorIndex],
                [field]: value
            };
            return { ...prev, colorVariants: updatedVariants };
        });
    };

    const handleAddSize = (colorIndex, size) => {
        setProductData(prev => {
            const updatedVariants = [...prev.colorVariants];
            const variant = updatedVariants[colorIndex];
            
            // Check if size already exists
            if (variant.sizeStock.some(s => s.size === size)) {
                return prev;
            }
            
            updatedVariants[colorIndex] = {
                ...variant,
                sizeStock: [...variant.sizeStock, { size, stock: 0 }]
            };
            return { ...prev, colorVariants: updatedVariants };
        });
    };

    const handleCategoryChange = (e) => {
        const newCategory = e.target.value;
        setProductData(prev => ({
            ...prev,
            category: newCategory,
            accessoryType: newCategory === "ACCESSORIES" ? "" : prev.accessoryType,
            brand: "", // Reset brand when category changes
            colorVariants: [], // Reset color variants when category changes
            tags: [] // Reset tags
        }));
    };

    const handleAccessoryTypeChange = (e) => {
        const newType = e.target.value;
        setProductData(prev => ({
            ...prev,
            accessoryType: newType,
            brand: "", // Reset brand when accessory type changes
            colorVariants: [], // Reset color variants
            tags: [] // Reset tags
        }));
    };

    const handleRemoveSize = (colorIndex, sizeIndex) => {
        setProductData(prev => {
            const updatedVariants = [...prev.colorVariants];
            updatedVariants[colorIndex] = {
                ...updatedVariants[colorIndex],
                sizeStock: updatedVariants[colorIndex].sizeStock.filter((_, idx) => idx !== sizeIndex)
            };
            return { ...prev, colorVariants: updatedVariants };
        });
    };

    const handleStockChange = (colorIndex, sizeIndex, stock) => {
        setProductData(prev => {
            const updatedVariants = [...prev.colorVariants];
            updatedVariants[colorIndex].sizeStock[sizeIndex].stock = parseInt(stock) || 0;
            return { ...prev, colorVariants: updatedVariants };
        });
    };

    const calculateTotalStock = () => {
        if (productData.category === "ACCESSORIES") {
            return Object.values(productData.accessoryStock || {}).reduce((sum, val) => sum + val, 0);
        }
        return productData.colorVariants.reduce((total, variant) => {
            return total + variant.sizeStock.reduce((sum, sizeItem) => sum + sizeItem.stock, 0);
        }, 0);
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            // Convert files to base64 or create object URLs
            const newPreviews = [];
            const newImagePaths = [];
            
            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    newPreviews.push(reader.result);
                    newImagePaths.push(reader.result);
                    
                    if (newPreviews.length === files.length) {
                        setImagePreviews(prev => [...prev, ...newPreviews]);
                        setProductData(prev => ({
                            ...prev,
                            images: [...prev.images, ...newImagePaths]
                        }));
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleColorImageUpload = (colorIndex, e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newImages = [];
            
            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    newImages.push(reader.result);
                    
                    if (newImages.length === files.length) {
                        setProductData(prev => {
                            const updatedVariants = [...prev.colorVariants];
                            updatedVariants[colorIndex] = {
                                ...updatedVariants[colorIndex],
                                images: [...(updatedVariants[colorIndex].images || []), ...newImages]
                            };
                            return { ...prev, colorVariants: updatedVariants };
                        });
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleRemoveColorImage = (colorIndex, imageIndex) => {
        setProductData(prev => {
            const updatedVariants = [...prev.colorVariants];
            updatedVariants[colorIndex] = {
                ...updatedVariants[colorIndex],
                images: updatedVariants[colorIndex].images.filter((_, idx) => idx !== imageIndex)
            };
            return { ...prev, colorVariants: updatedVariants };
        });
    };

    // Clean up object URLs to avoid memory leaks
    useEffect(() => {
        return () => {
             imagePreviews.forEach(url => {
                 if (url.startsWith('blob:')) {
                     URL.revokeObjectURL(url);
                 }
             });
        };
    }, [imagePreviews]);

    const handleRemoveImage = (index) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        setProductData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate based on category
        if (productData.category === "ACCESSORIES") {
            // For accessories, check if stock is defined
            if (!productData.accessoryStock || Object.keys(productData.accessoryStock).length === 0) {
                toast.error("Please add stock for the accessory.");
                return;
            }
        } else {
            // For BOOTS and GLOVES, validate color variants
            if (productData.colorVariants.length === 0) {
                toast.error("Please add at least one color variant with sizes and stock.");
                return;
            }
            
            // Validate that each color variant has at least one size
            const invalidVariants = productData.colorVariants.filter(v => v.sizeStock.length === 0);
            if (invalidVariants.length > 0) {
                toast.error("Each color variant must have at least one size with stock.");
                return;
            }
        }
        
        const submissionData = {
            ...productData,
            countInStock: calculateTotalStock()
        };
        
        try {
            if (isEditMode) {
                // Update existing product
                await dispatch(updateProduct({ 
                    productId: id, 
                    productData: submissionData 
                })).unwrap();
                toast.success("Product updated successfully!");
            } else {
                // Create new product
                await dispatch(createProduct(submissionData)).unwrap();
                toast.success("Product created successfully!");
            }
            navigate("/admin/products");
        } catch (error) {
            toast.error(error || `Failed to ${isEditMode ? 'update' : 'create'} product`);
        }
    };

  if (loading && isEditMode && !currentProduct) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-[#004643]">Loading product...</div>
      </div>
    );
  }

  if (error && isEditMode) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-[#e16162]">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-[#001e1d]">
            {isEditMode ? `Edit Product: #${id} - ${productData.name}` : 'Create New Product'}
        </h2>
        <form onSubmit={handleSubmit} className="bg-[#004643] p-6 rounded-lg">
            {/* Name & SKU */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-[#fffffe] mb-2 font-medium">Product Name</label>
                    <input 
                        type="text" 
                        name="name"
                        value={productData.name} 
                        onChange={handleChange}
                        className="w-full p-3 border rounded text-[#001e1d] bg-[#abd1c6] focus:outline-none focus:ring-2 focus:ring-[#f9bc60]" 
                        required 
                    />
                </div>
                <div>
                    <label className="block text-[#fffffe] mb-2 font-medium">SKU</label>
                    <input 
                        type="text" 
                        name="sku"
                        value={productData.sku} 
                        onChange={handleChange}
                        className="w-full p-3 border rounded text-[#001e1d] bg-[#abd1c6] focus:outline-none focus:ring-2 focus:ring-[#f9bc60]" 
                        required 
                    />
                </div>
            </div>

            {/* Description */}
            <div className="max-w-4xl mb-4">
                <label className="block text-[#fffffe] mb-2 font-medium">Description</label>
                <textarea 
                    name="description"
                    value={productData.description} 
                    onChange={handleChange}
                    className="w-full p-3 border rounded text-[#001e1d] bg-[#abd1c6] focus:outline-none focus:ring-2 focus:ring-[#f9bc60]" 
                    rows={4}
                    required 
                />    
            </div>

            {/* Price */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                    <label className="block text-[#fffffe] mb-2 font-medium">Original Price ($)</label>
                    <input 
                        type="number" 
                        name="originalPrice"
                        value={productData.originalPrice} 
                        onChange={handleChange}
                        className="w-full p-3 border rounded text-[#001e1d] bg-[#abd1c6] focus:outline-none focus:ring-2 focus:ring-[#f9bc60]" 
                        step="0.01"
                        min="0"
                        required
                    />
                </div>
                <div>
                    <label className="block text-[#fffffe] mb-2 font-medium">Discount (%)</label>
                    <input 
                        type="number" 
                        name="discount"
                        value={productData.discount} 
                        onChange={handleChange}
                        className="w-full p-3 border rounded text-[#001e1d] bg-[#abd1c6] focus:outline-none focus:ring-2 focus:ring-[#f9bc60]" 
                        min="0"
                        max="100"
                    />
                </div>
                <div>
                    <label className="block text-[#fffffe] mb-2 font-medium">Final Price ($)</label>
                    <input 
                        type="number" 
                        name="price"
                        value={productData.price} 
                        className="w-full p-3 border rounded bg-[#abd1c6] text-[#001e1d] font-bold cursor-not-allowed" 
                        disabled
                    />
                </div>
            </div>

            {/* Stock, Category */}
            <div className="mb-4">
                <label className="block text-[#fffffe] mb-2 font-medium">Total Stock (Auto-calculated)</label>
                <input 
                    type="number" 
                    value={calculateTotalStock()} 
                    className="w-full p-3 border rounded bg-[#abd1c6] text-[#001e1d] font-bold cursor-not-allowed" 
                    disabled
                />
                <p className="text-[#abd1c6] text-sm mt-1">This is automatically calculated from all color variants</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                    <label className="block text-[#fffffe] mb-2 font-medium">Category</label>
                    <select 
                        name="category"
                        value={productData.category} 
                        onChange={handleCategoryChange}
                        className="w-full p-3 border rounded text-[#001e1d] bg-[#abd1c6] focus:outline-none focus:ring-2 focus:ring-[#f9bc60]" 
                        required 
                    >
                        <option value="">Select Category</option>
                        {categoryOptions.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                
                {/* Accessory Type - Only show for ACCESSORIES */}
                {productData.category === "ACCESSORIES" && (
                    <div>
                        <label className="block text-[#fffffe] mb-2 font-medium">Accessory Type</label>
                        <select 
                            name="accessoryType"
                            value={productData.accessoryType} 
                            onChange={handleAccessoryTypeChange}
                            className="w-full p-3 border rounded text-[#001e1d] bg-[#abd1c6] focus:outline-none focus:ring-2 focus:ring-[#f9bc60]" 
                            required 
                        >
                            <option value="">Select Type</option>
                            {accessoryTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                )}
                
                {/* Brand - Show only if not ACCESSORIES or if accessory type is selected */}
                {(productData.category !== "ACCESSORIES" || productData.accessoryType) && getBrandOptions().length > 0 && (
                    <div>
                        <label className="block text-[#fffffe] mb-2 font-medium">Brand</label>
                        <select 
                            name="brand"
                            value={productData.brand} 
                            onChange={handleChange}
                            className="w-full p-3 border rounded text-[#001e1d] bg-[#abd1c6] focus:outline-none focus:ring-2 focus:ring-[#f9bc60]" 
                            required 
                        >
                            <option value="">Select Brand</option>
                            {getBrandOptions().map((brand) => (
                                <option key={brand} value={brand}>{brand}</option>
                            ))}
                        </select>
                    </div>
                )}
                
                {/* Age Group - Only for BOOTS and GLOVES */}
                {(productData.category === "BOOTS" || productData.category === "GLOVES") && (
                    <div>
                        <label className="block text-[#fffffe] mb-2 font-medium">Age Group (Select at least one)</label>
                        <div className="flex flex-wrap gap-3">
                            {ageOptions.map((ageOption) => (
                                <div key={ageOption} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`age-${ageOption}`}
                                        checked={Array.isArray(productData.age) ? productData.age.includes(ageOption) : productData.age === ageOption}
                                        onChange={() => handleAgeChange(ageOption)}
                                        className="mr-2 h-4 w-4 text-[#fffffe] accent-[#f9bc60] cursor-pointer"
                                    />
                                    <label htmlFor={`age-${ageOption}`} className="text-[#fffffe] cursor-pointer">
                                        {ageOption}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {Array.isArray(productData.age) && productData.age.length > 0 && (
                            <p className="text-sm mt-2 text-[#abd1c6]">
                                Selected: {productData.age.join(", ")}
                            </p>
                        )}
                    </div>
                )}
            </div>

            <div className="mb-4">
                <label className="block text-[#fffffe] mb-3 font-medium">Tags (Select Multiple)</label>
                <div className="flex flex-wrap gap-3">
                    {getTagOptions().map((tag) => (
                        <div key={tag} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`tag-${tag}`}
                                checked={productData.tags.includes(tag)}
                                onChange={() => handleTagChange(tag)}
                                className="mr-2 h-4 w-4 text-[#fffffe] accent-[#f9bc60] cursor-pointer"
                            />
                            <label htmlFor={`tag-${tag}`} className="text-[#fffffe] cursor-pointer">
                                {tag}
                            </label>
                        </div>
                    ))}
                </div>
                {productData.tags.length > 0 && (
                    <p className="text-sm mt-2 text-[#abd1c6]">
                        Selected: {productData.tags.join(", ")}
                    </p>
                )}
            </div>

            {/* Color Variants with Sizes and Stock - NOT for ACCESSORIES */}
            {productData.category !== "ACCESSORIES" && (
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <label className="block text-[#fffffe] font-medium">Color Variants & Stock</label>
                        <button
                            type="button"
                            onClick={handleAddColorVariant}
                            className="bg-[#f9bc60] text-[#001e1d] font-bold py-2 px-4 rounded-lg hover:scale-105"
                        >
                            + Add Color
                        </button>
                    </div>

                {productData.colorVariants.map((variant, colorIndex) => (
                    <div key={colorIndex} className="bg-[#001e1d] p-4 rounded-lg mb-4">
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="text-[#f9bc60] font-bold">
                                {variant.color ? `${variant.color}` : `Color Variant #${colorIndex + 1}`}
                            </h3>
                            <button
                                type="button"
                                onClick={() => handleRemoveColorVariant(colorIndex)}
                                className="bg-[#e16162] text-[#fffffe] px-3 py-1 rounded hover:scale-105"
                            >
                                Remove
                            </button>
                        </div>

                        {/* Color Selection - Single Field with Dropdown */}
                        <div className="mb-4">
                            <label className="block text-[#abd1c6] mb-2 text-sm">Color Name</label>
                            <div className="relative">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={colorInputs[colorIndex] || ""}
                                        onChange={(e) => handleColorInputChange(colorIndex, e.target.value)}
                                        onFocus={(e) => {
                                            if (e.target.value.trim()) {
                                                const filtered = colorSuggestions.filter(color =>
                                                    color.toLowerCase().includes(e.target.value.toLowerCase())
                                                );
                                                setFilteredSuggestions(prev => ({ ...prev, [colorIndex]: filtered }));
                                            }
                                        }}
                                        onBlur={() => {
                                            setTimeout(() => {
                                                setFilteredSuggestions(prev => ({ ...prev, [colorIndex]: [] }));
                                            }, 200);
                                        }}
                                        className="flex-1 p-2 border rounded text-[#001e1d] bg-[#abd1c6] focus:outline-none focus:ring-2 focus:ring-[#f9bc60]"
                                        placeholder="Type color name or click dropdown"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowColorDropdown(prev => ({ ...prev, [colorIndex]: !prev[colorIndex] }))}
                                        className="px-3 py-2 bg-[#f9bc60] text-[#001e1d] rounded hover:bg-[#abd1c6] transition-colors font-bold"
                                    >
                                        ▼
                                    </button>
                                </div>
                                
                                {/* Auto-Suggestions Dropdown */}
                                {filteredSuggestions[colorIndex] && filteredSuggestions[colorIndex].length > 0 && (
                                    <div className="absolute z-20 w-full mt-1 bg-white border border-[#abd1c6] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                        {filteredSuggestions[colorIndex].map((color, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => handleSelectSuggestion(colorIndex, color)}
                                                className="w-full text-left px-4 py-2 hover:bg-[#abd1c6] text-[#001e1d] transition-colors"
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                
                                {/* Manual Dropdown */}
                                {showColorDropdown[colorIndex] && (
                                    <div className="absolute z-20 w-full mt-1 bg-white border border-[#abd1c6] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                        {colorSuggestions.map((color, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => {
                                                    handleSelectSuggestion(colorIndex, color);
                                                    setShowColorDropdown(prev => ({ ...prev, [colorIndex]: false }));
                                                }}
                                                className="w-full text-left px-4 py-2 hover:bg-[#abd1c6] text-[#001e1d] transition-colors"
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Color Variant Images */}
                        <div className="mb-4">
                            <label className="block text-[#abd1c6] mb-2 text-sm">Color Images (Optional)</label>
                            <input 
                                type="file" 
                                accept="image/*"
                                multiple
                                onChange={(e) => handleColorImageUpload(colorIndex, e)}
                                className="w-full p-2 border rounded text-[#abd1c6] bg-[#004643] file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#f9bc60] file:text-[#001e1d] hover:file:bg-[#abd1c6] focus:outline-none cursor-pointer text-sm"
                            />
                            {variant.images && variant.images.length > 0 && (
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                    {variant.images.map((img, imgIdx) => (
                                        <div key={imgIdx} className="relative group">
                                            <img 
                                                src={img} 
                                                alt={`${variant.color} ${imgIdx + 1}`}
                                                className="w-full h-20 object-cover rounded border border-[#abd1c6]"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveColorImage(colorIndex, imgIdx)}
                                                className="absolute top-0 right-0 bg-[#e16162] text-[#fffffe] rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Size & Stock Management */}
                        {getSizeOptions().length > 0 ? (
                            <div className="mb-3">
                                <label className="block text-[#abd1c6] mb-2 text-sm">Available Sizes & Stock</label>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {getSizeOptions().map((size) => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => handleAddSize(colorIndex, size)}
                                            disabled={variant.sizeStock.some(s => s.size === size)}
                                            className={`px-3 py-1 rounded text-sm font-medium ${
                                                variant.sizeStock.some(s => s.size === size)
                                                    ? 'bg-[#abd1c6] text-[#001e1d] cursor-not-allowed opacity-50'
                                                    : 'bg-[#004643] text-[#fffffe] hover:bg-[#f9bc60] hover:text-[#001e1d] cursor-pointer'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>

                                {/* Selected Sizes with Stock Input */}
                                {variant.sizeStock.length > 0 ? (
                                    <div className="space-y-2">
                                        {variant.sizeStock.map((sizeItem, sizeIndex) => (
                                            <div key={sizeIndex} className="flex items-center gap-3 bg-[#004643] p-2 rounded">
                                                <span className="text-[#fffffe] font-medium min-w-[60px]">Size {sizeItem.size}:</span>
                                                <input
                                                    type="number"
                                                    value={sizeItem.stock}
                                                    onChange={(e) => handleStockChange(colorIndex, sizeIndex, e.target.value)}
                                                    min="0"
                                                    className="w-24 p-2 border rounded text-[#001e1d] bg-[#abd1c6] focus:outline-none focus:ring-2 focus:ring-[#f9bc60]"
                                                    placeholder="Stock"
                                                />
                                                <span className="text-[#abd1c6] text-sm">units</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveSize(colorIndex, sizeIndex)}
                                                    className="ml-auto bg-[#e16162] text-[#fffffe] px-2 py-1 rounded text-sm hover:scale-105"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                        <div className="text-[#f9bc60] text-sm font-bold mt-2">
                                            Subtotal for {variant.color || "this color"}: {variant.sizeStock.reduce((sum, s) => sum + s.stock, 0)} units
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-[#abd1c6] text-sm italic">No sizes added yet. Click sizes above to add them.</p>
                                )}
                            </div>
                        ) : (
                            <div className="mb-3">
                                <label className="block text-[#abd1c6] mb-2 text-sm">Stock (No sizes for this product type)</label>
                                <div className="flex items-center gap-3 bg-[#004643] p-2 rounded">
                                    <span className="text-[#fffffe] font-medium">Stock:</span>
                                    <input
                                        type="number"
                                        value={variant.sizeStock[0]?.stock || 0}
                                        onChange={(e) => {
                                            setProductData(prev => {
                                                const updatedVariants = [...prev.colorVariants];
                                                if (updatedVariants[colorIndex].sizeStock.length === 0) {
                                                    updatedVariants[colorIndex].sizeStock = [{ size: "One Size", stock: 0 }];
                                                }
                                                updatedVariants[colorIndex].sizeStock[0].stock = parseInt(e.target.value) || 0;
                                                return { ...prev, colorVariants: updatedVariants };
                                            });
                                        }}
                                        min="0"
                                        className="w-24 p-2 border rounded text-[#001e1d] bg-[#abd1c6] focus:outline-none focus:ring-2 focus:ring-[#f9bc60]"
                                        placeholder="Stock"
                                    />
                                    <span className="text-[#abd1c6] text-sm">units</span>
                                </div>
                                <div className="text-[#f9bc60] text-sm font-bold mt-2">
                                    Subtotal for {variant.color || "this color"}: {variant.sizeStock[0]?.stock || 0} units
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {productData.colorVariants.length === 0 && productData.category !== "ACCESSORIES" && (
                    <p className="text-[#abd1c6] text-center py-4 italic">No color variants added. Click "Add Color" to start.</p>
                )}

                {productData.colorVariants.length > 0 && (
                    <div className="bg-[#f9bc60] text-[#001e1d] p-3 rounded-lg font-bold text-center">
                        Total Stock Across All Variants: {calculateTotalStock()} units
                    </div>
                )}
            </div>
            )}

            {/* Stock for ACCESSORIES (No Color Variants) */}
            {productData.category === "ACCESSORIES" && (
                <div className="mb-6">
                    <label className="block text-[#fffffe] mb-3 font-medium">Stock Management</label>
                    <div className="bg-[#001e1d] p-4 rounded-lg">
                        {getSizeOptions().length > 0 ? (
                            <div className="mb-3">
                                <label className="block text-[#abd1c6] mb-2 text-sm">Available Sizes & Stock</label>
                                <div className="space-y-2">
                                    {getSizeOptions().map((size) => (
                                        <div key={size} className="flex items-center gap-3 bg-[#004643] p-2 rounded">
                                            <span className="text-[#fffffe] font-medium min-w-[60px]">Size {size}:</span>
                                            <input
                                                type="number"
                                                value={productData.accessoryStock?.[size] || 0}
                                                onChange={(e) => {
                                                    setProductData(prev => ({
                                                        ...prev,
                                                        accessoryStock: {
                                                            ...prev.accessoryStock,
                                                            [size]: parseInt(e.target.value) || 0
                                                        }
                                                    }));
                                                }}
                                                min="0"
                                                className="w-24 p-2 border rounded text-[#001e1d] bg-[#abd1c6] focus:outline-none focus:ring-2 focus:ring-[#f9bc60]"
                                                placeholder="Stock"
                                            />
                                            <span className="text-[#abd1c6] text-sm">units</span>
                                        </div>
                                    ))}
                                    <div className="text-[#f9bc60] text-sm font-bold mt-2">
                                        Total Stock: {Object.values(productData.accessoryStock || {}).reduce((sum, val) => sum + val, 0)} units
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mb-3">
                                <label className="block text-[#abd1c6] mb-2 text-sm">Stock (No sizes for this product type)</label>
                                <div className="flex items-center gap-3 bg-[#004643] p-2 rounded">
                                    <span className="text-[#fffffe] font-medium">Stock:</span>
                                    <input
                                        type="number"
                                        value={productData.accessoryStock?.["One Size"] || 0}
                                        onChange={(e) => {
                                            setProductData(prev => ({
                                                ...prev,
                                                accessoryStock: {
                                                    "One Size": parseInt(e.target.value) || 0
                                                }
                                            }));
                                        }}
                                        min="0"
                                        className="w-24 p-2 border rounded text-[#001e1d] bg-[#abd1c6] focus:outline-none focus:ring-2 focus:ring-[#f9bc60]"
                                        placeholder="Stock"
                                    />
                                    <span className="text-[#abd1c6] text-sm">units</span>
                                </div>
                                <div className="text-[#f9bc60] text-sm font-bold mt-2">
                                    Total Stock: {productData.accessoryStock?.["One Size"] || 0} units
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Boots fields only */}
            {productData.category === "BOOTS" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-[#fffffe] mb-2 font-medium">Types of Outsole</label>
                        <select 
                            name="outsole"
                            value={productData.outsole} 
                            onChange={handleChange}
                            className="w-full p-3 border rounded text-[#001e1d] bg-[#abd1c6] focus:outline-none focus:ring-2 focus:ring-[#f9bc60]"
                        >
                            <option value="">Select Outsole Type</option>
                            {outsoleOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-[#fffffe] mb-2 font-medium">Material</label>
                        <select 
                            name="material"
                            value={productData.material} 
                            onChange={handleChange}
                            className="w-full p-3 border rounded text-[#001e1d] bg-[#abd1c6] focus:outline-none focus:ring-2 focus:ring-[#f9bc60]"
                        >
                            <option value="">Select Material</option>
                            {materialOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-[#fffffe] mb-2 font-medium">Player</label>
                        <select 
                            name="player"
                            value={productData.player} 
                            onChange={handleChange}
                            className="w-full p-3 border rounded text-[#001e1d] bg-[#abd1c6] focus:outline-none focus:ring-2 focus:ring-[#f9bc60]"
                        >
                            <option value="">Select Player</option>
                            {playerOptions.map((player) => (
                                <option key={player} value={player}>{player}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Default Product Images */}
            <div className="mb-8">
                <label className="block text-[#fffffe] mb-2 font-medium">Default Product Images</label>
                <p className="text-[#abd1c6] text-sm mb-2">These images will be used as fallback if color variants don't have specific images</p>
                <input 
                    type="file" 
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="w-full p-2 border rounded text-[#fffffe] bg-[#004643] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#f9bc60] file:text-[#001e1d] hover:file:bg-[#abd1c6] focus:outline-none cursor-pointer"
                />
                <p className="text-sm mt-2 text-[#abd1c6]">{productData.images.length} image(s) uploaded</p>
            </div>

            {/* Default Image Previews */}
            {imagePreviews.length > 0 && (
                <div className="mb-8">
                    <label className="block text-[#fffffe] mb-3 font-medium">Default Product Images ({imagePreviews.length})</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                                <img 
                                    src={preview} 
                                    alt={`Default ${index + 1}`}
                                    className="w-full h-32 object-cover rounded border-2 border-[#abd1c6]"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-0 right-0 bg-[#e16162] text-[#fffffe] rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-bold text-sm"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex space-x-4">
                <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-[#f9bc60] text-[#001e1d] font-bold py-2 px-6 rounded-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Saving...' : (isEditMode ? 'Update Product' : 'Create Product')}
                </button>
                <button 
                    type="button" 
                    onClick={() => navigate("/admin/products")}
                    className="bg-[#e16162] text-[#fffffe] font-bold py-2 px-6 rounded-lg hover:scale-105"
                >
                    Cancel
                </button>
            </div>
        </form>
    </div>
  )
}

export default EditProductPage