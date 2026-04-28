import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PaypalButton from "./PaypalButton";
import { fetchAddresses } from "../../redux/slices/addressSlice";
import { clearCart } from "../../redux/slices/cartSlice";

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cart } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);
    const { addresses } = useSelector((state) => state.address);
    
    const [checkoutId, setCheckoutId] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [useNewAddress, setUseNewAddress] = useState(false);
    const [shippingAddress, setShippingAddress] = useState({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: "",
    });

    // Redirect if not logged in
    useEffect(() => {
        if (!userInfo) {
            toast.error("Please login to checkout");
            navigate("/auth");
        }
    }, [userInfo, navigate]);

    // Redirect if cart is empty
    useEffect(() => {
        if (!cart?.products || cart.products.length === 0) {
            toast.error("Your cart is empty");
            navigate("/");
        }
    }, [cart, navigate]);

    // Fetch saved addresses
    useEffect(() => {
        if (userInfo) {
            dispatch(fetchAddresses());
        }
    }, [dispatch, userInfo]);

    // Auto-select default address
    useEffect(() => {
        if (addresses.length > 0 && !selectedAddressId) {
            const defaultAddress = addresses.find(addr => addr.isDefault);
            if (defaultAddress) {
                setSelectedAddressId(defaultAddress._id);
            } else {
                setSelectedAddressId(addresses[0]._id);
            }
        }
    }, [addresses, selectedAddressId]);

    const getSelectedAddress = () => {
        if (useNewAddress) {
            return shippingAddress;
        }
        const selected = addresses.find(addr => addr._id === selectedAddressId);
        return selected || shippingAddress;
    };

    const handleCreateCheckout = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            const addressToUse = getSelectedAddress();
            
            // Validate address
            if (!addressToUse.firstName || !addressToUse.address || !addressToUse.city) {
                toast.error("Please fill in all address fields");
                setIsProcessing(false);
                return;
            }
            
            if (!cart.products || cart.products.length === 0) {
                toast.error("Your cart is empty");
                setIsProcessing(false);
                return;
            }
            
            const invalidProducts = cart.products.filter(item => {
                return !item.productId || !item.name || item.price === undefined || item.price === null;
            });
            
            if (invalidProducts.length > 0) {
                toast.error("Some products in your cart are missing required information. Please refresh and try again.");
                setIsProcessing(false);
                return;
            }

            // Prepare checkout data
            const checkoutData = {
                checkoutItems: cart.products.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    image: item.image || "",
                    price: Number(item.price),
                    size: item.size || "",
                    color: item.color || "",
                    quantity: Number(item.quantity)
                })),
                shippingAddress: {
                    address: `${addressToUse.firstName} ${addressToUse.lastName}, ${addressToUse.address}`,
                    city: addressToUse.city,
                    postalCode: addressToUse.postalCode,
                    country: addressToUse.country,
                    phone: addressToUse.phone
                },
                paymentMethod: "PayPal",
                totalPrice: Number(total)
            };

            const token = JSON.parse(localStorage.getItem("userToken"));
            
            if (!token) {
                toast.error("Please login to continue");
                navigate("/auth");
                return;
            }
            
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
                checkoutData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            setCheckoutId(response.data._id);
            toast.success("Checkout created! Proceed to payment.");
        } catch (error) {
            console.error("Error creating checkout:", error);
            console.error("Error response:", error.response?.data);
            console.error("Error status:", error.response?.status);
            
            const errorMessage = error.response?.data?.message || "Failed to create checkout";
            toast.error(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePaymentSuccess = async (details) => {
        if (!checkoutId) {
            toast.error("Checkout session not found. Please try again.");
            return;
        }
        
        try {
            const token = JSON.parse(localStorage.getItem("userToken"));
            
            if (!token) {
                toast.error("Authentication required. Please login again.");
                navigate("/auth");
                return;
            }
            
            // Update checkout as paid
            const payResponse = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
                {
                    paymentStatus: "Paid",
                    paymentDetails: details
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            if (!payResponse.data || !payResponse.data.checkout) {
                throw new Error("Invalid response from payment update");
            }

            // Finalize the order
            const orderResponse = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            if (!orderResponse.data || !orderResponse.data._id) {
                throw new Error("Invalid response from order finalization");
            }
            
            toast.success("Payment successful! Order created.");
            
            // Navigate to order confirmation
            navigate(`/order-confirmation/${orderResponse.data._id}`);
            
            // Clear the cart after navigation (with small delay)
            setTimeout(() => {
                dispatch(clearCart());
            }, 100);
            
        } catch (error) {
            console.error("Error processing payment:", error);
            const errorMessage = error.response?.data?.message || error.message || "Payment processing failed";
            toast.error(errorMessage);
        }
    };

    const handlePaymentError = (error) => {
        console.error("Payment error:", error);
        toast.error("Payment failed. Please try again.");
    };

    if (!cart?.products || cart.products.length === 0) {
        return null;
    }

    const subtotal = cart.totalPrice || 0;
    const shippingFee = subtotal > 100 ? 0 : 10;
    const total = subtotal + shippingFee;

    const paypalOptions = {
        "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "capture"
    };

    return (
        <PayPalScriptProvider options={paypalOptions}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
            {/* Left side - Shipping Form */}
            <div className="rounded-lg p-6">
                <h2 className="text-2xl uppercase text-[#001e1d] font-bold">Checkout</h2>
                <form onSubmit={handleCreateCheckout}>
                    <h3 className="text-lg text-[#001e1d]">Contact Detail</h3>
                    <div className="mb-6">
                        <label className="block text-[#001e1d]">Email</label>
                        <input
                            type="email"
                            value={userInfo?.email || ""}
                            className="w-full p-2 border rounded text-[#004643]"
                            disabled
                        />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-2 text-[#001e1d]">Delivery Address</h3>
                    
                    {/* Saved Addresses */}
                    {addresses.length > 0 && (
                        <div>
                            <label className="block text-[#001e1d] font-medium mb-2">Select Saved Address</label>
                            <div className="space-y-2 mb-4">
                                {addresses.map((addr) => (
                                    <div
                                        key={addr._id}
                                        onClick={() => {
                                            setSelectedAddressId(addr._id);
                                            setUseNewAddress(false);
                                        }}
                                        className={`p-3 shadow-md rounded cursor-pointer transition-all ${
                                            selectedAddressId === addr._id && !useNewAddress
                                                ? "bg-[#004643]"
                                                : " bg-[#004643]/60"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <span className="inline-block bg-[#abd1c6] text-[#001e1d] text-xs px-2 py-1 rounded font-medium mb-1">
                                                    {addr.label}
                                                </span>
                                                {addr.isDefault && (
                                                    <span className="inline-block bg-[#abd1c6] text-[#001e1d] text-xs px-2 py-1 rounded font-bold ml-2">
                                                        DEFAULT
                                                    </span>
                                                )}
                                                <p className="font-medium text-[#fffffe]">
                                                    {addr.firstName} {addr.lastName}
                                                </p>
                                                <p className="text-sm text-[#abd1c6]">{addr.address}</p>
                                                <p className="text-sm text-[#abd1c6]">
                                                    {addr.city}, {addr.postalCode}, {addr.country}
                                                </p>
                                                <p className="text-sm text-[#abd1c6]">Phone: {addr.phone}</p>
                                            </div>
                                            <input
                                                type="radio"
                                                name="selectedAddress"
                                                checked={selectedAddressId === addr._id && !useNewAddress}
                                                onChange={() => {}}
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <button
                                type="button"
                                onClick={() => setUseNewAddress(!useNewAddress)}
                                className="text-[#004643] hover:font-bold hover:scale-110 font-medium text-sm underline"
                            >
                                {useNewAddress ? "Use saved address" : "+ Use a different address"}
                            </button>
                        </div>
                    )}
                    
                    {/* Manual Address Form */}
                    {(useNewAddress || addresses.length === 0) && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[#001e1d]">First Name</label>
                                    <input
                                        type="text"
                                        value={shippingAddress.firstName}
                                        onChange={(e) =>
                                            setShippingAddress({
                                                ...shippingAddress,
                                                firstName: e.target.value,
                                            })
                                        }
                                        className="w-full p-2 border rounded text-[#004643] placeholder:text-[#004643]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[#001e1d]">Last Name</label>
                                    <input
                                        type="text"
                                        value={shippingAddress.lastName}
                                        onChange={(e) =>
                                            setShippingAddress({
                                                ...shippingAddress,
                                                lastName: e.target.value,
                                            })
                                        }
                                        className="w-full p-2 border rounded text-[#004643] placeholder:text-[#004643]"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-[#001e1d]">Address</label>
                                <input
                                    type="text"
                                    value={shippingAddress.address}
                                    onChange={(e) =>
                                        setShippingAddress({
                                            ...shippingAddress,
                                            address: e.target.value,
                                        })
                                    }
                                    className="w-full p-2 border rounded text-[#004643] placeholder:text-[#004643]"
                                    required
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[#001e1d]">City</label>
                                    <input
                                        type="text"
                                        value={shippingAddress.city}
                                        onChange={(e) =>
                                            setShippingAddress({
                                                ...shippingAddress,
                                                city: e.target.value,
                                            })
                                        }
                                        className="w-full p-2 border rounded text-[#004643] placeholder:text-[#004643]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[#001e1d]">Postal Code</label>
                                    <input
                                        type="text"
                                        value={shippingAddress.postalCode}
                                        onChange={(e) =>
                                            setShippingAddress({
                                                ...shippingAddress,
                                                postalCode: e.target.value,
                                            })
                                        }
                                        className="w-full p-2 border rounded text-[#004643] placeholder:text-[#004643]"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-[#001e1d]">Country</label>
                                <input
                                    type="text"
                                    value={shippingAddress.country}
                                    onChange={(e) =>
                                        setShippingAddress({
                                            ...shippingAddress,
                                            country: e.target.value,
                                        })
                                    }
                                    className="w-full p-2 border rounded text-[#004643] placeholder:text-[#004643]"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-[#001e1d]">Phone</label>
                                <input
                                    type="tel"
                                    value={shippingAddress.phone}
                                    onChange={(e) =>
                                        setShippingAddress({
                                            ...shippingAddress,
                                            phone: e.target.value,
                                        })
                                    }
                                    className="w-full p-2 border rounded text-[#004643] placeholder:text-[#004643]"
                                    required
                                />
                            </div>
                        </div>
                    )}
                    
                    <div className="mt-6">
                        {!checkoutId ? (
                            <button 
                                type="submit" 
                                disabled={isProcessing}
                                className={`w-full font-bold py-3 rounded transition ${
                                    isProcessing
                                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                        : 'bg-[#f9bc60] text-[#001e1d] hover:scale-110'
                                }`}
                            >
                                {isProcessing ? "Processing..." : "Continue to Payment"}
                            </button>
                        ) : (
                            <div>
                                <h3 className="text-lg mb-4 text-[#001e1d]">Pay with PayPal</h3>
                                <PaypalButton 
                                    amount={total} 
                                    onSuccess={handlePaymentSuccess} 
                                    onError={handlePaymentError}
                                />
                            </div>
                        )}
                    </div>
                </form>
            </div>
            
            {/* Right side - Order Summary */}
            <div className="bg-[#004643] p-6 rounded-lg h-fit sticky top-4">
                <h3 className="text-2xl mb-4 text-[#fffffe] font-bold">Order Summary</h3>
                <div className="border-t border-[#fffffe] mb-2">
                    {cart.products.map((item, index) => (
                        <div key={`${item.productId}-${item.size}-${item.color}-${index}`} className="flex items-start justify-between py-2 border-b border-[#fffffe]">
                            <div className="flex items-start gap-4">
                                <img 
                                    src={item.image || '/placeholder-product.jpg'} 
                                    alt={item.name} 
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <div>
                                    <h3 className="text-md text-[#fffffe]">{item.name}</h3>
                                    {item.size && <p className="text-sm text-[#abd1c6]">Size: {item.size}</p>}
                                    {item.color && <p className="text-sm text-[#abd1c6]">Color: {item.color}</p>}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="bg-[#abd1c6] p-1 rounded text-sm text-[#004643] mb-2">
                                    x {item.quantity}
                                </p>
                                <p className="text-md text-[#fffffe]">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="flex justify-between items-center text-md text-[#abd1c6] mt-4">
                    <p>Subtotal</p>
                    <p>${subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center text-md py-2 text-[#abd1c6]">
                    <p>Shipping</p>
                    <p>{shippingFee === 0 ? "Free" : `$${shippingFee.toFixed(2)}`}</p>
                </div>
                <div className="flex justify-between items-center text-lg border-t pt-4 border-[#fffffe] text-[#fffffe]">
                    <p className="font-bold">Total</p>
                    <p className="font-bold">${total.toFixed(2)}</p>
                </div>
            </div>
        </div>
        </PayPalScriptProvider>
    );
};

export default Checkout;
