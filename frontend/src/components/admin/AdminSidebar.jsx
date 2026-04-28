import React from 'react'
import { FaUser, FaChevronRight, FaBoxOpen, FaClipboardList, FaStore, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa'
import { Link, NavLink, useNavigate } from 'react-router-dom'

const AdminSidebar = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        navigate("/");
    }
  return (
    <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 pt-6 mb-4 border-[#fffffe]">
            <div className="flex items-center gap-2">
                <Link to="/admin" className="font-bold text-[#fffffe] text-sm uppercase tracking-tight">
                    TDT Stadium - Admin
                </Link>
            </div>
        </div>

        {/* Menu body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            <nav className="p-0">
                <NavLink 
                    to="/admin" 
                    end
                    className={({isActive}) => `flex items-center justify-between px-6 py-4 font-bold uppercase text-xs tracking-widest border-[#fffffe] transition-all group ${isActive ? "bg-[#abd1c6] text-[#004643]" : "text-[#fffffe] hover:bg-[#abd1c6] hover:text-[#004643]"}`}>
                    {({isActive}) => (
                        <div className="flex justify-between items-center w-full">
                            <div className="flex items-center space-x-2">
                                <FaTachometerAlt className="h-4 w-4"/>
                                <span>Dashboard</span>
                            </div>
                            {/* Arrow icon */}
                            <button 
                                className={`h-4 w-4 text-xl transform transition-all ${isActive ? "text-[#004643] translate-x-1" : "text-[#fffffe] group-hover:text-[#004643] group-hover:translate-x-1"}`}
                            >
                                <FaChevronRight/>
                            </button>
                        </div>
                        )}
                </NavLink>
                <NavLink 
                    to="/admin/users" 
                    className={({isActive}) => `flex items-center justify-between px-6 py-4 font-bold uppercase text-xs tracking-widest border-[#fffffe] transition-all group ${isActive ? "bg-[#abd1c6] text-[#004643]" : "text-[#fffffe] hover:bg-[#abd1c6] hover:text-[#004643]"}`}>
                    {({isActive}) => (
                        <div className="flex justify-between items-center w-full">
                            <div className="flex items-center space-x-2">
                                <FaUser className="h-4 w-4"/>
                                <span>Users</span>
                            </div>
                            {/* Arrow icon */}
                            <button 
                                className={`h-4 w-4 text-xl transform transition-all ${isActive ? "text-[#004643] translate-x-1" : "text-[#fffffe] group-hover:text-[#004643] group-hover:translate-x-1"}`}
                            >
                                <FaChevronRight/>
                            </button>
                        </div>
                        )}
                </NavLink>
                <NavLink 
                    to="/admin/products" 
                    className={({isActive}) => `flex items-center justify-between px-6 py-4 font-bold uppercase text-xs tracking-widest border-[#fffffe] transition-all group ${isActive ? "bg-[#abd1c6] text-[#004643]" : "text-[#fffffe] hover:bg-[#abd1c6] hover:text-[#004643]"}`}>
                    {({isActive}) => (
                        <div className="flex justify-between items-center w-full">
                            <div className="flex items-center space-x-2">
                                <FaBoxOpen className="h-4 w-4"/>
                                <span>Products</span>
                            </div>
                            {/* Arrow icon */}
                            <button 
                                className={`h-4 w-4 text-xl transform transition-all ${isActive ? "text-[#004643] translate-x-1" : "text-[#fffffe] group-hover:text-[#004643] group-hover:translate-x-1"}`}
                            >
                                <FaChevronRight/>
                            </button>
                        </div>
                        )}
                </NavLink>
                <NavLink 
                    to="/admin/orders" 
                    className={({isActive}) => `flex items-center justify-between px-6 py-4 font-bold uppercase text-xs tracking-widest border-[#fffffe] transition-all group ${isActive ? "bg-[#abd1c6] text-[#004643]" : "text-[#fffffe] hover:bg-[#abd1c6] hover:text-[#004643]"}`}>
                    {({isActive}) => (
                        <div className="flex justify-between items-center w-full">
                            <div className="flex items-center space-x-2">
                                <FaClipboardList className="h-4 w-4"/>
                                <span>Orders</span>
                            </div>
                            {/* Arrow icon */}
                            <button 
                                className={`h-4 w-4 text-xl transform transition-all ${isActive ? "text-[#004643] translate-x-1" : "text-[#fffffe] group-hover:text-[#004643] group-hover:translate-x-1"}`}
                            >
                                <FaChevronRight/>
                            </button>
                        </div>
                        )}
                </NavLink>
                <NavLink 
                    to="/" 
                    className={({isActive}) => `flex items-center justify-between px-6 py-4 font-bold uppercase text-xs tracking-widest border-[#fffffe] transition-all group ${isActive ? "bg-[#abd1c6] text-[#004643]" : "text-[#fffffe] hover:bg-[#abd1c6] hover:text-[#004643]"}`}>
                    {({isActive}) => (
                        <div className="flex justify-between items-center w-full">
                            <div className="flex items-center space-x-2">
                                <FaStore className="h-4 w-4"/>
                                <span>Shop</span>
                            </div>
                            {/* Arrow icon */}
                            <button 
                                className={`h-4 w-4 text-xl transform transition-all ${isActive ? "text-[#004643] translate-x-1" : "text-[#fffffe] group-hover:text-[#004643] group-hover:translate-x-1"}`}
                            >
                                <FaChevronRight/>
                            </button>
                        </div>
                        )}
                </NavLink>    
            </nav>
            {/* Logout button */}
            <div className="mt-6 px-6">
                <button onClick={handleLogout} className="w-full bg-[#e16162] text-[#fffffe] hover:scale-105 py-2 px-4 flex items-center
                rounded justify-center space-x-2">
                    <FaSignOutAlt/>
                    <span>Log Out</span>
                </button>
            </div>
            {/* Footer */}
            <footer className="text-center text-xs text-[#fffffe] mt-4 uppercase font-bold pb-4">
                © 2026 TDT Stadium - Be the Best
            </footer>
        </div>
    </div>
)
}

export default AdminSidebar