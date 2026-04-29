import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProductGrid from '../components/product/ProductGrid';
import { IoSearchOutline } from 'react-icons/io5';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000';
        const response = await axios.get(`${backendUrl}/api/products`, {
          params: {
            searchQuery: query,
            limit: 50 // Get more results for search
          }
        });

        setProducts(response.data.products || []);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to fetch search results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <IoSearchOutline className="text-[#004643] h-8 w-8" />
            <h1 className="text-3xl font-bold text-[#001e1d]">
              Search Results
            </h1>
          </div>
          
          {query && (
            <p className="text-lg text-[#004643]">
              Showing results for: <span className="font-semibold">"{query}"</span>
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-[#004643] text-xl">Searching...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex justify-center items-center h-64">
            <div className="text-red-500 text-xl">{error}</div>
          </div>
        )}

        {/* No Query */}
        {!loading && !query && (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <IoSearchOutline className="text-[#abd1c6] h-24 w-24" />
            <p className="text-[#004643] text-xl">Enter a search term to find products</p>
            <Link 
              to="/" 
              className="bg-[#f9bc60] text-[#001e1d] px-6 py-2 rounded-md hover:bg-[#004643] hover:text-[#fffffe] transition-colors font-medium"
            >
              Back to Home
            </Link>
          </div>
        )}

        {/* No Results */}
        {!loading && query && products.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <IoSearchOutline className="text-[#abd1c6] h-24 w-24" />
            <p className="text-[#004643] text-xl">No products found for "{query}"</p>
            <p className="text-[#004643]">Try different keywords or browse our collections</p>
            <div className="flex gap-4 mt-4">
              <Link 
                to="/collections/boots" 
                className="bg-[#004643] text-[#fffffe] px-6 py-2 rounded-md hover:bg-[#f9bc60] hover:text-[#001e1d] transition-colors font-medium"
              >
                Browse Boots
              </Link>
              <Link 
                to="/collections/gloves" 
                className="bg-[#004643] text-[#fffffe] px-6 py-2 rounded-md hover:bg-[#f9bc60] hover:text-[#001e1d] transition-colors font-medium"
              >
                Browse Gloves
              </Link>
              <Link 
                to="/collections/accessories" 
                className="bg-[#004643] text-[#fffffe] px-6 py-2 rounded-md hover:bg-[#f9bc60] hover:text-[#001e1d] transition-colors font-medium"
              >
                Browse Accessories
              </Link>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && products.length > 0 && (
          <div>
            <p className="text-[#004643] mb-6">
              Found <span className="font-bold text-[#001e1d]">{products.length}</span> product{products.length !== 1 ? 's' : ''}
            </p>
            <ProductGrid products={products} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
