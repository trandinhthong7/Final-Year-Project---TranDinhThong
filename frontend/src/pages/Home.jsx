import Carousel from '../components/layout/Carousel'
import NewCollection from '../components/product/NewCollection'
import MostPopular from '../components/product/MostPopular'
import ProductDetail from '../components/product/ProductDetail'
import FeaturesSection from '../components/product/FeaturesSection'


const Home = () => {
  return (
    <div>
        <Carousel/>
        <NewCollection/>
        <MostPopular/>
        <ProductDetail/>
        <FeaturesSection/>
        
    </div>
  )
}

export default Home