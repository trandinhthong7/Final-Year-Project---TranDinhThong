import { useState, useRef, useCallback, useEffect } from 'react';
import adidasF50 from '../../assets/Most Popular/boots/bota-adidas-f50-elite-ag-purple.jpg';
import adidasF50ll from '../../assets/Most Popular/boots/bota-adidas-f50-elite-ll-fg-purp.jpg';
import adidasYamal from '../../assets/Most Popular/boots/bota-adidas-f50-elite-ll-fglamine-yamal-unity-purple-white-lucid-lemon-0.webp';
import nikeMercurial from '../../assets/Most Popular/boots/bota-nike-air-zoom-mercurial-vap.jpg';
import nikePhantom from '../../assets/Most Popular/boots/bota-nike-phantom-6-low-pro-fg-a.jpg';
import puma from '../../assets/Most Popular/boots/bota-puma-zukunftige-8-pro-fg-ag.jpg';
import adidasgloves from '../../assets/Most Popular/gloves/guantes-adidas-copa-match-fingersave-black-0.webp';
import adidaspredator from '../../assets/Most Popular/gloves/guantes-adidas-predator-competition-lucid-lemon-white-black-0.webp';
import ulsports from '../../assets/Most Popular/gloves/guantes-uhlsport-fangmaschine-cybertec-starter-soft-nino-multicolor-0.webp';
import { Link } from 'react-router-dom';

