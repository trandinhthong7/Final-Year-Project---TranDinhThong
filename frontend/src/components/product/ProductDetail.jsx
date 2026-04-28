import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import ProductGrid from "./ProductGrid";
import { fetchProductById, fetchRelatedProducts } from "../../redux/slices/productsSlice";
import { addToCart } from "../../redux/slices/cartSlice";

const getTagStyle = (tag) => {
  const tagLower = tag.toLowerCase();
  switch(tagLower) {
    case 'deal':
      return 'border-[#f9bc60] text-[#f9bc60]';
    case 'new':
      return 'border-red-500 text-red-500';
    case 'best seller':
      return 'border-green-400 text-green-400';
    default:
      return 'border-[#abd1c6] text-[#abd1c6]';
  }
};

const ProductDetail = ({ productId = null, showRelatedProducts = true }) => {
  const { id: urlId } = useParams();
  const id = productId || urlId; // Use prop ID or URL ID
  
  const dispatch = useDispatch();
  const { currentProduct, relatedProducts, loading, error } = useSelector(state => state.products);
  
  const [mainImage, setMainImage] = useState("");
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [availableStock, setAvailableStock] = useState(0);

  // Fetch product details and related products
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      if (showRelatedProducts) {
        dispatch(fetchRelatedProducts(id));
      }
    }
  }, [dispatch, id, showRelatedProducts]);

  // Set initial color and image when product loads
  useEffect(() => {
    if (currentProduct?.colorVariants?.length > 0) {
      const firstVariant = currentProduct.colorVariants[0];
      if (firstVariant.images?.length > 0) {
        setMainImage(firstVariant.images[0]);
      }
    } else if (currentProduct?.images?.length > 0) {
      setMainImage(currentProduct.images[0]);
    }
  }, [currentProduct]);

  // Update available stock when size is selected
  useEffect(() => {
    if (selectedSize && currentProduct?.colorVariants?.[selectedColorIndex]) {
      const sizeItem = currentProduct.colorVariants[selectedColorIndex].sizeStock.find(
        s => s.size === selectedSize
      );
      setAvailableStock(sizeItem?.stock || 0);
      
      // Reset quantity if it exceeds available stock
      if (quantity > (sizeItem?.stock || 0)) {
        setQuantity(1);
      }
    } else if (selectedSize && currentProduct?.accessoryStock) {
      // For accessories
      setAvailableStock(currentProduct.accessoryStock[selectedSize] || 0);
      if (quantity > (currentProduct.accessoryStock[selectedSize] || 0)) {
        setQuantity(1);
      }
    }
  }, [selectedSize, selectedColorIndex, quantity, currentProduct]);

  const handleColorChange = (colorIndex) => {
    setSelectedColorIndex(colorIndex);
    setSelectedSize(""); // Reset size when color changes
    setQuantity(1);
    
    // Update main image to first image of selected color
    const variant = currentProduct?.colorVariants?.[colorIndex];
    if (variant?.images?.length > 0) {
      setMainImage(variant.images[0]);
    }
  };

  const getColorHex = (colorName, hexCode) => {
    // If hexCode is provided and valid, use it
    if (hexCode && hexCode.startsWith('#')) {
      return hexCode;
    }
    
    // Color name to hex mapping
    const colorMap = {
      'black': '#000000',
      'white': '#FFFFFF',
      'red': '#FF0000',
      'blue': '#0000FF',
      'green': '#00FF00',
      'yellow': '#FFFF00',
      'orange': '#FFA500',
      'purple': '#800080',
      'pink': '#FFC0CB',
      'gray': '#808080',
      'grey': '#808080',
      'brown': '#A52A2A',
      'navy': '#000080',
      'teal': '#008080',
      'lime': '#00FF00',
      'maroon': '#800000',
      'olive': '#808000',
      'cyan': '#00FFFF',
      'magenta': '#FF00FF',
      'silver': '#C0C0C0',
      'gold': '#FFD700',
      'beige': '#F5F5DC',
      'turquoise': '#40E0D0',
      'violet': '#EE82EE',
      'indigo': '#4B0082'
    };
    
    // Try to match the color name (case insensitive)
    const normalizedColor = colorName?.toLowerCase().trim();
    return colorMap[normalizedColor] || '#CCCCCC'; // Default to light gray if not found
  };

  const getCurrentVariant = () => currentProduct?.colorVariants?.[selectedColorIndex];
  
  const getAvailableSizes = () => {
    if (currentProduct?.category === 'ACCESSORIES' && currentProduct?.accessoryStock) {
      // For accessories, return sizes from accessoryStock
      return Object.entries(currentProduct.accessoryStock).map(([size, stock]) => ({
        size,
        stock
      }));
    }
    return getCurrentVariant()?.sizeStock || [];
  };

  const getAllImages = () => {
    const variant = getCurrentVariant();
    if (variant?.images?.length > 0) {
      return variant.images;
    }
    return currentProduct?.images || [];
  };

  // Check if button should be disabled
  const isButtonDisabled = !selectedSize || availableStock === 0 || isAddingToCart;

  const handleQuantityChange = (action) => {
    if (action === "plus" && quantity < availableStock) {
      setQuantity((prev) => prev + 1);
    }
    if (action === "minus" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error("Please select a size before adding to cart.", {
        duration: 1000,
      });
      return;
    }
    
    if (availableStock === 0) {
      toast.error("This size is out of stock.", {
        duration: 1000,
      });
      return;
    }
    
    setIsAddingToCart(true);
    
    // Get user ID or guest ID
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
    const userId = userInfo?._id;
    let guestId = localStorage.getItem("guestId");
    
    if (!userId && !guestId) {
      guestId = "guest_" + new Date().getTime();
      localStorage.setItem("guestId", guestId);
    }
    
    // Prepare cart item data
    const cartData = {
      productId: currentProduct._id,
      quantity,
      size: selectedSize,
      color: getCurrentVariant()?.color || "",
      userId,
      guestId: !userId ? guestId : undefined
    };
    
    try {
      // Dispatch Redux action to add to cart
      await dispatch(addToCart(cartData)).unwrap();
      toast.success(`Added ${quantity} item(s) to cart!`, { 
        duration: 1000,
      });
      setIsAddingToCart(false);
      // Reset selections
      setQuantity(1);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error || "Failed to add to cart", {
        duration: 1000,
      });
      setIsAddingToCart(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-4">
        <div className="max-w-6xl mx-auto bg-[#004643] p-8 rounded-lg">
          <div className="flex justify-center items-center h-96">
            <div className="text-[#fffffe] text-xl">Loading product...</div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4">
        <div className="max-w-6xl mx-auto bg-[#004643] p-8 rounded-lg">
          <div className="flex justify-center items-center h-96">
            <div className="text-red-500 text-xl">Error: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  // No product found
  if (!currentProduct) {
    return (
      <div className="p-4">
        <div className="max-w-6xl mx-auto bg-[#004643] p-8 rounded-lg">
          <div className="flex justify-center items-center h-96">
            <div className="text-[#fffffe] text-xl">Product not found</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto bg-[#004643] p-8 rounded-lg">
        <div className="flex flex-col md:flex-row">
          {/* left thumbnail */}
          <div className="hidden md:flex flex-col space-y-4 mr-6">
            {getAllImages().map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`${getCurrentVariant()?.color || currentProduct.name} view ${index + 1}`}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === imageUrl ? 'border-4 border-[#f9bc60]' : 'border-2 border-[#abd1c6]'}`}
                onClick={() => setMainImage(imageUrl)}
              />
            ))}
          </div>
          
          {/* main image */}
          <div className="md:w-1/2">
            <div className="mb-4">
              <img
                src={mainImage || '/placeholder-product.jpg'}
                alt={currentProduct.name}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          </div>
          
          {/* mobile thumbnail */}
          <div className="md:hidden flex overflow-x-scroll space-x-4 mb-4">
            {getAllImages().map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`${getCurrentVariant()?.color || currentProduct.name} view ${index + 1}`}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === imageUrl ? 'border-4 border-[#abd1c6]' : 'border-2 border-[#abd1c6]'}`}
                onClick={() => setMainImage(imageUrl)}
              />
            ))}
          </div>

          {/* right side */}
          <div className="md:w-1/2 md:ml-10">
            <h1 className="text-2xl text-[#fffffe] font-bold">
              {currentProduct.name}
            </h1>
            
            {/* Tags */}
            <div className="flex gap-1 flex-wrap my-2">
              {currentProduct.tags && currentProduct.tags.map((tag, index) => (
                <span 
                  key={index}
                  className={`text-[10px] font-bold px-2 py-0.5 uppercase rounded-full border ${getTagStyle(tag)}`}
                >
                  {tag.toUpperCase()}
                </span>
              ))}
            </div>
            
            {/* Price */}
            <div className="flex items-center gap-3 mb-2">
              <p className="text-2xl font-bold text-[#f9bc60]">
                ${currentProduct.price}
              </p>
              {currentProduct.originalPrice && currentProduct.discount > 0 && (
                <>
                  <p className="text-lg text-[#abd1c6] line-through">
                    ${currentProduct.originalPrice}
                  </p>
                  <span className="text-xs font-bold text-[#004643] bg-[#f9bc60] px-2 py-1 rounded">
                    -{currentProduct.discount}%
                  </span>
                </>
              )}
            </div>
            
            <p className="mb-4 text-[#abd1c6]">{currentProduct.description}</p>
            
            {/* Color Selection - Only for products with color variants */}
            {currentProduct.colorVariants && currentProduct.colorVariants.length > 0 && (
              <div className="mb-4">
                <p className="text-[#fffffe] font-semibold mb-2">
                  Color: {getCurrentVariant()?.color}
                </p>
                <div className="flex gap-3 mt-2">
                  {currentProduct.colorVariants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => handleColorChange(index)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColorIndex === index 
                          ? 'border-[#f9bc60] ring-2 ring-[#f9bc60] ring-offset-2 scale-110' 
                          : 'border-[#abd1c6] hover:border-[#f9bc60] hover:scale-105'
                      }`}
                      style={{ backgroundColor: getColorHex(variant.color, variant.hexCode) }}
                      title={variant.color}
                      aria-label={`Select ${variant.color} color`}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Size Selection */}
            <div className="text-[#abd1c6] mb-4">
              <p className="text-[#fffffe] font-semibold mb-2">Size:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {getAvailableSizes().map((sizeItem) => (
                  <button 
                    key={sizeItem.size}
                    className={`px-3 py-2 rounded border transition-all ${
                      selectedSize === sizeItem.size 
                        ? "bg-[#f9bc60] text-[#001e1d] border-[#f9bc60] font-bold" 
                        : sizeItem.stock === 0
                        ? "bg-[#001e1d] text-[#abd1c6] border-[#abd1c6] opacity-50 cursor-not-allowed line-through"
                        : "bg-[#004643] text-[#fffffe] border-[#abd1c6] hover:border-[#f9bc60]"
                    }`}
                    onClick={() => sizeItem.stock > 0 && setSelectedSize(sizeItem.size)}
                    disabled={sizeItem.stock === 0}
                  >
                    {sizeItem.size}
                    {sizeItem.stock > 0 && sizeItem.stock <= 5 && (
                      <span className="text-[10px] ml-1">({sizeItem.stock})</span>
                    )}
                  </button>
                ))}
              </div>
              {selectedSize && (
                <p className="text-sm mt-2 text-[#f9bc60]">
                  {availableStock > 0 
                    ? `${availableStock} unit${availableStock > 1 ? 's' : ''} available`
                    : 'Out of stock'}
                </p>
              )}
            </div>
            
            {/* Quantity */}
            <div className="mb-6">
              <p className="text-[#fffffe] font-semibold mb-2">Quantity:</p>
              <div className="flex items-center space-x-4 mt-2">
                <button 
                  onClick={() => handleQuantityChange("minus")} 
                  className="bg-[#abd1c6] px-3 py-1 rounded text-[#001e1d] font-bold hover:bg-[#f9bc60] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="text-lg text-[#fffffe] font-semibold min-w-[30px] text-center">
                  {quantity}
                </span>
                <button 
                  onClick={() => handleQuantityChange("plus")} 
                  className="bg-[#abd1c6] px-3 py-1 rounded text-[#001e1d] font-bold hover:bg-[#f9bc60] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={quantity >= availableStock}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart} 
              disabled={isButtonDisabled}
              className={`bg-[#abd1c6] text-[#001e1d] py-3 px-6 rounded w-full mb-4 font-bold transition-all ${
                isButtonDisabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-[#f9bc60] hover:scale-105'
              }`}
            >
              {isAddingToCart 
                ? "Adding..." 
                : availableStock === 0 && selectedSize
                ? "OUT OF STOCK"
                : "ADD TO CART"}
            </button>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      {showRelatedProducts && relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-20">
          <h2 className="text-center text-3xl text-[#001e1d] font-bold mb-4">
            YOU MAY ALSO LIKE
          </h2>
          <ProductGrid products={relatedProducts} horizontal={true}/>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
