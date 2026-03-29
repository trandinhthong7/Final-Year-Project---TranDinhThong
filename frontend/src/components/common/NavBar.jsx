import { Link } from 'react-router-dom'
import SearchBar from './SearchBar'
import CartDrawer from '../layout/CartDrawer'
import { useState } from 'react'
import { HiOutlineBars3 } from "react-icons/hi2";
import { IoBagHandleOutline, IoCloseOutline, IoPersonOutline } from 'react-icons/io5'

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
                <Link to={"/"} className="text-md sm:text-xl font-bold text-[#001e1d] hover:text-[#00948d] mx-3">TDT-Football</Link>
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
                <HiOutlineBars3 className="text-[#001e1d] h-6 w-6"/>
              </button>
            </div>
        </nav>
        {/* cart drawer */}
        <CartDrawer drawerOpen={drawerOpen} toggleDrawer={toggleDrawer}/>

        {/* mobile navigation */}
        <div 
          className={`fixed top-0 left-0 w-[85%] sm:w-[350px] h-full bg-[#004643] shadow-2xl transform transition-transform duration-300 z-50 flex flex-col ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#fffffe]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#fffffe] text-sm uppercase tracking-tight">TDT Stadium</span>
            </div>
            <button 
              onClick={toggleNavDrawer} 
              className="p-2 hover:bg-[#00948d] rounded-full transition-colors"
            >
              <IoCloseOutline className="h-6 w-6 text-[#fffffe]" />
            </button>
          </div>

          {/* 2. Body của Menu (Nơi chứa các Link) */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <nav className="p-0">
              {[
                { name: "Home", link: "#" },
                { name: "Boots", link: "#" },
                { name: "Gloves", link: "#" },
                { name: "Accessories", link: "#" },
                { name: "Futsal", link: "#" },
                { name: "Booking", link: "#" },
                { name: "Academy", link: "#" },
              ].map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  onClick={toggleNavDrawer}
                  className="flex items-center justify-between px-6 py-4 text-[#fffffe] font-bold uppercase text-xs tracking-widest border-b border-[#fffffe] hover:bg-[#abd1c6] hover:text-[#004643] transition-all group"
                >
                  <span>{item.name}</span>
                  {/* Thêm icon mũi tên nhỏ bên phải giống mẫu */}
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 text-gray-300 group-hover:text-[#004643] transform group-hover:translate-x-1 transition-all" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </nav>

            {/* Footer */}
            <footer className="text-center text-xs text-[#fffffe] uppercase font-bold sticky bottom-0">
                  © 2026 TDT Stadium - Be the Best
            </footer>
          </div>
        </div>
        
    </div>
  )
}

export default NavBar