const MostPopular = () => {
    const products = [
        {
            id: 1,
            name: "adidas F50 Elite AG Football Boots",
            price: 269.99,
            originalPrice: 329.99,
            discount: 18,
            category: "BOOTS",
            tags: ["deal", "new"],
            sizes: [39, 40, 41, 42, 43, 44],
            images: adidasF50,
            colorVariants: [adidasF50, adidasF50ll, adidasYamal]
        },
        {
            id: 2,
            name: "adidas F50 Elite LL Football Boots",
            price: 269.99,
            originalPrice: 319.99,
            discount: 15,
            category: "BOOTS",
            tags: ["deal"],
            sizes: [40, 41, 42, 43],
            images: adidasF50ll,
            colorVariants: [adidasF50ll, adidasF50]
        },
        {
            id: 3,
            name: "adidas F50 Elite LL FG Lamine Yamal Football Boots",
            price: 279.99,
            originalPrice: 349.99,
            discount: 20,
            category: "BOOTS",
            tags: ["deal", "new"],
            sizes: [38, 39, 40, 41, 42],
            images: adidasYamal,
            colorVariants: [adidasYamal, adidasF50ll, adidasF50]
        },
        {
            id: 4,
            name: "Nike Air Zoom Mercurial Vapor 16 Pro FG Football Boots",
            price: 109.99,
            originalPrice: 149.99,
            discount: 27,
            category: "BOOTS",
            tags: ["deal"],
            sizes: [39, 40, 41, 42, 43, 44, 45],
            images: nikeMercurial,
            colorVariants: [nikeMercurial, nikePhantom]
        },
        {
            id: 5,
            name: "Nike Phantom 6 Low Pro FG Football Boots",
            price: 111.99,
            originalPrice: 139.99,
            discount: 20,
            category: "BOOTS",
            tags: ["deal", "children"],
            sizes: [36, 37, 38, 39, 40],
            images: nikePhantom,
            colorVariants: [nikePhantom, nikeMercurial]
        },
        {
            id: 6,
            name: "Puma Future 8 Pro FG AG Football Boots",
            price: 269.99,
            originalPrice: 329.99,
            discount: 18,
            category: "BOOTS",
            tags: ["deal"],
            sizes: [40, 41, 42, 43, 44],
            images: puma,
            colorVariants: [puma]
        },
        {
            id: 7,
            name: "Goalkeeper Gloves Professional",
            price: 89.99,
            category: "GLOVES",
            tags: ["new"],
            sizes: [7, 8, 9, 10, 11],
            images: adidasgloves,
            colorVariants: [adidasgloves, adidaspredator]
        },
        {
            id: 8,
            name: "Futsal Shoes Lightweight",
            price: 129.99,
            category: "GLOVES",
            tags: ["children", "new"],
            sizes: [6, 7, 8, 9],
            images: adidaspredator,
            colorVariants: [adidaspredator, adidasgloves]
        },
        {
            id: 9,
            name: "Football Socks Pack",
            price: 24.99,
            category: "ACCESSORIES",
            tags: ["new"],
            sizes: ["S", "M", "L", "XL"],
            images: ulsports,
            colorVariants: [ulsports]
        },
        {
            id: 10,
            name: "Goalkeeper Gloves Professional",
            price: 89.99,
            category: "GLOVES",
            tags: ["new"],
            sizes: [7, 8, 9, 10],
            images: adidasgloves,
            colorVariants: [adidasgloves, adidaspredator]
        },
        {
            id: 11,
            name: "Futsal Shoes Lightweight",
            price: 129.99,
            category: "GLOVES",
            tags: ["children"],
            sizes: [6, 7, 8, 9, 10],
            images: adidaspredator,
            colorVariants: [adidaspredator, adidasgloves]
        },
        {
            id: 12,
            name: "Football Socks Pack",
            price: 24.99,
            category: "ACCESSORIES",
            tags: ["new", "deal"],
            originalPrice: 34.99,
            discount: 29,
            sizes: ["S", "M", "L"],
            images: ulsports,
            colorVariants: [ulsports]
        }
    ];
    
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
    
    const categories = ['BOOTS', 'GLOVES', 'FUTSAL', 'ACCESSORIES'];
    
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
                const firstElement = scrollContainerRef.current.querySelector(`[data-product-id="${firstProduct.id}"]`);
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
    const hasDealTag = (tags) => tags.includes('deal');

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
                {products.map((product) => (
                    <Link 
                        to={`/product/${product.id}`} 
                        key={product.id} 
                        data-product-id={product.id}
                        className="min-w-[280px] md:min-w-[320px] rounded-lg shadow-sm flex flex-col overflow-hidden group relative"
                    >
                        {/* Part 1: Image */}
                        <div className="relative aspect-square">
                            <img 
                                src={product.images} 
                                alt={product.name}
                                className="w-full h-full object-cover rounded-lg"
                                draggable="false"
                            />
                            
                            {/* Part 2: Overlay with product info */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#001e1d] via-[#001e1d]/90 to-transparent rounded-b-lg">
                                {/* Color variants & Sizes - hidden by default, show on hover */}
                                <div className="px-3 pt-8 pb-2 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                    {/* Color variant images */}
                                    {product.colorVariants && product.colorVariants.length > 1 && (
                                        <div className="flex gap-2 mb-2">
                                            {product.colorVariants.map((variant, index) => (
                                                <div 
                                                    key={index}
                                                    className="w-10 h-10 rounded-md overflow-hidden border-2 border-white/50 hover:border-[#f9bc60] transition-colors cursor-pointer"
                                                >
                                                    <img 
                                                        src={variant} 
                                                        alt={`Color ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    
                                    {/* Sizes */}
                                    <div className="flex flex-wrap gap-1 mb-2">
                                        {product.sizes.map((size, index) => (
                                            <span 
                                                key={index}
                                                className="text-[10px] px-2 py-1 bg-[#004643] text-[#abd1c6] rounded hover:bg-[#f9bc60] hover:text-[#001e1d] transition-colors cursor-pointer"
                                            >
                                                {size}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Name, Price, Tags - always visible, moves up on hover */}
                                <div className="px-3 pb-3 transform group-hover:-translate-y-2 transition-transform duration-300">
                                    {/* Tags */}
                                    <div className="flex gap-1 mb-2 flex-wrap">
                                        {product.tags.map((tag, index) => (
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
                                
                                    {/* Name with ellipsis */}
                                    <h4 className="font-medium text-[#fffffe] text-sm leading-tight line-clamp-2 overflow-hidden">
                                        {product.name.toUpperCase()}
                                    </h4>
                                    
                                    {/* Price section */}
                                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                                        {hasDealTag(product.tags) && product.originalPrice ? (
                                            <>
                                                <p className="font-bold text-[#f9bc60]">${product.price}</p>
                                                <p className="font-light text-[#abd1c6]/60 line-through text-sm">${product.originalPrice}</p>
                                                <span className="text-xs font-bold text-[#004643] bg-[#f9bc60] px-1.5 py-0.5 rounded">
                                                    -{product.discount}%
                                                </span>
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
        </div>
    </section>
  )
}

export default MostPopular