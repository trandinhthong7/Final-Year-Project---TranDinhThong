import Carousel from '../components/layout/Carousel'
import NewCollection from '../components/product/NewCollection'
import MostPopular from '../components/product/MostPopular'

const Home = () => {
  return (
    <div>
        <Carousel/>
        <NewCollection/>
        <MostPopular/>
    </div>
  )
}

export default Home