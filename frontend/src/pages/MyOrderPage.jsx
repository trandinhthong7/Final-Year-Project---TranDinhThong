import { useEffect, useState } from 'react'
import puma from '../assets/Most Popular/boots/bota-puma-zukunftige-8-pro-fg-ag.jpg';

const MyOrderPage = () => {
    const [orders, setOrders] = useState([]);
    
    useEffect(() => {
        // Fetch orders simulation
        setTimeout(() => {
            const mockOrders = [
                {
                    _id: '123456789',
                    createdAt: new Date(),
                    shippingAddress: {city: 'Hanoi', country: 'Vietnam', street: '123 Main St'},
                    orderItems:[{
                        name: "Adidas Predator 20.3 Firm Ground",
                        image: puma,

                    }],
                    totalPrice: 99.99,
                    isPaid: true,
                    paidAt: new Date(),
                },
                {
                    _id: '987654321',
                    createdAt: new Date(),
                    shippingAddress: {city: 'Hanoi', country: 'Vietnam', street: '123 Main St'},
                    orderItems:[{
                        name: "Adidas Predator 20.3 Firm Ground",
                        image: puma,

                    }],
                    totalPrice: 99.99,
                    isPaid: true,
                    paidAt: new Date(),
                }
            ];
            setOrders(mockOrders);
    },1000);
},[]);
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl text-[#001e1d] font-bold mb-6">My Orders</h2>
        <div className="relative sm:rounded-lg overflow-hidden">
            <table className="min-w-full text-left text-[#fffffe] ">
                <thead className="bg-[#004643] text-xs uppercase text-[#fffffe]">
                    <tr>
                        <th scope="col" className="px-4 py-2 sm:py-3">Image</th>
                        <th scope="col" className="px-4 py-2 sm:py-3">Order ID</th>
                        <th scope="col" className="px-4 py-2 sm:py-3">Created</th>
                        <th scope="col" className="px-4 py-2 sm:py-3">Shipping Address</th>
                        <th scope="col" className="px-4 py-2 sm:py-3">Items</th>
                        <th scope="col" className="px-4 py-2 sm:py-3">Prices</th>
                        <th scope="col" className="px-4 py-2 sm:py-3">Status</th>
                    </tr>
                </thead>
                <tbody >
                    {orders.length>0?(
                    orders.map((order) => (
                        <tr key={order._id} className="border-b border-[#004643] text-[#004643] hover:text-[#00948d] hover:border-[#00948d] cursor-pointer">
                            <td className="py-2 px-2 sm:py-4 sm:px-4">
                                <img src={order.orderItems[0].image} alt={order.orderItems[0].name}
                                className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"/>
                            </td>
                            <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium whitespace-nowrap">
                                #{order._id}
                            </td>
                            <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium ">
                                {new Date(order.createdAt).toLocaleDateString()}
                                {new Date(order.createdAt).toLocaleTimeString()}
                            </td>
                            <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium">
                                {order.shippingAddress ? `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.country}`:"N/A"}
                            </td>
                            <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium">
                                {order.orderItems.length} item(s)
                            </td>
                            <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium">
                                {order.totalPrice.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
                            </td>
                            <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium">
                                <span className={`${order.isPaid? "bg-[#004643]/50 text-[#004643]":"bg-[#e16162]/50 text-[#e16162]"} px-2 py-1 rounded-full text-xs sm:text-sm font-medium`}>
                                    {order.isPaid? "Paid":"Pending"}
                                </span>
                            </td>
                        </tr>
                    ))
                    ):(
                        <tr>
                            <td colSpan={7} className="py-4 px-4 text-center text-[#004643]">No Order </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default MyOrderPage