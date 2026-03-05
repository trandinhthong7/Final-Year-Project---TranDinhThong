
import { Link } from 'react-router-dom'

const Footer = () => {
  const brands = [
    { name: 'Adidas', slug: 'adidas', logo: '/images/brands/adidas.png' },
    { name: 'Nike', slug: 'nike', logo: '/images/brands/nike.png' },
    { name: 'Puma', slug: 'puma', logo: '/images/brands/puma.png' },
    { name: 'THUONG DINH', slug: 'THUONGDINH', logo: '/images/brands/ThuongDinh.png' },
    { name: 'New Balance', slug: 'new-balance', logo: '/images/brands/new-balance.png' },
    { name: 'Mizuno', slug: 'mizuno', logo: '/images/brands/mizuno.png' },
    { name: 'Under Armour', slug: 'under-armour', logo: '/images/brands/under-armour.png' },
    { name: 'Uhlsport', slug: 'uhlsport', logo: '/images/brands/uhlsport.png' },
  ];

  return (
    <footer>
        {/* Brands Section */}
        <div className="border-b border-t">
          <div className="container mx-auto px-4 lg:px-0 overflow-x-auto">
            <div className="flex gap-4 items-center justify-between min-w-max lg:min-w-0">
            {brands.map((brand) => (
              <Link 
                key={brand.slug}
                to={`/brands/${brand.slug}`}
                title={brand.name}
                className="flex items-center justify-center p-2 rounded-lg hover:bg-[#004643]/10 transition-colors flex-shrink-0"
              >
                <img 
                  loading="lazy"
                  src={brand.logo}
                  alt={brand.name}
                  className="w-14 h-14 object-contain grayscale hover:grayscale-0 transition-all"
                />
              </Link>
            ))}
            <Link 
              to="/brands"
              className="flex flex-col items-center justify-center p-2 text-[#004643] hover:text-[#00948d] transition-colors flex-shrink-0"
            >
              
            </Link>
            </div>
          </div>
        </div>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_2fr] gap-8 lg:px-0 p-4">
            <div className="text-[#001e1d] mb-2">
                <h3 className="text-lg mb-4 font-bold">Newsletter</h3>
                <p className=" text-[#004643] mb-4">Be the first to hear about new products, exclusive events, and online offer. </p>
                <p className="text-sm mb-2 font-bold">Sign up and get 20% off your first order.</p>
                {/* News letter form will be here */}
                <form className="flex gap-2">
                    <input
                        id="email-address"
                        name="email"
                        type="email"
                        required
                        placeholder="Enter your email"
                        autoComplete="email"
                        className="min-w-0 flex-auto rounded-md bg-[#004643] px-3.5 py-2 text-base text-[#abd1c6] outline-1 -outline-offset-1 outline-[#004643] placeholder:text-[#abd1c6] focus:outline-2 focus:-outline-offset-2 focus:outline-[#f9bc60] sm:text-sm/6"
                    />
                    <button
                        type="submit"
                        className="flex-none rounded-md bg-[#f9bc60] px-3.5 py-2.5 text-sm font-semibold text-[#001e1d] shadow-xs hover:bg-[#a47733] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f9bc60]"
                        >Subscribe
                    </button>
                </form>
            </div>
            {/* shop links */}
            <div>
                <h3 className="text-lg text-[#001e1d] mb-3 font-bold" >Shop</h3>
                <ul className="text-[#004643] space-y-2 text-sm">
                    <li><Link to="#" className="hover:text-[#00948d] transition-colors">Messi Boots</Link></li>
                    <li><Link to="#" className="hover:text-[#00948d] transition-colors">Lamine Yamal Boots</Link></li>
                    <li><Link to="#" className="hover:text-[#00948d] transition-colors">Ronaldo Boots</Link></li>
                    <li><Link to="#" className="hover:text-[#00948d] transition-colors">Neymar Boots</Link></li>
                </ul>
            </div>

            {/* support links */}
            <div>
                <h3 className="text-lg text-[#001e1d] mb-3 font-bold">Support</h3>
                <ul className="text-[#004643] space-y-2 text-sm">
                    <li><Link to="#" className="hover:text-[#00948d] transition-colors">Contact Us</Link></li>
                    <li><Link to="#" className="hover:text-[#00948d] transition-colors">About Us</Link></li>
                    <li><Link to="#" className="hover:text-[#00948d] transition-colors">FAQs</Link></li>
                    <li><Link to="#" className="hover:text-[#00948d] transition-colors">Boot size conversion charts</Link></li>
                </ul>
            </div>

            {/* Download app  */}
            <div className="text-[#001e1d]">
                <h1 className="text-2xl font-bold mb-5">Download now the app for those crazy about football equipment and enjoy faster and more convenient shopping and booking.</h1>
                <div className="flex justify-center xl:justify-start mb-4 space-x-4">
                    <a href="">
                        <img className="w-auto h-12" src="/images/store-en.png" alt="Google Play"></img>
                    </a>
                    <a href="">
                        <img className="w-auto h-12" src="/images/market-en.png" alt="App Store"></img>
                    </a>
                </div>
            </div>
            
        </div>

        {/* footer copyright */}
        <div className="container mx-auto mt-8 border-t pt-6 px-4 lg:px-0">
            <p className="text-sm text-center text-[#001e1d]">&copy;2025 Football Boots Store. All rights reserved.</p>
        </div>
    </footer>
    )
}

export default Footer