import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { fetchAllOrders, updateOrderStatus } from '../../redux/slices/adminOrderSlice';

const OrderManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { orders, loading, error } = useSelector((state) => state.adminOrders);

    useEffect(() => {
        dispatch(fetchAllOrders());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await dispatch(updateOrderStatus({ orderId, status: newStatus })).unwrap();
            toast.success("Order status updated successfully!");
        } catch (error) {
            toast.error(error || "Failed to update order status");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Processing":
                return "bg-[#001e1d] text-[#fffffe]";
            case "Shipped":
                return "bg-[#f9bc60] text-[#001e1d]";
            case "Delivered":
                return "bg-[#004643] text-[#fffffe]";
            case "Cancelled":
                return "bg-[#e16162] text-[#fffffe]";
            default:
                return "";
        }
    };

    const statusOptions = ["Processing", "Shipped", "Delivered", "Cancelled"];

    if (loading && orders.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl text-[#004643]">Loading orders...</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-[#001e1d]">Order Management</h2>

            {orders.length === 0 ? (
                <div className="rounded-lg shadow-md p-12 text-center">
                    <p className="text-xl text-[#001e1d]">No Orders Found</p>
                </div>
            ) : (
                <div className="rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#004643] text-[#fffffe]">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold">Order ID</th>
                                    <th className="px-6 py-4 text-left font-semibold">Customer</th>
                                    <th className="px-6 py-4 text-left font-semibold">Items</th>
                                    <th className="px-6 py-4 text-left font-semibold">Total Price</th>
                                    <th className="px-6 py-4 text-left font-semibold">Payment</th>
                                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                                    <th className="px-6 py-4 text-left font-semibold">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#004643]">
                                {orders.map((order) => (
                                    <tr
                                        key={order._id}
                                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                                        className="hover:bg-[#004643] text-[#001e1d] hover:text-[#fffffe] transition-colors cursor-pointer"
                                    >
                                        <td className="px-6 py-4 font-medium">
                                            {order._id.slice(-8).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {order.user?.username || order.user?.email || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {order.orderItem?.length || 0} items
                                        </td>
                                        <td className="px-6 py-4 font-semibold">
                                            ${order.totalPrice?.toFixed(2) || '0.00'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                                    order.isPaid
                                                        ? 'border border-[#004643] bg-[#abd1c6] text-[#001e1d]'
                                                        : 'bg-[#e16162] text-[#fffffe]'
                                                }`}
                                            >
                                                {order.isPaid ? 'Paid' : 'Unpaid'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                            <select
                                                value={order.status}
                                                onChange={(e) =>
                                                    handleStatusChange(order._id, e.target.value)
                                                }
                                                disabled={loading}
                                                className={`px-3 py-2 rounded-lg text-sm font-medium border-2 border-[#abd1c6] focus:outline-none focus:ring-2 focus:scale-105 cursor-pointer ${getStatusColor(
                                                    order.status
                                                )} disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                {statusOptions.map((status) => (
                                                    <option key={status} value={status}>
                                                        {status}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;