import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, selectRecentOrders } from '../redux/slices/adminOrderSlice';
import { fetchAllProducts } from '../redux/slices/adminProductSlice';
import { fetchAllUsers } from '../redux/slices/adminSlice';

const AdminHomePage = () => {
    const dispatch = useDispatch();
    const { totalOrders, totalRevenue, processingOrders, shippedOrders, deliveredOrders, loading: ordersLoading } = useSelector((state) => state.adminOrders);
    const recentOrders = useSelector(selectRecentOrders);
    const { products } = useSelector((state) => state.adminProducts);
    const { users } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(fetchAllOrders());
        dispatch(fetchAllProducts());
        dispatch(fetchAllUsers());
    }, [dispatch]);

    const stats = [
        {
            title: 'Total Revenue',
            value: `$${totalRevenue.toFixed(2)}`,
            color: 'bg-[#004643]',
            icon: '💰'
        },
        {
            title: 'Total Orders',
            value: totalOrders,
            color: 'bg-[#004643]',
            link: '/admin/orders',
            linkText: 'Manage Orders',
            icon: '📦'
        },
        {
            title: 'Total Products',
            value: products.length,
            color: 'bg-[#004643]',
            link: '/admin/products',
            linkText: 'Manage Products',
            icon: '🛍️'
        },
        {
            title: 'Total Users',
            value: users.length,
            color: 'bg-[#004643]',
            link: '/admin/users',
            linkText: 'Manage Users',
            icon: '👥'
        },
        {
            title: 'Processing',
            value: processingOrders,
            color: 'bg-[#004643]',
            icon: '⏳'
        },
        {
            title: 'Shipped',
            value: shippedOrders,
            color: 'bg-[#004643]',
            icon: '🚚'
        },
        {
            title: 'Delivered',
            value: deliveredOrders,
            color: 'bg-[#004643]',
            icon: '✅'
        },
    ];

    if (ordersLoading && recentOrders.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl text-[#004643]">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-[#001e1d]">Admin Dashboard</h1>
            
            {/* Statistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className={`p-6 rounded-lg ${stat.color} shadow-lg`}>
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-semibold text-[#fffffe]">{stat.title}</h2>
                            <span className="text-2xl">{stat.icon}</span>
                        </div>
                        <p className="text-3xl font-bold text-[#fffffe] mb-2">{stat.value}</p>
                        {stat.link && (
                            <Link
                                to={stat.link}
                                className="text-[#fffffe] text-sm font-bold hover:underline mt-2 block"
                            >
                                {stat.linkText} →
                            </Link>
                        )}
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="rounded-lg  p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-[#001e1d]">Recent Orders</h2>
                    <Link
                        to="/admin/orders"
                        className="text-[#004643] font-semibold hover:underline"
                    >
                        View All →
                    </Link>
                </div>
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full text-left">
                        <thead className="bg-[#004643] text-xs uppercase text-[#fffffe]">
                            <tr>
                                <th scope="col" className="px-4 py-3">Order ID</th>
                                <th scope="col" className="px-4 py-3">Customer</th>
                                <th scope="col" className="px-4 py-3">Total Price</th>
                                <th scope="col" className="px-4 py-3">Status</th>
                                <th scope="col" className="px-4 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.length > 0 ? (
                                recentOrders.map((order) => (
                                    <tr
                                        key={order._id}
                                        className="border-b text-[#001e1d] hover:text-[#fffffe] hover:bg-[#004643] cursor-pointer"
                                    >
                                        <td className="p-4 font-medium">
                                            {order._id.slice(-8).toUpperCase()}
                                        </td>
                                        <td className="p-4">
                                            {order.user?.username || order.user?.email || 'N/A'}
                                        </td>
                                        <td className="p-4 font-semibold">
                                            ${order.totalPrice?.toFixed(2) || '0.00'}
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                                    order.status === 'Delivered'
                                                        ? 'bg-[#004643] text-[#fffffe]'
                                                        : order.status === 'Shipped'
                                                        ? 'bg-[#f9bc60] text-[#001e1d]'
                                                        : order.status === 'Processing'
                                                        ? 'bg-[#001e1d] text-[#fffffe]'
                                                        : 'bg-[#e16162] text-[#fffffe]'
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-[#001e1d]">
                                        No recent orders
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminHomePage;