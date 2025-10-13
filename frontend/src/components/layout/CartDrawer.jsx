import { FaTimes } from "react-icons/fa";
import CartItems from "../cart/CartItems";

const CartDrawer = ({drawerOpen, toggleDrawer}) => {
    
  return (
    <div className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem] h-full bg-[#004643]
    shadow-lg transform transition-transform duration-300 flex flex-col z-50 
    ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}>
        {/* close button  */}
        <div className="flex justify-end p-4">
            <button onClick={toggleDrawer}>
                <FaTimes className="h-6 w-6 text-[#abd1c6]"/>
            </button>
        </div>
        {/* Cart content */}
        <div className="flex-grow p-4 overflow-y-auto">
            <h2 className="text-xl font-semibold text-[#abd1c6] mb-4">
                Your Cart
            </h2>
            {/* Cart items will go here. */}
            <CartItems/>
        </div>
        {/* Checkout button */}
        <div className="p-4 sticky bottom-0">
            <button className="w-full bg-[#f9bc60] text-[#004643] py-3 rounded-lg font-semibold hover:bg-[#a47733] transition">Checkout</button>
            <p className="text-sm tracking-tighter text-[#abd1c6] mt-2 text-center">Shipping, taxes, and discount code calculated at checkpoint</p>

        </div>
    </div>
  )
}

export default CartDrawer