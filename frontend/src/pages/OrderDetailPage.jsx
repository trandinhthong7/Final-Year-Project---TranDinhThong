import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderDetails } from "../redux/slices/orderSlice";

const OrderDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { orderDetails, loading, error } = useSelector((state) => state.order);
    const { userInfo } = useSelector((state) => state.auth);
    
    useEffect(() => {
        if (!userInfo) {
            navigate("/auth");
            return;
        }
        if (id) {
            dispatch(fetchOrderDetails(id));
        }
    }, [dispatch, id, userInfo, navigate]);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-4 sm:p-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#001e1d]">Order Details</h2>
                <div className="text-center py-8 text-[#004643]">Loading order details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto p-4 sm:p-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#001e1d]">Order Details</h2>
                <div className="text-center py-8 text-red-600">Error: {error}</div>
            </div>
        );
    }

    if (!orderDetails) {
        return (
            <div className="max-w-7xl mx-auto p-4 sm:p-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#001e1d]">Order Details</h2>
                <div className="text-center py-8 text-[#004643]">Order not found</div>
            </div>
        );
    }

    const subtotal = orderDetails.orderItem.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingFee = subtotal > 100 ? 0 : 10;
    const total = orderDetails.totalPrice || (subtotal + shippingFee);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered':
                return 'bg-[#abd1c6] text-[#001e1d]';
            case 'Shipped':
                return 'bg-[#f9bc60] text-[#001e1d]';
            case 'Cancelled':
                return 'bg-[#e16162] text-[#fffffe]';
            default:
                return 'bg-[#001e1d] text-[#fffffe]'; // Processing
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#001e1d]">Order Details</h2>
            <div className="p-4 sm:p-6 rounded-lg border bg-[#004643]">
                {/* Order Info */}
                <div className="flex flex-col sm:flex-row justify-between mb-8">
                    <div>
                        <h3 className="text-lg md:text-xl font-semibold text-[#fffffe]">
                            Order ID: #{orderDetails._id}
                        </h3>
                        <p className="text-[#abd1c6] text-sm mt-1">
                            Placed on {new Date(orderDetails.createdAt).toLocaleDateString()} at{' '}
                            {new Date(orderDetails.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                    <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0 gap-2">
                        <span className={`${orderDetails.isPaid ? "bg-[#abd1c6] text-[#001e1d]" : "bg-[#e16162] text-[#fffffe]"} px-3 py-1 rounded-full text-sm font-medium`}>
                            {orderDetails.isPaid ? "✓ Paid" : "Unpaid"}
                        </span>
                        <span className={`${getStatusColor(orderDetails.status)} px-3 py-1 rounded-full text-sm font-medium`}>
                            {orderDetails.status === 'Delivered' ? '✓ Delivered' : orderDetails.status}
                        </span>
                    </div>
                </div>

                {/* Payment, Shipping Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <div className="bg-[#001e1d] p-4 rounded-lg">
                        <h4 className="text-lg font-medium mb-3 text-[#f9bc60]">Payment Information</h4>
                        <div className="space-y-2 text-[#abd1c6]">
                            <p><span className="text-[#fffffe]">Method:</span> {orderDetails.paymentMethod}</p>
                            <p><span className="text-[#fffffe]">Status:</span> {orderDetails.isPaid ? "Paid" : "Unpaid"}</p>
                            {orderDetails.isPaid && orderDetails.paidAt && (
                                <p><span className="text-[#fffffe]">Paid At:</span> {new Date(orderDetails.paidAt).toLocaleString()}</p>
                            )}
                        </div>
                    </div>
                    <div className="bg-[#001e1d] p-4 rounded-lg">
                        <h4 className="text-lg font-medium mb-3 text-[#f9bc60]">Shipping Information</h4>
                        <div className="space-y-2 text-[#abd1c6]">
                            <p className="text-[#fffffe] font-medium">Delivery Address:</p>
                            <p>{orderDetails.shippingAddress.address}</p>
                            <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.postalCode}</p>
                            <p>{orderDetails.shippingAddress.country}</p>
                            {orderDetails.isDelivered && orderDetails.deliveredAt && (
                                <p className="mt-2"><span className="text-[#fffffe]">Delivered At:</span> {new Date(orderDetails.deliveredAt).toLocaleString()}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-4 text-[#fffffe]">Order Items</h4>
                    <div className="space-y-4">
                        {orderDetails.orderItem.map((item, index) => (
                            <div 
                                key={`${item.productId}-${index}`} 
                                className="flex items-center gap-4 bg-[#001e1d] p-4 rounded-lg hover:bg-[#002a28] transition-colors"
                            >
                                <img 
                                    src={item.image || '/placeholder-product.jpg'} 
                                    alt={item.name} 
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <div className="flex-grow">
                                    <Link 
                                        to={`/product/${item.productId}`}
                                        className="text-[#fffffe] hover:text-[#f9bc60] font-medium transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                    <div className="text-sm text-[#abd1c6] mt-1">
                                        {item.size && <span>Size: {item.size}</span>}
                                        {item.size && item.color && <span> | </span>}
                                        {item.color && <span>Color: {item.color}</span>}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[#fffffe] font-medium">${item.price.toFixed(2)}</p>
                                    <p className="text-[#abd1c6] text-sm">Qty: {item.quantity}</p>
                                    <p className="text-[#f9bc60] font-bold mt-1">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-[#001e1d] p-4 rounded-lg">
                    <h4 className="text-lg font-semibold mb-4 text-[#fffffe]">Order Summary</h4>
                    <div className="space-y-2 text-[#abd1c6]">
                        <div className="flex justify-between">
                            <p>Subtotal</p>
                            <p>${subtotal.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between">
                            <p>Shipping</p>
                            <p>{shippingFee === 0 ? "Free" : `$${shippingFee.toFixed(2)}`}</p>
                        </div>
                        <div className="flex justify-between items-center text-lg border-t border-[#004643] pt-3 mt-3 text-[#fffffe] font-bold">
                            <p>Total</p>
                            <p className="text-[#f9bc60]">${total.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* Back Button */}
                <div className="mt-6">
                    <Link 
                        to={userInfo?.role === 'admin' ? '/admin/orders' : '/my-orders'}
                        className="inline-block text-[#f9bc60] hover:text-[#fffffe] transition-colors font-medium"
                    >
                        ← Back to {userInfo?.role === 'admin' ? 'Order Management' : 'My Orders'}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
