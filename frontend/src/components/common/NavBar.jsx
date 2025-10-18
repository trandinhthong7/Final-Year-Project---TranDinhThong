import { Link } from 'react-router-dom'
import { FaUserCircle, FaTimes, FaBars } from "react-icons/fa"
import SearchBar from './SearchBar'
import CartDrawer from '../layout/CartDrawer'
import { useState } from 'react'
import { IoBagHandleOutline, IoPersonCircleOutline, IoPersonOutline } from 'react-icons/io5'

const NavBar = () => {
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);

  };
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  return (
    <div>
        <nav className="container mx-auto flex items-center justify-between py-4 px-2">
            {/* Left-Logo  */}
            <div>
                <Link to={"/"} className="text-xl font-medium text-[#001e1d] hover:text-[#00948d] mx-4">TDT-Football</Link>
            </div>
            {/* Center - Menu */}
            <div className="hidden md:flex space-x-6">
                <Link to="" className=" text-[#001e1d] hover:text-[#00948d] text-sm font-medium uppercase">Home</Link>
                <Link to="" className=" text-[#001e1d] hover:text-[#00948d] text-sm font-medium uppercase">Boots</Link>
                <Link to="" className=" text-[#001e1d] hover:text-[#00948d] text-sm font-medium uppercase">Gloves</Link>
                <Link to="" className=" text-[#001e1d] hover:text-[#00948d] text-sm font-medium uppercase">Accessories</Link>              
                <Link to="" className=" text-[#001e1d] hover:text-[#00948d] text-sm font-medium uppercase">Futsal</Link>
                <Link to="" className=" text-[#001e1d] hover:text-[#00948d] text-sm font-medium uppercase">Booking</Link>
                <Link to="" className=" text-[#00001e1d4643] hover:text-[#00948d] text-sm font-medium uppercase">Academy</Link>
            </div>
            {/* Right - Icons */}
            <div className="flex items-center space-x-4 mx-4">
                <Link to="/profile"><IoPersonOutline className="text-[#001e1d] hover:text-[#00948d] h-6 w-6"/></Link>
                <button onClick={toggleDrawer} className="relative">
                  <IoBagHandleOutline className="text-[#001e1d] hover:text-[#00948d] h-6 w-6"/>
                  <span className="absolute -top-2.5 -right-3 bg-[#001e1d] text-[#abd1c6] text-xs rounded-full px-1.5 py-0.5">4</span>
                </button>
              {/* search icon */}
              <div className="overflow-hidden text-[#001e1d]"><SearchBar/></div>
              <button onClick={toggleNavDrawer} className="md:hidden">
                <FaBars className="text-[#001e1d] h-6 w-6"/>
              </button>
            </div>
        </nav>
        {/* cart drawer */}
        <CartDrawer drawerOpen={drawerOpen} toggleDrawer={toggleDrawer}/>

        {/* mobile navigation */}
        <div 
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-[#004643] shadow-lg transform transition-transform duration-300 z-50 ${navDrawerOpen ? "translate-x-0" : " -translate-x-full"}`} >
          <div className="flex justify-end p-4">
            <button onClick={toggleNavDrawer}><FaTimes className="h-6 w-6 text-[#abd1c6]"/></button>
          </div>
          <div className="p-4">
            <h2 className="text-xl text-[#abd1c6] font-semibold mb-4">Menu</h2>
            <nav>
              <Link to = "#" onClick={toggleNavDrawer} className="block text-[#abd1c6] hover:text-[#00948d]">Home</Link>
              <Link to = "#" onClick={toggleNavDrawer} className="block text-[#abd1c6] hover:text-[#00948d]">Boots</Link>
              <Link to = "#" onClick={toggleNavDrawer} className="block text-[#abd1c6] hover:text-[#00948d]">Gloves</Link>
              <Link to = "#" onClick={toggleNavDrawer} className="block text-[#abd1c6] hover:text-[#00948d]">Accessories</Link>
              <Link to = "#" onClick={toggleNavDrawer} className="block text-[#abd1c6] hover:text-[#00948d]">Futsal</Link>
              <Link to = "#" onClick={toggleNavDrawer} className="block text-[#abd1c6] hover:text-[#00948d]">Booking</Link>
              <Link to = "#" onClick={toggleNavDrawer} className="block text-[#abd1c6] hover:text-[#00948d]">Academy</Link>
            </nav>
          </div>
        </div>
        
    </div>
  )
}

export default NavBar