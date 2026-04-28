import { useRef, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../components/product/FilterSidebar";
import SortOptions from "../components/product/SortOptions";
import ProductGrid from "../components/product/ProductGrid";
import Pagination from "../components/common/Pagination";
import { fetchProductsByFilter } from "../redux/slices/productsSlice";

const GlovePage = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const { products, loading, error, totalPages, currentPage } = useSelector((state) => state.products);
    
    const sidebarRef = useRef(null);
    const filterBtnRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }
    
    const handleClickOutside = (e) => {
        if (sidebarRef.current && !sidebarRef.current.contains(e.target) && 
            filterBtnRef.current && !filterBtnRef.current.contains(e.target)) {
            setIsSidebarOpen(false);
        }
    }
    
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const params = Object.fromEntries([...searchParams]);
        const sortBy = params.sortBy;
        let sortField = "createdAt";
        let sortOrder = "desc";

        if (sortBy === "priceAsc") {
            sortField = "price";
            sortOrder = "asc";
        } else if (sortBy === "priceDesc") {
            sortField = "price";
            sortOrder = "desc";
        } else if (sortBy === "popularity") {
            sortField = "totalSold";
            sortOrder = "desc";
        }

        dispatch(fetchProductsByFilter({
            category: "GLOVES",
            brand: params.brand,
            gloveSize: params.size,
            color: params.color,
            age: params.age,
            maxPrice: params.maxPrice,
            minPrice: params.minPrice,
            tags: params.tags,
            sortBy: sortField,
            order: sortOrder,
            page: params.page || 1,
            limit: 8
        }));
    }, [dispatch, searchParams]);

    const handlePageChange = (pageNumber) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", pageNumber);
        setSearchParams(params);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl text-[#004643]">Loading products...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl text-red-600">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row">
            <button 
                ref={filterBtnRef} 
                onClick={toggleSidebar} 
                className="lg:hidden border p-2 flex text-[#004643] border-[#004643] justify-center items-center"
            >
                <FaFilter className="mr-2" /> Filter
            </button>
            
            <div 
                ref={sidebarRef} 
                className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 z-50 left-0 w-64
                bg-[#004643] overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}
            >
                <FilterSidebar category="GLOVES" />
            </div>
            
            <div className="flex-grow p-4">
                <h2 className="text-2xl uppercase mb-4 text-[#001e1d] font-bold">All Goalkeeper Gloves</h2>
                <SortOptions />
                {products.length === 0 ? (
                    <div className="text-center py-8 text-[#004643]">No products found</div>
                ) : (
                    <>
                        <ProductGrid products={products} />
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </div>
        </div>
    )
}

export default GlovePage
