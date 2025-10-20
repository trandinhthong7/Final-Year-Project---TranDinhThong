
import adidasF50 from '../../assets/Most Popular/bota-adidas-f50-elite-ag-purple.jpg';
import nikeAir from '../../assets/Most Popular/bota-nike-air-zoom-mercurial-vap.jpg';
const MostPopular = () => {
    const MostPopular = [
        {
            id: 1,
            name: "adidas F50 Elite LL FG Football Boots",
            price: 269.99,
            category: "Football Boots",
            tag: "deal",
            images: adidasF50
        },
        {
            id: 2,
            name: "Nike Air Zoom Mercurial Vapor 16 Pro AG Football Boots",
            price: 269.99,
            category: "Football Boots",
            tag: "deal",
            images: nikeAir
        }
    ];
  return (
    <section>
        <div className="container mx-auto text-center mb-10 relative">
            <h2 className='text-center pb-4 text-5xl text-[#001e1d] font-bold mt-10'>MOST POPULAR</h2>
            {/* scroll button  */}
            <div>

            </div>
        </div>
    </section>
  )
}

export default MostPopular