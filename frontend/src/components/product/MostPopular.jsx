import { useState, useRef } from 'react';
import adidasF50 from '../../assets/Most Popular/boots/bota-adidas-f50-elite-ag-purple.jpg';
import adidasF50ll from '../../assets/Most Popular/boots/bota-adidas-f50-elite-ll-fg-purp.jpg';
import adidasYamal from '../../assets/Most Popular/boots/bota-adidas-f50-elite-ll-fglamine-yamal-unity-purple-white-lucid-lemon-0.webp';
import nikeMercurial from '../../assets/Most Popular/boots/bota-nike-air-zoom-mercurial-vap.jpg';
import nikePhantom from '../../assets/Most Popular/boots/bota-nike-phantom-6-low-pro-fg-a.jpg';
import puma from '../../assets/Most Popular/boots/bota-puma-zukunftige-8-pro-fg-ag.jpg';
import adidasgloves from '../../assets/Most Popular/gloves/guantes-adidas-copa-match-fingersave-black-0.webp';
import adidaspredator from '../../assets/Most Popular/gloves/guantes-adidas-predator-competition-lucid-lemon-white-black-0.webp';
import ulsports from '../../assets/Most Popular/gloves/guantes-uhlsport-fangmaschine-cybertec-starter-soft-nino-multicolor-0.webp';

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
            id: 6,
            name: "adidas F50 Elite LL Football Boots",
            price: 269.99,
            category: "BOOTS",
            tag: "deal",
            images: adidasF50ll
        },
        {
            id: 7,
            name: "adidas F50 Elite LL FG Lamine Yamal Football Boots",
            price: 279.99,
            category: "BOOTS",
            tag: "deal",
            images: adidasYamal
        },
        {
            id: 8,
            name: "Nike Air Zoom Mercurial Vapor 16 Pro FG Football Boots",
            price: 109.99,
            category: "BOOTS",
            tag: "deal",
            images: nikeMercurial
        },
        {
            id: 9,
            name: "Nike Phantom 6 Low Pro FG Football Boots",
            price: 111.99,
            category: "BOOTS",
            tag: "deal",
            images: nikePhantom
        },
        {
            id: 2,
            name: "Nike Air Zoom Mercurial Vapor 16 Pro AG Football Boots",
            price: 269.99,
            category: "BOOTS",
            tag: "deal",
            images: puma
        },
        {
            id: 3,
            name: "Goalkeeper Gloves Professional",
            price: 89.99,
            category: "GLOVES",
            tag: "new",
            images: adidasgloves
        },
        {
            id: 4,
            name: "Futsal Shoes Lightweight",
            price: 129.99,
            category: "GLOVES",
            tag: "popular",
            images: adidaspredator
        },
        {
            id: 5,
            name: "Football Socks Pack",
            price: 24.99,
            category: "ACCESSORIES",
            tag: "new",
            images: ulsports
        }
    ];
    
    const categories = ['BOOTS', 'GLOVES', 'FUTSAL', 'ACCESSORIES'];
    const [selectedCategory, setSelectedCategory] = useState('BOOTS');
    const scrollContainerRef = useRef(null);

    // Filter products based on selected category
    const filteredProducts = products.filter(product => product.category === selectedCategory);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        // Filter products by category and scroll to first item
        const filteredProducts = products.filter(product => product.category === category);
        if (filteredProducts.length > 0 && scrollContainerRef.current) {
            setTimeout(() => {
                const firstElement = scrollContainerRef.current.querySelector(`[data-product-id="${filteredProducts[0].id}"]`);
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
    <section>
        <div className="container mx-auto text-center mb-10 relative">
            <h2 className='text-center pb-4 text-5xl text-[#001e1d] font-bold mt-10'>MOST POPULAR</h2>
            
            {/* Categories navigation */}
            <div>
                <nav className="sticky top-0 flex justify-center space-x-6 md:space-x-8">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleCategoryClick(category)}
                            className={`
                                pb-1
                                font-medium
                                text-lg
                                flex-shrink-0 
                                transition-colors
                                duration-200
                                hover:text-[#00948d]
                                ${
                                    selectedCategory === category
                                    ? 'border-b-2 border-black text-[#001e1d]'
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
                className="flex space-x-4 px-4 py-6 overflow-x-auto scrollbar-hide"
                style={{ scrollBehavior: 'smooth' }}
            >
                {filteredProducts.map((product) => (
                    <div 
                        key={product.id}
                        data-product-id={product.id}
                        className="flex-shrink-0 w-64 bg-[#001e1d] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="relative">
                            <img 
                                src={product.images} 
                                alt={product.name}
                                className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                                {product.tag.toUpperCase()}
                            </span>
                        </div>
                        <div className="p-2 text-left">
                            <h3 className=" text-lg mb-2 text-[#abd1c6]">{product.name}</h3>
                            <p className="text-xl font-bold text-[#abd1c6]">${product.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
  )
}

export default MostPopular