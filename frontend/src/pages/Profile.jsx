import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { logout } from "../redux/slices/authSlice";
import { clearCart } from "../redux/slices/cartSlice";
import MyOrderPage from "./MyOrderPage"

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (!userInfo) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
        <div className="flex-grow container mx-auto p-4 md:p-6">
            <div className="flex flex-col md:flex-row space-y-6 md:space-x-6 md:space-y-0 md:items-start">
                {/* Left Section */}
                <div className="w-full md:w-1/3 lg:w-1/4 rounded-lg p-6 text-[#fffffe] bg-[#004643] md:sticky md:top-4 self-start">
                    <h1 className="text-2xl md:text-3xl font-bold mb-4">{userInfo.username}</h1>
                    <p className="text-lg mb-2">{userInfo.email}</p>
                    {userInfo.role === "admin" && (
                        <span className="inline-block bg-[#f9bc60] text-[#001e1d] text-xs px-2 py-1 rounded font-bold mb-4">
                            ADMIN
                        </span>
                    )}
                    
                    <div className="mt-6 space-y-2">
                        <Link
                            to="/my-addresses"
                            className="block w-full bg-[#abd1c6] text-[#001e1d] py-2 px-4 rounded-lg hover:scale-105 transition-transform text-center font-medium"
                        >
                            My Addresses
                        </Link>
                        <button 
                            onClick={handleLogout}
                            className="w-full bg-[#e16162] py-2 px-4 rounded-lg hover:scale-105 transition-transform"
                        >
                            Logout
                        </button>
                    </div>
                </div>
                {/* Right Section: Order table */}
                <div className="w-full md:w-2/3 lg:w-3/4">
                    <MyOrderPage/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Profile