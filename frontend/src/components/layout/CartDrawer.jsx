import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CartItems from "../cart/CartItems";
import { IoCloseOutline } from "react-icons/io5";
import { fetchCart } from "../../redux/slices/cartSlice";

const CartDrawer = ({drawerOpen, toggleDrawer}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cart } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);
    
    // Fetch cart when drawer opens
    useEffect(() => {
        if (drawerOpen) {
            const userId = userInfo?._id;
            let guestId = localStorage.getItem("guestId");
            
            if (!userId && !guestId) {
                guestId = "guest_" + new Date().getTime();
                localStorage.setItem("guestId", guestId);
            }
            
            if (userId || guestId) {
                dispatch(fetchCart({ userId, guestId }));
            }
        }
    }, [drawerOpen, dispatch, userInfo]);
    
    const handleCheckout = () => {
        if (!cart?.products || cart.products.length === 0) {
            return;
        }
        toggleDrawer();
        navigate("/checkout");
    }
    
  return (
    <>
      {/* Backdrop for closing when clicking outside */}
      {drawerOpen && (
        <div 
            className="fixed inset-0 z-40"
            onClick={toggleDrawer}
        ></div>
      )}
    <div className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem] h-full bg-[#004643]
    shadow-lg transform transition-transform duration-300 flex flex-col z-50 
    ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}>
        {/* close button  */}
        <div className="flex justify-end p-4">
            <button onClick={toggleDrawer}>
                <IoCloseOutline className="h-10 w-10 text-[#fffffe] hover:text-[#abd1c6]"/>
            </button>
        </div>
        {/* Cart content */}
        <div className="flex-grow p-4 overflow-y-auto">
            <h2 className="text-xl font-semibold text-[#fffffe] mb-4">
                Your Cart
            </h2>
            <CartItems/>
        </div>
        {/* Checkout button */}
        <div className="p-4 sticky bottom-0 bg-[#004643] border-t border-[#abd1c6]">
            <button 
                onClick={handleCheckout} 
                disabled={!cart?.products || cart.products.length === 0}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                    cart?.products && cart.products.length > 0
                        ? 'bg-[#f9bc60] text-[#001e1d] hover:bg-[#abd1c6]'
                        : 'bg-[#e8e4e6]/80 text-[#e8e4e6] cursor-not-allowed'
                }`}
            >
                Checkout
            </button>
            <p className="text-sm tracking-tighter text-[#abd1c6] mt-2 text-center">
                Shipping, taxes, and discount code calculated at checkout
            </p>
        </div>
    </div>
    </>
  )
}

export default CartDrawer