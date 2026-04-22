import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PaypalButton from "./PaypalButton";
import adidasF50 from "../../assets/Most Popular/boots/bota-adidas-f50-elite-ag-purple.jpg";


const Checkout = () => {
const CartItems = {
    cartProducts: [
    {
        productId: 1,
        name: "Nike Mercurial Vapor 14 Elite FG",
        size: 41,
        color: "Red",
        price: 250,
        quantity: 1,
        image: adidasF50,
    },
    {
        productId: 2,
        name: "Nike Mercurial Vapor 14 Elite FG",
        size: 41,
        color: "Blue",
        price: 250,
        quantity: 1,
        image: adidasF50,
    },
    ],
};

const navigate = useNavigate();
const [checkoutId, setCheckoutId] = useState(null);
const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
});
const handleCreateCheckout = (e) => {
    e.preventDefault();
    setCheckoutId("mock_checkout_id_12345");
}
const handlePaymentSuccess = (details) => {
    console.log("Payment Successful", details)
    navigate("/order-confirmation");
}

const subtotal = CartItems.cartProducts.reduce((acc, item) => acc + item.price * item.quantity, 0);
const shippingFee = subtotal > 100 ? 0 : 10 * CartItems.cartProducts.reduce((acc, item) => acc + item.quantity, 0);
const total = subtotal + shippingFee;

return (
    <div
    className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6
    tracking-tighter"
    >
    {/* left side*/}
    <div className="rounded-lg p-6 ">
        <h2 className="text-2xl uppercase mb-6 text-[#001e1d] font-bold">Checkout</h2>
        <form onSubmit={handleCreateCheckout}>
            <h3 className="text-lg mb-4 text-[#001e1d]">Contact Detail</h3>
            <div className="mb-4">
            <label className=" block text-[#001e1d]">Email</label>
        <input
                type="email"
                value="user@example.com"
                className="w-full p-2 border rounded"
                disabled
            />
            </div>
            <h3 className="text-lg mb-4 text-[#001e1d]">Delivery</h3>
            <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                <label className=" block text-[#001e1d]">First Name</label>
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
                <label className=" block text-[#001e1d]">Last Name</label>
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
            <div className="mb-4">
                <label className=" block text-[#001e1d]">Address</label>
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
            <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                <label className=" block text-[#001e1d]">City</label>
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
                <label className=" block text-[#001e1d]">Postal Code</label>
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
                />
                </div>
            </div>
            <div className="mb-4">
                <label className=" block text-[#001e1d]">Country</label>
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
            <div className="mb-4">
                <label className=" block text-[#001e1d]">Phone</label>
                <input
                type="text"
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
            <div className="mt-6">
                {!checkoutId?(
                    <button type="submit" className="w-full font-bold bg-[#f9bc60] py-3 rounded text-[#001e1d] hover:bg-[#004643] hover:text-[#fffffe]">Continue to Payment</button>
                ):(
                    <div>
                        <h3 className="text-lg mb-4 text-[#001e1d]">Pay with Paypal</h3>
                        {/* Paypal Component */}
                        <PaypalButton amount={total} onSuccess={handlePaymentSuccess} onError={(err)=> alert("Payment Failed. Try agian!")}/>
                    </div>
                )}
            </div>
        </form>
    </div>
    {/* right side */}
    <div className="bg-[#004643] p-6 rounded-lg">
        <h3 className="text-2xl mb-4 text-[#fffffe] font-bold">Order Summary</h3>
        <div className="border-t  border-[#fffffe] mb-2">
            {CartItems.cartProducts.map((item,index)=>(
                <div key={index} className="flex items-start justify-between py-2 border-b border-[#fffffe]">
                    <div className="flex items-start gap-4">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded mr-4"/>
                        <div>
                            <h3 className="text-md text-[#fffffe]">{item.name}</h3>
                            <p className="text-sm text-[#abd1c6]">Size: {item.size}</p>
                            <p className="text-sm text-[#abd1c6]">Color: {item.color}</p>
                        </div>
                    </div>
                    <p className=" bg-[#abd1c6] p-1 rounded text-sm text-[#004643]">x {item.quantity}</p>
                    <p className="text-md text-[#fffffe]">${item.price?.toLocaleString()}</p>
                </div>
            ))}
        </div>
        <div className="flex justify-between items-center text-md text-[#abd1c6]">
            <p>Subtotal</p>
            <p>${subtotal.toLocaleString()}</p>
        </div>
        <div className="flex justify-between items-center text-md py-2 text-[#abd1c6]">
            <p>Shipping</p>
            <p>{shippingFee === 0 ? "Free" : `$${shippingFee.toLocaleString()}`}</p>
        </div>
        <div className="flex justify-between items-center text-lg border-t pt-4 border-[#fffffe] text-[#fffffe]">
            <p>Total</p>
            <p>${total.toLocaleString()}</p>
        </div>
    </div>
    </div>
);
};

export default Checkout;
