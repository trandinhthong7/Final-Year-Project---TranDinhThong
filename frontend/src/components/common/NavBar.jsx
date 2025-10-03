import { Link } from 'react-router-dom'
import { FaUserCircle,FaShoppingCart,FaSearch } from "react-icons/fa"
import SearchBar from './SearchBar'

const NavBar = () => {
  return (
    <div>
        <nav className="container mx-auto flex items-center justify-between py-4 px-6">
            {/* Left-Logo  */}
            <div>
                <Link to={"/"} className="text-2xl font-medium text-[#004643] hover:text-[#fffffe]">TDT-Football</Link>
            </div>
            {/* Center - Menu */}
            <div className="hidden md:flex space-x-6">
                <Link to="" className=" text-[#004643] hover:text-[#fffffe] text-sm font-medium uppercase">Home</Link>
                <Link to="" className=" text-[#004643] hover:text-[#fffffe] text-sm font-medium uppercase">Shoes</Link>
                <Link to="" className=" text-[#004643] hover:text-[#fffffe] text-sm font-medium uppercase">Gloves</Link>
                <Link to="" className=" text-[#004643] hover:text-[#fffffe] text-sm font-medium uppercase">Accessories</Link>              
                <Link to="" className=" text-[#004643] hover:text-[#fffffe] text-sm font-medium uppercase">Futsal</Link>
                <Link to="" className=" text-[#004643] hover:text-[#fffffe] text-sm font-medium uppercase">Booking</Link>
            </div>
            {/* Right - Icons */}
            <div className="flex items-center space-x-6">
                <Link to="/profile"><FaUserCircle className="text-[#004643] hover:text-[#fffffe] h-6 w-6"/></Link>
                <Link to="/cart" className="relative">
                  <FaShoppingCart className="text-[#004643] hover:text-[#fffffe] h-6 w-6"/>
                  <span className="absolute -top-2.5 -right-3 bg-[#004643] text-[#abd1c6] text-xs rounded-full px-1.5 py-0.5">4</span>
                </Link>
              {/* search icon */}
              <SearchBar/>
              <button className="md:hidden"><FaSearch className="text-[#004643] h-6 w-6"/></button>
            </div>
        </nav>
    </div>
  )
}

export default NavBar