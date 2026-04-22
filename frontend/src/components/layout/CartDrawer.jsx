import { useNavigate } from "react-router-dom";
import CartItems from "../cart/CartItems";
import { IoCloseOutline } from "react-icons/io5";

const CartDrawer = ({drawerOpen, toggleDrawer}) => {
    const navigate = useNavigate();
    const handleCheckout = () => {
        toggleDrawer();
        navigate("/checkout");
    }
    
  return (
    <>
      {/* Backdrop for closing when clicking outside */}
      {drawerOpen && (
        <div 
            className="fixed inset-0 bg-opacity-50 z-40"
            onClick={toggleDrawer}
        ></div>
      )}
    <div className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem] h-full bg-[#004643]
    shadow-lg transform transition-transform duration-300 flex flex-col z-50 
    ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}>
        {/* close button  */}
        <div className="flex justify-end p-4">
            <button onClick={toggleDrawer}>
                <IoCloseOutline className="h-6 w-6 text-[#fffffe] hover:text-[#abd1c6]"/>
            </button>
        </div>
        {/* Cart content */}
        <div className="flex-grow p-4 overflow-y-auto">
            <h2 className="text-xl font-semibold text-[#fffffe] mb-4">
                Your Cart
            </h2>
            {/* Cart items will go here. */}
            <CartItems/>
        </div>
        {/* Checkout button */}
        <div className="p-4 sticky bottom-0">
            <button onClick={handleCheckout} className="w-full bg-[#f9bc60] text-[#001e1d] py-3 rounded-lg font-semibold hover:bg-[#abd1c6] transition">Checkout</button>
            <p className="text-sm tracking-tighter text-[#abd1c6] mt-2 text-center">Shipping, taxes, and discount code calculated at checkpoint</p>

        </div>
    </div>
    </>
  )
}

export default CartDrawer