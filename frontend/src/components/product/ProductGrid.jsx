import { Link } from "react-router-dom";

const ProductGrid = ({ products = [] }) => {
  const hasDealTag = (tags) => {
    return Array.isArray(tags) && tags.some(tag => tag.toLowerCase() === 'deal');
  };
  
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

  // Helper to get product image
  const getProductImage = (product) => {
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }
    if (product.image && product.image[0]?.url) {
      return product.image[0].url;
    }
    return '/placeholder-product.jpg';
  };

  // Helper to get product sizes
  const getProductSizes = (product) => {
    if (product.sizes && Array.isArray(product.sizes)) {
      return product.sizes;
    }
    
    // For boots/gloves with colorVariants
    if (product.colorVariants && product.colorVariants.length > 0) {
      const sizes = new Set();
      product.colorVariants.forEach(variant => {
        if (variant.sizeStock) {
          variant.sizeStock.forEach(sizeItem => {
            sizes.add(sizeItem.size);
          });
        }
      });
      return Array.from(sizes);
    }
    
    // For accessories
    if (product.accessoryStock) {
      return Object.keys(product.accessoryStock);
    }
    
    return [];
  };

  // Helper to get color variant images
  const getColorVariants = (product) => {
    if (product.colorVariants && Array.isArray(product.colorVariants)) {
      return product.colorVariants.map(variant => {
        if (variant.images && variant.images.length > 0) {
          return variant.images[0];
        }
        return getProductImage(product);
      });
    }
    return [];
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-10">
      {products.map((product, index) => {
        const productId = product._id || product.id;
        const productImage = getProductImage(product);
        const productSizes = getProductSizes(product);
        const colorVariants = getColorVariants(product);
        
        return (
        <Link 
          key={productId || index} 
          to={`/product/${productId}`} 
          className="block group relative bg-white rounded-lg shadow-sm overflow-hidden h-[500px]"
        >
          {/* Image - Fixed Height at Top */}
          <div className="absolute top-0 left-0 right-0 h-[400px]">
              <img 
                src={productImage} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
          </div>
            
          {/* Details Section - Anchored to Bottom */}
          <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-1.5 bg-[#004643] p-4 text-[#fffffe] transition-all duration-300 group-hover:bg-[#004643]/90 ">
                {/* Tags */}
                <div className="flex gap-1 flex-wrap">
                    {product.tags && product.tags.map((tag, index) => (
                        <span 
                            key={index}
                            className={`
                                text-[10px] font-bold px-2 py-0.5 uppercase rounded-full border
                                ${getTagStyle(tag)}
                            `}
                        >
                            {tag.toUpperCase()}
                        </span>
                    ))}
                </div>
            
                {/* Name */}
                <h4 className="font-semibold text-[#fffffe] text-sm leading-tight line-clamp-1 group-hover:line-clamp-2 transition-all duration-300">
                    {product.name.toUpperCase()}
                </h4>
                
                {/* Price section */}
                <div className="flex items-center gap-2">
                    {hasDealTag(product.tags) && product.originalPrice ? (
                        <div className="flex items-center gap-2">
                            <p className="font-bold text-[#f9bc60]">${product.price}</p>
                            <p className="font-light text-[#abd1c6] line-through text-xs">${product.originalPrice}</p>
                        </div>
                    ) : (
                        <p className="font-medium text-[#fffffe]">${product.price}</p>
                    )}
                </div>

                {/* Popup: Color variants & Sizes - Expandable Upwards (due to bottom anchor) */}
                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out ">
                    <div className="overflow-hidden">
                        <div className="pt-3 mt-2 border-t border-[#fffffe] flex flex-col gap-2">
                                  {/* Color variant images */}
                                  {colorVariants.length > 1 && (
                                      <div className="flex gap-2">
                                          {colorVariants.slice(0, 4).map((variantImage, index) => (
                                              <div 
                                                  key={index}
                                                  className="w-8 h-8 rounded-full overflow-hidden border border-[#fffffe] hover:border-[#f9bc60] transition-colors cursor-pointer"
                                              >
                                                  <img 
                                                      src={variantImage} 
                                                      alt={`Color ${index + 1}`}
                                                      className="w-full h-full object-cover"
                                                  />
                                              </div>
                                          ))}
                                      </div>
                                  )}
                                  
                                  {/* Sizes */}
                                  {productSizes.length > 0 && (
                                      <div className="flex flex-wrap gap-1">
                                          {productSizes.slice(0, 8).map((size, index) => (
                                              <span 
                                                  key={index}
                                                  className="text-[10px] px-2 py-1 bg-[#fffffe] text-[#004643] rounded hover:bg-[#f9bc60] hover:text-[#004643] transition-colors cursor-pointer"
                                              >
                                                  {size}
                                              </span>
                                          ))}
                                      </div>
                                  )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
        );
      })}
    </div>
  );
};

export default ProductGrid;