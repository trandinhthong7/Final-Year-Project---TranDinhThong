import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBin5Line } from "react-icons/ri"
import { updateCartItem, removeFromCart } from "../../redux/slices/cartSlice";

const CartItems = () => {
    const dispatch = useDispatch();
    const { cart, loading } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);
    
    // Get user ID or guest ID
    const getUserOrGuestId = () => {
        if (userInfo?._id) {
            return { userId: userInfo._id };
        }
        let guestId = localStorage.getItem("guestId");
        if (!guestId) {
            guestId = "guest_" + new Date().getTime();
            localStorage.setItem("guestId", guestId);
        }
        return { guestId };
    };

    const updateQuantity = (productId, size, color, currentQuantity, delta) => {
        const newQuantity = Math.max(1, currentQuantity + delta);
        const ids = getUserOrGuestId();
        
        dispatch(updateCartItem({
            productId,
            quantity: newQuantity,
            size,
            color,
            ...ids
        }));
    };

    const removeItem = (productId, size, color) => {
        const ids = getUserOrGuestId();
        
        dispatch(removeFromCart({
            productId,
            size,
            color,
            ...ids
        }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-[#fffffe]">Loading cart...</div>
            </div>
        );
    }

    if (!cart?.products || cart.products.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-[#abd1c6] text-lg">Your cart is empty</p>
                <p className="text-[#93aaa3] text-sm mt-2">Add some products to get started!</p>
            </div>
        );
    }

  return (
    <div>
        {cart.products.map((product, index)=>(
            <div key={`${product.productId}-${product.size}-${product.color}-${index}`} className="flex items-start justify-between py-4 border-b border-[#abd1c6]">
                <div className="flex items-start">
                    <img 
                        src={product.image || '/placeholder-product.jpg'} 
                        alt={product.name} 
                        className="w-20 h-24 object-cover mr-4 rounded"
                    />
                    <div className="text-[#fffffe]">
                        <h3 className="text-sm font-medium">{product.name}</h3>
                        <p className="text-sm text-[#93aaa3] mt-1">
                            {product.size && `Size: ${product.size}`}
                            {product.size && product.color && ' | '}
                            {product.color && `Color: ${product.color}`}
                        </p>
                        <div className="flex items-center mt-2">
                            <button 
                                onClick={() => updateQuantity(product.productId, product.size, product.color, product.quantity, -1)} 
                                className="border border-[#abd1c6] rounded px-2 py-1 text-xl font-medium hover:bg-[#abd1c6] hover:text-[#001e1d] transition-colors"
                                disabled={loading}
                            >
                                -
                            </button>
                            <span className="mx-4 text-lg">{product.quantity}</span>
                            <button 
                                onClick={() => updateQuantity(product.productId, product.size, product.color, product.quantity, 1)} 
                                className="border border-[#abd1c6] rounded px-2 py-1 text-xl font-medium hover:bg-[#abd1c6] hover:text-[#001e1d] transition-colors"
                                disabled={loading}
                            >
                                +
                            </button>
                        </div> 
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <p className="font-medium text-[#fffffe]">
                        ${(product.price * product.quantity).toFixed(2)}
                    </p>
                    <button 
                        onClick={() => removeItem(product.productId, product.size, product.color)}
                        disabled={loading}
                        className="mt-4 hover:scale-110 transition-transform"
                    >
                        <RiDeleteBin5Line className="h-6 w-6 text-[#e16162] hover:text-red-500"/>
                    </button>
                </div>
            </div>
        ))}
        
        {/* Cart Total */}
        <div className="mt-6 ">
            <div className="flex justify-between items-center">
                <span className="text-[#fffffe] text-lg font-semibold">Subtotal:</span>
                <span className="text-[#fffffe] text-lg font-semibold">
                    ${cart.totalPrice?.toFixed(2) || '0.00'}
                </span>
            </div>
        </div>
    </div>
  )
}

export default CartItems