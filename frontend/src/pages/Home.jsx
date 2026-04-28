import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Carousel from '../components/layout/Carousel';
import NewCollection from '../components/product/NewCollection';
import MostPopular from '../components/product/MostPopular';
import ProductDetail from '../components/product/ProductDetail';
import FeaturesSection from '../components/product/FeaturesSection';

const Home = () => {
  const [bestSellerProductId, setBestSellerProductId] = useState(null);

  useEffect(() => {
    // Fetch a best seller product
    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/featured/bestsellers`
        );
        if (response.data && response.data.length > 0) {
          // Get the first best seller product ID
          setBestSellerProductId(response.data[0]._id);
        }
      } catch (error) {
        console.error('Error fetching best seller:', error);
      }
    };
    
    fetchBestSeller();
  }, []);

  return (
    <div>
      <Carousel/>
      <NewCollection/>
      <MostPopular/>
      
      {/* Best Seller */}
      {bestSellerProductId && (
        <>
          <h2 className='text-center text-3xl text-[#001e1d] font-bold '>BEST SELLER</h2>
          <ProductDetail productId={bestSellerProductId} showRelatedProducts={true} />
        </>
      )}
      
      <FeaturesSection/>
    </div>
  );
};

export default Home;