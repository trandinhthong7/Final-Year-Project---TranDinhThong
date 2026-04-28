import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SearchBar from './SearchBar'
import CartDrawer from '../layout/CartDrawer'
import { HiOutlineBars3 } from "react-icons/hi2";
import { IoBagHandleOutline, IoCloseOutline, IoPersonOutline } from 'react-icons/io5'
import { FaChevronRight } from 'react-icons/fa';
import { fetchCart } from '../../redux/slices/cartSlice'

const NavBar = () => {
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  
  // Calculate total items in cart - this will update when cart changes
  const cartItemCount = cart?.products?.reduce((total, item) => total + item.quantity, 0) || 0;
  
  // Fetch cart on component mount and when user changes
  useEffect(() => {
    const userId = userInfo?._id;
    let guestId = localStorage.getItem("guestId");
    
    if (!userId && !guestId) {
      guestId = "guest_" + new Date().getTime();
      localStorage.setItem("guestId", guestId);
    }
    
    if (userId || guestId) {
      dispatch(fetchCart({ userId, guestId }));
    }
  }, [dispatch, userInfo]);
  
  // Also fetch cart when drawer opens to ensure it's up to date
  useEffect(() => {
    if (drawerOpen) {
      const userId = userInfo?._id;
      const guestId = localStorage.getItem("guestId");
      if (userId || guestId) {
        dispatch(fetchCart({ userId, guestId }));
      }
    }
  }, [drawerOpen, dispatch, userInfo]);
  
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
                <Link to={"/"} className="text-md sm:text-xl font-bold text-[#001e1d] hover:scale-110 mx-3">TDT-Football</Link>
            </div>
            {/* Center - Menu */}
            <div className="hidden md:flex space-x-6">
                <Link to="" className=" text-[#001e1d] hover:scale-110 text-sm font-medium uppercase">Home</Link>
                <Link to="/collections/boots" className=" text-[#001e1d] hover:scale-110 text-sm font-medium uppercase">Boots</Link>
                <Link to="/collections/gloves" className=" text-[#001e1d] hover:scale-110 text-sm font-medium uppercase">Gloves</Link>
                <Link to="/collections/accessories" className=" text-[#001e1d] hover:scale-110 text-sm font-medium uppercase">Accessories</Link>
                <Link to="/collections/booking" className=" text-[#001e1d] hover:scale-110 text-sm font-medium uppercase">Booking</Link>
                <Link to="/collections/academy" className=" text-[#00001e1d4643] hover:scale-110 text-sm font-medium uppercase">Academy</Link>
            </div>
            {/* Right - Icons */}
            <div className="flex items-center space-x-4 mx-4">
                {userInfo?.role === "admin" && (
                    <Link to="/admin" className="block bg-[#004643] text-[#fffffe] text-sm px-2 py-1 rounded hover:scale-110 transition-transform font-medium">
                        Admin
                    </Link>
                )}
                {userInfo ? (
                    <Link to="/profile" className="flex items-center gap-2 hover:scale-105 transition-transform">
                        <IoPersonOutline className="text-[#001e1d] h-6 w-6"/>
                        <span className="hidden sm:inline text-[#001e1d] text-sm font-medium">
                            {userInfo.username}
                        </span>
                    </Link>
                ) : (
                    <Link to="/auth" className="bg-[#f9bc60] text-[#001e1d] text-sm px-3 py-1 rounded hover:bg-[#004643] hover:text-[#fffffe] transition-colors font-medium">
                        Login
                    </Link>
                )}
                <button onClick={toggleDrawer} className="relative">
                  <IoBagHandleOutline className="text-[#001e1d] hover:scale-110 h-6 w-6"/>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2.5 -right-3 bg-[#001e1d] text-[#abd1c6] text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                      {cartItemCount}
                    </span>
                  )}
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
          <div className="flex items-center justify-between p-4 border-[#fffffe]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#fffffe] text-sm uppercase tracking-tight">TDT Stadium</span>
            </div>
            <button 
              onClick={toggleNavDrawer} 
              className="p-2 hover:scale-110 rounded-full transition-colors"
            >
              <IoCloseOutline className="h-6 w-6 text-[#fffffe]" />
            </button>
          </div>

          {/* Menu body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <nav className="p-0">
              {[
                { name: "Home", link: "" },
                { name: "Boots", link: "collections/boots" },
                { name: "Gloves", link: "#" },
                { name: "Accessories", link: "#" },
                { name: "Booking", link: "#" },
                { name: "Academy", link: "#" },
              ].map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  onClick={toggleNavDrawer}
                  className="flex items-center justify-between px-6 py-4 text-[#fffffe] font-bold uppercase text-xs tracking-widest border-[#fffffe] hover:bg-[#abd1c6] hover:text-[#004643] transition-all group"
                >
                  <span>{item.name}</span>
                  {/* Arrow icon  */}
                  <button 
                    className="h-4 w-4 text-[#fffffe] text-xl  group-hover:text-[#004643] transform group-hover:translate-x-1 transition-all" 
                  >
                    <FaChevronRight/>
                  </button>
                </Link>
              ))}
            </nav>
            {/* Footer */}
            <footer className="text-center text-xs text-[#fffffe] mt-4 uppercase font-bold">
                  © 2026 TDT Stadium - Be the Best
            </footer>
          </div>
        </div>
        
    </div>
  )
}

export default NavBar