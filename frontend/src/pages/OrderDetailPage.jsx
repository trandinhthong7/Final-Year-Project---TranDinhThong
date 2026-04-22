import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import adidasF50 from "../assets/Most Popular/boots/bota-adidas-f50-elite-ag-purple.jpg";


const OrderDetailPage = () => {
    const { id } = useParams();
    const [orderDetails, setOrderDetails] = useState(null);
    
    
    useEffect(()=>{
        const mockOrderDetails = {
            _id: id,
            createdAt: new Date(),
            iSPaid: true,
            isDelivered: false,
            paymentMethod: "PayPal",
            shippingMethod: "Standard Shipping",
            shippingAddress: {city: 'Hanoi', country: 'Vietnam', street: '123 Main St'},
            orderItems: [
                {
                    productID: 1,
                    name: "Adidas Predator 20.3 Firm Ground",
                    image: adidasF50,
                    size: 42,
                    color: "Red",
                    price: 99.99,
                    quantity: 1,
                },
                {
                    productID: 2,
                    name: "Adidas Predator 20.3 Firm Ground",
                    image: adidasF50,
                    size: 42,
                    color: "Red",
                    price: 99.99,
                    quantity: 5,
                }
            ],
        };
        setOrderDetails(mockOrderDetails);
        
    },[id]);

    const subtotal = orderDetails ? orderDetails.orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0) : 0;
    const shippingFee = subtotal > 100 ? 0 : (orderDetails ? 10 * orderDetails.orderItems.reduce((acc, item) => acc + item.quantity, 0) : 0); // $10 per item if subtotal <= 100
    const total = subtotal + shippingFee;
    
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#001e1d]">Order Details</h2>
        {!orderDetails ? (<p>No order details found</p>):(
            <div className="p-4 sm:p-6 rounded-lg border bg-[#004643]">
                {/* Order Info */}
                <div className="flex flex-col sm:flex-row justify-between mb-8">
                    <div>
                        <h3 className="text-lg md:text-xl font-semibold text-[#fffffe]">
                            Order ID: #{orderDetails._id}
                        </h3>
                        <p className="text-[#abd1c6]">
                            {new Date(orderDetails.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
                        <span className={`${orderDetails.iSPaid ? "bg-[#abd1c6]/50 text-[#abd1c6]":"bg-[#e16162]/50 text-[#e16162]"} px-3 py-1 rounded-full text-sm font-medium mb-2`}>
                            {orderDetails.iSPaid ? "Approved":"Pending"}
                        </span>
                        <span className={`${orderDetails.isDelivered ? "bg-[#abd1c6]/50 text-[#abd1c6]":"bg-[#f9bc60]/50 text-[#f9bc60]"} px-3 py-1 rounded-full text-sm font-medium mb-2`}>
                            {orderDetails.isDelivered ? "Delivered":"Pending Delivery"}
                        </span>
                    </div>
                </div>
                {/* Customer, Payment, Shipping Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h4 className="text-lg font-medium mb-2 text-[#fffffe]"> Payment Info</h4>
                        <p className="text-[#abd1c6]">Payment Method: {orderDetails.paymentMethod}</p>
                        <p className="text-[#abd1c6]">Status: {orderDetails.iSPaid?"Paid":"Unpaid"}</p>
                    </div>
                    <div>
                        <h4 className="text-lg font-medium mb-2 text-[#fffffe]" > Shipping Info</h4>
                        <p className="text-[#abd1c6]">Shipping Method: {orderDetails.shippingMethod}</p>
                        <p className="text-[#abd1c6]">Adddress: {`${orderDetails.shippingAddress.street}, ${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.country}`}</p>
                    </div>
                </div>
                {/* Order Items */}
                <div className="overflow-x-auto">
                    <h4 className="text-lg font-semibold mb-4 text-[#fffffe] ">Product</h4>
                    <table className="min-w-full mb-4 border-separate border-spacing-0">
                        <thead className="text-[#001e1d] bg-[#abd1c6] border-b">
                            <tr>
                                <th className="py-2 px-4 rounded-tl-lg">Name</th>
                                <th className="py-2 px-4">Unit Price</th>
                                <th className="py-2 px-4">Quantity</th>
                                <th className="py-2 px-4 rounded-tr-lg">Total</th>
                            </tr>
                        </thead>
                        <tbody >
                            {orderDetails.orderItems.map((item)=>(
                                <tr key={item.productID} className="text-[#fffffe] hover:text-[#abd1c6]">
                                    <td className="py-4 px-4 flex items-center border-b border-[#fffffe]">
                                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded mr-4"/>
                                        <Link to={`/product/${item.productID}`}>{item.name}</Link>
                                    </td>
                                    <td className="py-4 px-4 text-center border-b border-[#fffffe]">{item.price}</td>
                                    <td className="py-4 px-4 text-center border-b border-[#fffffe]">{item.quantity}</td>
                                    <td className="py-4 px-4 text-center border-b border-[#fffffe]">{item.price * item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Total */}
                <div className="text-md text-[#abd1c6] p-4">
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
                {/* Back to order */}
                <Link to="/my-orders" className="text-[#f9bc60] hover:font-bold">Back to My Orders</Link>
            </div>
        )}
    </div>
  )
}

export default OrderDetailPage