import { Link } from "react-router-dom";
import { useState, useRef, useCallback } from "react";

const ProductGrid = ({ products = [] }) => {
  // State for drag functionality
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  // Refs for scroll container and momentum
  const scrollContainerRef = useRef(null);
  const velocityRef = useRef(0);
  const lastMoveRef = useRef(0);
  const animationRef = useRef(null);

  // Helper function to get tag style
  const getTagStyle = (tag) => {
    switch(tag) {
      case 'deal':
        return 'border-[#f9bc60] text-[#f9bc60]';
      case 'new':
        return 'border-red-500 text-red-500';
      case 'children':
        return 'border-[#abd1c6] text-[#abd1c6]';
      default:
        return 'border-[#abd1c6] text-[#abd1c6]';
    }
  };

  // Check if product has deal tag
  const hasDealTag = (tags) => tags?.includes('deal');

  // Drag handlers
  const handleMouseDown = useCallback((e) => {
    if (scrollContainerRef.current) {
      setIsDragging(true);
      setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
      setScrollLeft(scrollContainerRef.current.scrollLeft);
      velocityRef.current = 0;
      lastMoveRef.current = e.pageX;
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      scrollContainerRef.current.style.scrollBehavior = 'auto';
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !scrollContainerRef.current) return;
    
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    
    velocityRef.current = e.pageX - lastMoveRef.current;
    lastMoveRef.current = e.pageX;
    
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const applyMomentum = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    const friction = 0.95;
    velocityRef.current *= friction;
    
    if (Math.abs(velocityRef.current) > 0.5) {
      scrollContainerRef.current.scrollLeft -= velocityRef.current;
      animationRef.current = requestAnimationFrame(applyMomentum);
    } else {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.style.scrollBehavior = 'smooth';
      }
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    
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

  return (
    <div 
      ref={scrollContainerRef}
      className={`flex gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible select-none ${
        isDragging ? "cursor-grabbing" : "cursor-grab sm:cursor-default"
      }`}
      style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Product Item */}
      {products.map((product, index) => (
        <Link 
          key={product.id || index} 
          to={`/product/${product.id}`} 
          className="flex-shrink-0 w-[280px] sm:w-auto rounded-lg shadow-sm flex flex-col overflow-hidden group relative"
        >
          {/* Image Container */}
          <div className="relative aspect-square">
            <img
              src={product.image?.[0]?.url || product.images || null}
              alt={product.name || "Product"}
              className="w-full h-full object-cover rounded-lg"
              draggable="false"
            />
            
            {/* Overlay with product info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#001e1d] via-[#001e1d]/90 to-transparent rounded-b-lg">
              {/* Color variants & Sizes - hidden by default, show on hover */}
              <div className="px-3 pt-8 pb-2 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                {/* Color variant images */}
                {product.colorVariants && product.colorVariants.length > 1 && (
                  <div className="flex gap-2 mb-2">
                    {product.colorVariants.map((variant, idx) => (
                      <div 
                        key={idx}
                        className="w-10 h-10 rounded-md overflow-hidden border-2 border-white/50 hover:border-[#f9bc60] transition-colors cursor-pointer"
                      >
                        <img 
                          src={variant?.url || variant} 
                          alt={`Color ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Sizes */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {product.sizes.map((size, idx) => (
                      <span 
                        key={idx}
                        className="text-[10px] px-2 py-1 bg-[#004643] text-[#abd1c6] rounded hover:bg-[#f9bc60] hover:text-[#001e1d] transition-colors cursor-pointer"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Name, Price, Tags - always visible, moves up on hover */}
              <div className="px-3 pb-3 transform group-hover:-translate-y-2 transition-transform duration-300">
                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="flex gap-1 mb-2 flex-wrap">
                    {product.tags.map((tag, idx) => (
                      <span 
                        key={idx}
                        className={`
                          text-[10px] font-black px-2 py-0.5 uppercase rounded-full border-2 bg-transparent
                          ${getTagStyle(tag)}
                        `}
                      >
                        {tag.toUpperCase()}
                      </span>
                    ))}
                  </div>
                )}
              
                {/* Name with ellipsis */}
                <h4 className="font-medium text-[#fffffe] text-sm leading-tight line-clamp-2 overflow-hidden">
                  {product.name?.toUpperCase() || "PRODUCT"}
                </h4>
                
                {/* Price section */}
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  {hasDealTag(product.tags) && product.originalPrice ? (
                    <>
                      <p className="font-bold text-[#f9bc60]">${product.price}</p>
                      <p className="font-light text-[#abd1c6]/60 line-through text-sm">${product.originalPrice}</p>
                      {product.discount && (
                        <span className="text-xs font-bold text-[#004643] bg-[#f9bc60] px-1.5 py-0.5 rounded">
                          -{product.discount}%
                        </span>
                      )}
                    </>
                  ) : (
                    <p className="font-light text-[#abd1c6]">${product.price}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default ProductGrid