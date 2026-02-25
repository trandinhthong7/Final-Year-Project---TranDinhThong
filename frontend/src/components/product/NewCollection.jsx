import { useCallback, useState, useRef } from "react";
import adidas_yamal from "../../assets/New Collection/0912_adidas_yamal_icons25_colecc.jpg";
import adidas_coral from "../../assets/New Collection/0923_adidas_coral_blaze25_colecc.jpg";
import wc26 from "../../assets/New Collection/1759738639adidas_trionda_wc26.jpg";
import nike_max from "../../assets/New Collection/nike_max_voltage25.jpg";
import puma_hot from "../../assets/New Collection/puma_hot_pursuit25.jpg";


const NewCollection = () => {
    // State for drag functionality
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    
    // Refs for scroll container and momentum
    const scrollContainerRef = useRef(null);
    const velocityRef = useRef(0);
    const lastMoveRef = useRef(0);
    const animationRef = useRef(null);

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

    return (
        <section className="py-8 px-4 lg:px-0">
            <h1 className="text-center pb-4 text-3xl text-[#001e1d] font-bold ">NEW COLLECTIONS</h1>
            <div 
                ref={scrollContainerRef}
                className={`container mx-auto flex flex-row gap-8 overflow-x-auto 
                            lg:grid lg:grid-cols-5 lg:overflow-visible ${
                            isDragging ? "cursor-grabbing" : "cursor-grab"
                        }`}
                style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
            >
                <div className="relative flex-shrink-0 w-3/4 sm:w-1/2 md:w-1/3 lg:w-auto">
                    <img src={adidas_yamal} alt="Adidas Yamal Icons" className="w-full h-auto object-cover rounded-lg"/>
                </div>
                <div className="relative flex-shrink-0 w-3/4 sm:w-1/2 md:w-1/3 lg:w-auto">
                    <img src={adidas_coral} alt="Adidas Coral Blaze" className="w-full h-auto object-cover rounded-lg"/>
                </div>
                <div className="relative flex-shrink-0 w-3/4 sm:w-1/2 md:w-1/3 lg:w-auto">
                    <img src={wc26} alt="Adidas Trionda WC26" className="w-full h-auto object-cover rounded-lg"/>
                </div>
                <div className="relative flex-shrink-0 w-3/4 sm:w-1/2 md:w-1/3 lg:w-auto">
                    <img src={nike_max} alt="Nike Max Voltage" className="w-full h-auto object-cover rounded-lg"/>
                </div>
                <div className="relative flex-shrink-0 w-3/4 sm:w-1/2 md:w-1/3 lg:w-auto">
                    <img src={puma_hot} alt="Puma Hot Pursuit" className="w-full h-auto object-cover rounded-lg"/>
                </div>
            </div>
        </section>
    );
};

export default NewCollection;