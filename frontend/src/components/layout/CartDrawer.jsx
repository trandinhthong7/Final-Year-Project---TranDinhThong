import { FaTimes } from "react-icons/fa";

const CartDrawer = ({drawerOpen, toggleDrawer}) => {
    
  return (
    <div className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-1/4 h-full bg-[#fffffe]
    shadow-lg transform transition-transform duration-300 flex flex-col z-50 
    ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}>
        {/* close button  */}
        <div className="flex justify-end p-4">
            <button onClick={toggleDrawer}>
                <FaTimes className="h-6 w-6 text-[#004643]"/>
            </button>
        </div>
    </div>
  )
}

export default CartDrawer