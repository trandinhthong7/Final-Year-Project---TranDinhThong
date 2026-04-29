import { useState, useRef, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMostPopularProducts } from '../../redux/slices/productsSlice';
import { Link } from 'react-router-dom';

const MostPopular = () => {
    const dispatch = useDispatch();
    const { mostPopularProducts, loading, error } = useSelector(state => state.products);
    
    // Fetch most popular products on mount
    useEffect(() => {
        dispatch(fetchMostPopularProducts()); // Backend returns 3-5 items per category
    }, [dispatch]);
    
    // Use products from Redux or empty array
    const products = mostPopularProducts || [];
    
    // State declarations
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState('BOOTS');
    const scrollContainerRef = useRef(null);
    const velocityRef = useRef(0);
    const lastMoveRef = useRef(0);
    const animationRef = useRef(null);
    const scrollTimeoutRef = useRef(null);
    
    const categories = ['BOOTS', 'GLOVES', 'ACCESSORIES'];
    
    // Function to detect which product is at the leftmost position
    const updateCategoryBasedOnScroll = useCallback(() => {
        if (!scrollContainerRef.current) return;
        
        const container = scrollContainerRef.current;
        const containerRect = container.getBoundingClientRect();
        const containerLeft = containerRect.left;
        
        // Find the first visible product
        let closestProduct = null;
        let minDistance = Infinity;
        
        products.forEach((product) => {
            const element = container.querySelector(`[data-product-id="${product.id}"]`);
            if (element) {
                const elementRect = element.getBoundingClientRect();
                const distance = Math.abs(elementRect.left - containerLeft);
                
                // Find the product closest to the left edge
                if (distance < minDistance) {
                    minDistance = distance;
                    closestProduct = product;
                }
            }
        });
        
        // Update category if the closest product is different from current category
        if (closestProduct && closestProduct.category !== selectedCategory) {
            setSelectedCategory(closestProduct.category);
        }
    }, [products, selectedCategory]);
    
    // Add scroll event listener to detect category changes
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;
        
        const handleScroll = () => {
            // Clear existing timeout
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
            
            // Set new timeout to update category after scrolling stops
            scrollTimeoutRef.current = setTimeout(() => {
                updateCategoryBasedOnScroll();
            }, 150); // Wait 150ms after scroll stops
        };
        
        container.addEventListener('scroll', handleScroll);
        
        return () => {
            container.removeEventListener('scroll', handleScroll);
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, [updateCategoryBasedOnScroll]);
    
    // Drag to scroll functionality with momentum
    const handleMouseDown = useCallback((e) => {
        if (scrollContainerRef.current) {
            setIsDragging(true);
            setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
            setScrollLeft(scrollContainerRef.current.scrollLeft);
            velocityRef.current = 0;
            lastMoveRef.current = e.pageX;
            
            // Cancel any ongoing animation
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            
            // Disable smooth scrolling during drag
            scrollContainerRef.current.style.scrollBehavior = 'auto';
        }
    }, []);
    
    const handleMouseMove = useCallback((e) => {
        if (!isDragging || !scrollContainerRef.current) return;
        
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 1.5; // Multiply by 1.5 for more responsive dragging
        
        // Calculate velocity for momentum
        velocityRef.current = e.pageX - lastMoveRef.current;
        lastMoveRef.current = e.pageX;
        
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }, [isDragging, startX, scrollLeft]);
    
    const applyMomentum = useCallback(() => {
        if (!scrollContainerRef.current) return;
        
        const friction = 0.95; // Friction factor
        velocityRef.current *= friction;
        
        if (Math.abs(velocityRef.current) > 0.5) {
            scrollContainerRef.current.scrollLeft -= velocityRef.current;
            animationRef.current = requestAnimationFrame(applyMomentum);
        } else {
            // Re-enable smooth scrolling after momentum ends
            if (scrollContainerRef.current) {
                scrollContainerRef.current.style.scrollBehavior = 'smooth';
            }
        }
    }, []);
    
    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        
        // Apply momentum scrolling
        if (Math.abs(velocityRef.current) > 1) {
            applyMomentum();
        } else if (scrollContainerRef.current) {
            scrollContainerRef.current.style.scrollBehavior = 'smooth';
        }
    }, [applyMomentum]);
    
    const handleMouseLeave = useCallback(() => {
        if (isDragging) {
            setIsDragging(false);
            if (scrollContainerRef.current) {
                scrollContainerRef.current.style.scrollBehavior = 'smooth';
            }
        }
    }, [isDragging]);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        // Find the first product of the selected category and scroll to it
        const firstProduct = products.find(product => product.category === category);
        if (firstProduct && scrollContainerRef.current) {
            setTimeout(() => {
                const firstElement = scrollContainerRef.current.querySelector(`[data-product-id="${firstProduct._id}"]`);
                if (firstElement) {
                    firstElement.scrollIntoView({
                        behavior: 'smooth',
                        inline: 'start'
                    });
                }
            }, 0);
        }
    };

    // Helper function to get tag style
    const getTagStyle = (tag) => {
        const tagLower = tag.toLowerCase();
        if (tagLower === 'deal') {
            return 'border-[#f9bc60] text-[#f9bc60]';
        } else if (tagLower === 'new') {
            return 'border-red-500 text-red-500';
        }
        return 'border-[#abd1c6] text-[#abd1c6]';
    };

    // Check if product has deal tag
    const hasDealTag = (tags) => {
        if (!tags || !Array.isArray(tags)) return false;
        return tags.some(tag => tag.toLowerCase() === 'deal');
    };

    // Get first image from product
    const getProductImage = (product) => {
        if (product.images && product.images.length > 0) {
            return product.images[0];
        }
        return '/placeholder-product.jpg'; // Fallback image
    };

    // Get available sizes for product
    const getProductSizes = (product) => {
        if (product.category === 'ACCESSORIES' && product.accessoryStock) {
            return Object.keys(product.accessoryStock);
        } else if (product.colorVariants && product.colorVariants.length > 0) {
            // Get unique sizes from all color variants
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
        return [];
    };

    if (loading) {
        return (
            <section className="py-10">
                <div className="container mx-auto px-4">
                    <h2 className='text-center text-3xl text-[#001e1d] font-bold mb-8'>MOST POPULAR</h2>
                    <div className="flex justify-center items-center h-64">
                        <div className="text-[#004643] text-xl">Loading most popular products...</div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-10">
                <div className="container mx-auto px-4">
                    <h2 className='text-center text-3xl text-[#001e1d] font-bold mb-8'>MOST POPULAR</h2>
                    <div className="flex justify-center items-center h-64">
                        <div className="text-red-500 text-xl">Error: {error}</div>
                    </div>
                </div>
            </section>
        );
    }

  return (
    <section className="py-10">
        <div className="container mx-auto px-4 relative">
            <h2 className='text-center text-3xl text-[#001e1d] font-bold'>MOST POPULAR</h2>
            
            {/* Categories navigation */}
            <div>
                <nav className="sticky top-0 z-10 backdrop-blur-md flex justify-center space-x-6 py-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleCategoryClick(category)}
                            className={`
                                pb-1
                                font-medium
                                text-medium
                                md:text-lg
                                flex-shrink-0 
                                transition-colors
                                duration-200
                                hover:text-[#00948d]
                                ${
                                    selectedCategory === category
                                    ? 'border-b-2 border-[#001e1d] text-[#001e1d]'
                                    : 'border-b-2 border-transparent text-[#00948d]'
                                }
                            `}
                        >
                            {category}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Horizontal scrollable product list */}
            <div 
                ref={scrollContainerRef}
                className={`flex gap-4 overflow-x-scroll pb-10 hide-scrollbar select-none ${
                        isDragging ? "cursor-grabbing" : "cursor-grab"
                    }`}
                style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}>
                {products.map((product) => {
                    const productImage = getProductImage(product);
                    const productSizes = getProductSizes(product);
                    const productHasDeal = hasDealTag(product.tags);
                    
                    return (
                    <Link 
                        to={`/product/${product._id}`} 
                        key={product._id} 
                        data-product-id={product._id}
                        className="w-[200px] min-w-[200px] md:w-[280px] md:min-w-[280px] lg:min-w-[320px] h-[400px] md:h-[500px] rounded-lg shadow-sm overflow-hidden group relative bg-white block flex-shrink-0"
                    >
                        {/*Image */}
                        <div className="absolute top-0 left-0 right-0 h-[300px] md:h-[400px]">
                            <img 
                                src={productImage} 
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                draggable="false"
                            />
                        </div>

                        {/*Product Info*/}
                        <div className="absolute bottom-0 left-0 right-0 bg-[#004643] p-3 md:p-4 flex flex-col gap-1 md:gap-2 transition-all duration-300 ease-out group-hover:bg-[#004643]/90">
                            {/* Always visible header */}
                            <div>
                                {/* Tags */}
                                <div className="flex gap-1 mb-1 flex-wrap min-h-[24px]">
                                    {product.tags && product.tags.map((tag, index) => (
                                        <span 
                                            key={index}
                                            className={`
                                                text-[10px] font-black px-2 py-0.5 uppercase rounded-full border-2 bg-transparent
                                                ${getTagStyle(tag)}
                                            `}
                                        >
                                            {tag.toUpperCase()}
                                        </span>
                                    ))}
                                </div>
                            
                                {/* Name */}
                                <h4 className="font-medium text-[#fffffe] text-sm leading-tight line-clamp-1 group-hover:line-clamp-none mb-1">
                                    {product.name.toUpperCase()}
                                </h4>
                                
                                {/* Price section */}
                                <div>
                                    {productHasDeal && product.originalPrice ? (
                                        <div className="flex items-baseline gap-2">
                                            <p className="font-bold  text-[#f9bc60]">${product.price}</p>
                                            <p className="font-light text-[#abd1c6] line-through text-xs">${product.originalPrice}</p>
                                            <span className="text-xs font-bold text-[#004643] bg-[#f9bc60] px-1.5 py-0.5 rounded">
                                                -{product.discount}%
                                            </span>
                                        </div>
                                    ) : (
                                        <p className="font-bold text-[#fffffe]">${product.price}</p>
                                    )}
                                </div>
                                
                                {/* Sales count badge - only show if there are sales */}
                                {product.totalSold > 0 && (
                                    <div className="mt-1">
                                        <span className="text-xs text-[#abd1c6] font-medium">
                                            🔥 {product.totalSold} sold
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Popup: Color variants & Sizes*/}
                            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out">
                                <div className="overflow-hidden">
                                    <div className="pt-2 mt-1 border-t border-gray-100 flex flex-col gap-2">
                                        {/* Color variant images */}
                                        {product.colorVariants && product.colorVariants.length > 1 && (
                                            <div className="flex gap-2">
                                                {product.colorVariants.slice(0, 4).map((variant, index) => (
                                                    <div 
                                                        key={index}
                                                        className="w-8 h-8 rounded-md overflow-hidden border border-gray-200 hover:border-[#f9bc60] transition-colors cursor-pointer"
                                                    >
                                                        <img 
                                                            src={variant.images && variant.images[0] ? variant.images[0] : productImage} 
                                                            alt={`${variant.color || 'Color'} ${index + 1}`}
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
                                                        className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded hover:bg-[#f9bc60] hover:text-[#001e1d] transition-colors cursor-pointer"
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
        </div>
    </section>
  )
}

export default MostPopular