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
            category: "BOOTS",
            tag: "deal",
            images: adidasF50
        },
        {
            id: 2,
            name: "adidas F50 Elite LL Football Boots",
            price: 269.99,
            category: "BOOTS",
            tag: "deal",
            images: adidasF50ll
        },
        {
            id: 3,
            name: "adidas F50 Elite LL FG Lamine Yamal Football Boots",
            price: 279.99,
            category: "BOOTS",
            tag: "deal",
            images: adidasYamal
        },
        {
            id: 4,
            name: "Nike Air Zoom Mercurial Vapor 16 Pro FG Football Boots",
            price: 109.99,
            category: "BOOTS",
            tag: "deal",
            images: nikeMercurial
        },
        {
            id: 5,
            name: "Nike Phantom 6 Low Pro FG Football Boots",
            price: 111.99,
            category: "BOOTS",
            tag: "deal",
            images: nikePhantom
        },
        {
            id: 6,
            name: "Nike Air Zoom Mercurial Vapor 16 Pro AG Football Boots",
            price: 269.99,
            category: "BOOTS",
            tag: "deal",
            images: puma
        },
        {
            id: 7,
            name: "Goalkeeper Gloves Professional",
            price: 89.99,
            category: "GLOVES",
            tag: "new",
            images: adidasgloves
        },
        {
            id: 8,
            name: "Futsal Shoes Lightweight",
            price: 129.99,
            category: "GLOVES",
            tag: "popular",
            images: adidaspredator
        },
        {
            id: 9,
            name: "Football Socks Pack",
            price: 24.99,
            category: "ACCESSORIES",
            tag: "new",
            images: ulsports
        },
        {
            id: 10,
            name: "Goalkeeper Gloves Professional",
            price: 89.99,
            category: "GLOVES",
            tag: "new",
            images: adidasgloves
        },
        {
            id: 11,
            name: "Futsal Shoes Lightweight",
            price: 129.99,
            category: "GLOVES",
            tag: "popular",
            images: adidaspredator
        },
        {
            id: 12,
            name: "Football Socks Pack",
            price: 24.99,
            category: "ACCESSORIES",
            tag: "new",
            images: ulsports
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

  return (
    <section className="py-10">
        <div className="container mx-auto px-4 relative">
            <h2 className='text-center text-3xl text-[#001e1d] font-bold tracking-wider'>MOST POPULAR</h2>
            
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
                    <div key={product.id} 
                        data-product-id={product.id}
                        className="min-w-[280px] md:min-w-[320px] bg-[#004643] rounded-lg shadow-sm flex flex-col overflow-hidden group">
                        <img 
                            src={product.images} 
                            alt={product.name}
                            className="relative bg-[#004643] aspect-square flex items-center justify-center p-4"
                            draggable="false"/>
                        <div className="p-4 flex flex-col flex-grow">
                            <div className="flex mb-2">
                                <span className="bg-[#f9bc60] text-white text-[10px] font-black px-2 py-0.5 uppercase">
                                    {product.tag.toUpperCase()}
                                </span>
                            </div>
                        
                            <div className="text-sm font-bold text-[#abd1c6] leading-tight uppercase group-hover:text-[#00948d] transition-colors">
                            
                                <Link to={`/product/${product.id}`} className="block text-left">
                                    <h4 className="font-medium ">{product.name.toUpperCase()}</h4>
                                    <p className="mt-1">${product.price}</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
  )
}

export default MostPopular