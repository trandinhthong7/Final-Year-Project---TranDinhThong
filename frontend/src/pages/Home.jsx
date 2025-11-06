import Carousel from '../components/layout/Carousel'
import NewCollection from '../components/product/NewCollection'
import MostPopular from '../components/product/MostPopular'
import ProductDetail from '../components/product/ProductDetail'

const Home = () => {
  return (
    <div>
        <Carousel/>
        <NewCollection/>
        <MostPopular/>
        <ProductDetail/>
    </div>
  )
}

export default Home