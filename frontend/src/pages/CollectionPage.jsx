import { useRef, useEffect, useState } from "react"
import { FaFilter } from "react-icons/fa";
import adidasF50 from '../assets/Most Popular/boots/bota-adidas-f50-elite-ag-purple.jpg';
import nikeMercurial from '../assets/Most Popular/boots/bota-nike-air-zoom-mercurial-vap.jpg';
import FilterSidebar from "../components/product/FilterSidebar";
import SortOptions from "../components/product/SortOptions";
import ProductGrid from "../components/product/ProductGrid";

const CollectionPage = () => {
    const [product,setProduct] = useState([]);
    const sidebarRef = useRef(null);
    const filterBtnRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toogleSidebar =() =>{
        setIsSidebarOpen(!isSidebarOpen);
    }
    const handleClickOutside = (e) => {
        //Close sidebar if click outside
        if(sidebarRef.current && !sidebarRef.current.contains(e.target) && filterBtnRef.current && !filterBtnRef.current.contains(e.target)){
            setIsSidebarOpen(false);
        }
    }
    useEffect(() => {
        //Add event listener for clicks
        document.addEventListener('mousedown', handleClickOutside);
        //Clear event listener 
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    },[]);

    useEffect(() =>{
        setTimeout(() => {
            const fetchedProducts = 
            [
              {
                id: 1,
                name: "adidas F50 Elite AG Football Boots",
                price: 49.99,
                originalPrice: 69.99,
                discount: 18,
                category: "BOOTS",
                tags: ["deal", "new"],
                sizes: [39, 40, 41, 42, 43, 44],
                colorVariants: [adidasF50, nikeMercurial],
                images: adidasF50,
              },
              {
                id: 2,
                name: "Nike Air Zoom Mercurial Vapor 16",
                price: 49.99,
                originalPrice: 69.99,
                discount: 18,
                category: "BOOTS",
                tags: ["deal", "new"],
                sizes: [39, 40, 41, 42, 43, 44],
                colorVariants: [nikeMercurial, adidasF50],
                images: nikeMercurial,
              },
              {
                id: 3,
                name: "Adidas F50 Elite AG",
                price: 49.99,
                originalPrice: 69.99,
                discount: 18,
                category: "BOOTS",
                tags: ["deal", "new"],
                sizes: [39, 40, 41, 42, 43, 44],
                colorVariants: [],
                images: adidasF50,
              },
              {
                id: 4,
                name: "Nike Air Zoom Mercurial",
                price: 49.99,
                originalPrice: 69.99,
                discount: 18,
                category: "BOOTS",
                tags: ["deal", "new"],
                sizes: [39, 40, 41, 42, 43, 44],
                colorVariants: [],
                images: nikeMercurial,
              },
              {
                id: 5,
                name: "adidas F50 Elite AG Football Boots",
                price: 49.99,
                originalPrice: 69.99,
                discount: 18,
                category: "BOOTS",
                tags: ["deal", "new"],
                sizes: [39, 40, 41, 42, 43, 44],
                colorVariants: [adidasF50, nikeMercurial],
                images: adidasF50,
              },
              {
                id: 6,
                name: "Nike Air Zoom Mercurial Vapor 16",
                price: 49.99,
                originalPrice: 69.99,
                discount: 18,
                category: "BOOTS",
                tags: ["deal", "new"],
                sizes: [39, 40, 41, 42, 43, 44],
                colorVariants: [nikeMercurial, adidasF50],
                images: nikeMercurial,
              },
              {
                id: 7,
                name: "Adidas F50 Elite AG",
                price: 49.99,
                originalPrice: 69.99,
                discount: 18,
                category: "BOOTS",
                tags: ["deal", "new"],
                sizes: [39, 40, 41, 42, 43, 44],
                colorVariants: [],
                images: adidasF50,
              },
              {
                id: 8,
                name: "Nike Air Zoom Mercurial",
                price: 49.99,
                originalPrice: 69.99,
                discount: 18,
                category: "BOOTS",
                tags: ["deal", "new"],
                sizes: [39, 40, 41, 42, 43, 44],
                colorVariants: [],
                images: nikeMercurial,
              }
            ]; setProduct(fetchedProducts);
        },1000);
    },[]);
  return (
    <div className="flex flex-col lg:flex-row">
        {/* Mobile filter */}
        <button ref={filterBtnRef} onClick={toogleSidebar} className="lg:hidden border p-2 flex text-[#004643] border-[#004643] justify-center items-center">
            <FaFilter className="mr-2"/> Filter
        </button>
        {/* Filter sidebar */}
        <div ref={sidebarRef} className={`${isSidebarOpen ? "translate-x-0":"-translate-x-full"} fixed inset-y-0 z-50 left-0 w-64
        bg-[#004643] overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}>
          <FilterSidebar/>
        </div>
        <div className="flex-grow p-4">
          <h2 className="text-2xl uppercase mb-4">All Boots</h2>
          {/* Sort Options */}
          <SortOptions/>
          {/* Product Grid */}
          <ProductGrid products={product} />
        </div>
    </div>
  )
}

export default CollectionPage