import { Link } from "react-router-dom";
import adidasF50 from "../assets/Most Popular/boots/bota-adidas-f50-elite-ag-purple.jpg";

const checkout={
    id: "mock_checkout_id_12345",
    createdAt: new Date(),
    checkoutItems:[
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
        color: "Red",
        price: 250,
        quantity: 1,
        image: adidasF50,
    },
    ],
    shippingAddress: {
        address: "123 Main St",
        city: "Anytown",
        postalCode: "12345",
        country: "USA",
    }
}
const OrderConfirmationPage = () => {
const calculatedRestimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 7); // 5 to 7 days
    return orderDate.toLocaleDateString();
}

const subtotal = checkout.checkoutItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
const shippingFee = subtotal > 100 ? 0 : 10*checkout.checkoutItems.reduce((acc, item) => acc + item.quantity, 0); // $10 per item if subtotal <= 100
const total = subtotal + shippingFee;

  return (
    <div className="max-w-4xl mx-auto p-6 my-5 rounded-lg">
        <h1 className="text-4xl font-bold text-center text-[#001e1d] mb-8">
            Thank You for Your Order!
        </h1>

        {checkout && (
        <div className="p-6 rounded-lg bg-[#004643]">
            <div className="flex justify-between mb-20">
                {/* Order ID and Date */}
                <div>
                    <h2 className="text-xl font-semibold text-[#fffffe]">
                        Order ID:{checkout.id}
                    </h2>
                    <p className="text-[#abd1c6] text-sm">
                        Order Date: {new Date(checkout.createdAt).toLocaleDateString()}
                    </p>
                </div>
                {/* Estimated Delivery */}
                <div>
                    <p className="text-[#abd1c6] text-sm">
                        Estimated Delivery: {""}
                        {calculatedRestimatedDelivery(checkout.createdAt)}
                    </p>
                </div>
            </div>
            {/* Order Items */}
            <div >
                {checkout.checkoutItems.map((item)=>(
                    <div key={item.productId} className="flex items-center mb-4 border-t border-[#fffffe] p-4">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md mr-4"/>
                        <div className="text-md font-semibold ">
                            <h4 className="text-[#fffffe]">{item.name}</h4>
                            <p className="text-sm text-[#abd1c6]">Color: {item.color} | Size: {item.size}</p>
                        </div>
                        <div className="ml-auto text-right ">
                            <p className="text-md text-[#fffffe]">${item.price}</p>
                            <p className="text-md text-[#abd1c6]">Qty: {item.quantity}</p>
                        </div>
                    </div>
                ))}
            </div>
            {/* Total */}
            <div className="text-md text-[#abd1c6] p-4 border-[#fffffe] border-t">
                <div className="flex justify-between items-center">
                    <p>Subtotal</p>
                    <p>${subtotal.toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center pt-2">
                    <p>Shipping</p>
                    <p>{shippingFee === 0 ? "Free" : `$${shippingFee.toLocaleString()}`}</p>
                </div>
            </div>
            <div className="flex justify-between items-center text-lg border-t p-4 mb-6 border-[#fffffe] text-[#fffffe]">
                    <p>Total</p>
                    <p>${total.toLocaleString()}</p>
            </div>
            {/* Payment and Delivery info */}
            <div className="grid grid-cols-2 gap-8">
                {/* Payment info */}
                <div>
                    <h4 className="text-lg font-semibold mb-2 text-[#fffffe]">Payment</h4>
                    <p className="text-[#abd1c6]">Paypal</p>
                </div>
                {/* Delivery info */}
                <div>
                    <h4 className="text-lg font-semibold text-[#fffffe] mb-2">Delivery</h4>
                    <p className="text-[#abd1c6]">{checkout.shippingAddress.address}</p>
                    <p className="text-[#abd1c6]">{checkout.shippingAddress.city},{" "}, {checkout.shippingAddress.country}</p>
                </div>
            </div>
            {/* Back to home */}
            <Link to="/" className="text-[#f9bc60] hover:font-bold mt-6">Back to Home</Link>
        </div>)}
    </div>
  )
}

export default OrderConfirmationPage