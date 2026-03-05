import Carousel from '../components/layout/Carousel'
import NewCollection from '../components/product/NewCollection'
import MostPopular from '../components/product/MostPopular'
import ProductDetail from '../components/product/ProductDetail'
import ProductGrid from '../components/product/ProductGrid'


const placeholderProduct = [
  {
    id: 1,
    name: "Product 1",
    price: 59.99,
    image: [{url: "https://www.futbolemotion.com/imagesarticulos/232529/750/bota-nike-tiempo-legend-10-elite-fg-black-black-deep-jungle-0.webp"}],
  },
  {
    id: 2,
    name: "Product 2",
    price: 59.99,
    image: [{url: "https://www.futbolemotion.com/imagesarticulos/232529/750/bota-nike-tiempo-legend-10-elite-fg-black-black-deep-jungle-0.webp"}],
  },
];
const Home = () => {
  return (
    <div>
        <Carousel/>
        <NewCollection/>
        <MostPopular/>
        {/*Best Seller*/}
              <h2 className='text-center text-3xl text-[#001e1d] font-bold'>BEST SELLER</h2>
        <ProductDetail/>
        
    </div>
  )
}

export default Home