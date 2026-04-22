import { useState } from "react";
import { FaBars } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const toggleSidebar = () => {
setIsSidebarOpen(!isSidebarOpen);
};
return (
<div className="min-h-screen flex flex-col md:flex-row relative">
    {/* Mobile toggle */}
    <div className="flex md:hidden p-4 bg-[#004643] z-20 text-[#fffffe]">
    <button onClick={toggleSidebar}>
        <FaBars size={24} />
    </button>
    <h1 className="ml-4 text-xl font-medium">Admin Dashboard</h1>
    </div>
    {/* Overlay for mobile */}
    {isSidebarOpen && (
    <div
        className="fixed inset-0 bg-[#004643] opacity-50 z-10 md:hidden"
        onClick={toggleSidebar}
    ></div>
    )}
    {/* Side bar */}
    <div
    className={`bg-[#004643] w-64 min-h-screen text-[#fffffe] absolute md:relative transform
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        transition-transform duration-300 md:translate-x-0 md:static md:block z-20`}
    >
        {/* Sidebar */}
        <AdminSidebar/>
    </div>
</div>
);
};

export default AdminLayout;
