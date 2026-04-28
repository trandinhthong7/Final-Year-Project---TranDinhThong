import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrders } from '../redux/slices/orderSlice';

const MyOrderPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.order);
    const { userInfo } = useSelector((state) => state.auth);
    
    useEffect(() => {
        if (userInfo) {
            dispatch(fetchUserOrders());
        }
    }, [dispatch, userInfo]);

    const handleRowClick = (orderId) => {
        navigate(`/order/${orderId}`);
    };

    const getStatusColor = (order) => {
        if (order.status === 'Delivered') return 'bg-[#004643] text-[#fffffe]';
        if (order.status === 'Shipped') return 'bg-[#f9bc60] text-[#fffffe]';
        if (order.status === 'Cancelled') return 'bg-[#e16162] text-[#fffffe]';
        return 'border border-[#004643] bg-[#abd1c6] text-[#004643]'; // Processing
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl text-[#001e1d] font-bold mb-6">My Orders</h2>
                <div className="text-center py-8 text-[#004643]">Loading orders...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl text-[#001e1d] font-bold mb-6">My Orders</h2>
                <div className="text-center py-8 text-red-600">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl text-[#001e1d] font-bold mb-6">My Orders</h2>
            <div className="relative sm:rounded-lg overflow-x-auto shadow-md">
                <table className="min-w-full text-left text-[#fffffe]">
                    <thead className="bg-[#004643] text-xs uppercase text-[#fffffe]">
                        <tr>
                            <th scope="col" className="px-4 py-2 sm:py-3">Image</th>
                            <th scope="col" className="px-4 py-2 sm:py-3">Order ID</th>
                            <th scope="col" className="px-4 py-2 sm:py-3">Date</th>
                            <th scope="col" className="px-4 py-2 sm:py-3">Items</th>
                            <th scope="col" className="px-4 py-2 sm:py-3">Total</th>
                            <th scope="col" className="px-4 py-2 sm:py-3">Payment</th>
                            <th scope="col" className="px-4 py-2 sm:py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <tr 
                                    key={order._id} 
                                    className="border-b border-[#004643] text-[#001e1d] hover:text-[#fffffe] hover:bg-[#004643] cursor-pointer transition-colors"
                                    onClick={() => handleRowClick(order._id)}
                                >
                                    <td className="py-2 px-2 sm:py-4 sm:px-4">
                                        {order.orderItem && order.orderItem.length > 0 && (
                                            <img 
                                                src={order.orderItem[0].image || '/placeholder-product.jpg'} 
                                                alt={order.orderItem[0].name}
                                                className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
                                            />
                                        )}
                                    </td>
                                    <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium whitespace-nowrap">
                                        #{order._id.slice(-8)}
                                    </td>
                                    <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium">
                                        <div className="flex flex-col">
                                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                            <span className="text-xs opacity-70">
                                                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium">
                                        {order.orderItem ? order.orderItem.length : 0} item(s)
                                    </td>
                                    <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium">
                                        ${order.totalPrice?.toFixed(2) || '0.00'}
                                    </td>
                                    <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium">
                                        <span className={`${order.isPaid ? "border border-[#004643] bg-[#abd1c6] text-[#004643]" : "bg-[#e16162] text-[#fffffe]"} px-2 py-1 rounded-full text-xs sm:text-sm font-medium`}>
                                            {order.isPaid ? "Paid" : "Unpaid"}
                                        </span>
                                    </td>
                                    <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium">
                                        <span className={`${getStatusColor(order)} px-2 py-1 rounded-full text-xs sm:text-sm font-medium`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="py-8 px-4 text-center text-[#004643]">
                                    <div className="flex flex-col items-center">
                                        <p className="text-lg mb-2">No orders yet</p>
                                        <p className="text-sm text-gray-500">Start shopping to see your orders here!</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyOrderPage;
