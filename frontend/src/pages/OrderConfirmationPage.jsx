import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { fetchOrderDetails } from "../redux/slices/orderSlice";

const OrderConfirmationPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { orderDetails, loading, error } = useSelector((state) => state.order);
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!userInfo) {
            toast.error("Please login to view order");
            navigate("/auth");
            return;
        }

        if (id) {
            dispatch(fetchOrderDetails(id));
        }
    }, [dispatch, id, userInfo, navigate]);

    const calculateEstimatedDelivery = (createdAt) => {
        const orderDate = new Date(createdAt);
        orderDate.setDate(orderDate.getDate() + 7);
        return orderDate.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl text-[#004643]">Loading order details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen gap-4">
                <div className="text-xl text-red-600">Error: {error}</div>
                <Link 
                    to="/my-orders" 
                    className="bg-[#004643] text-[#fffffe] px-6 py-2 rounded hover:bg-[#004643]/90"
                >
                    View My Orders
                </Link>
            </div>
        );
    }

    if (!orderDetails || !orderDetails.orderItem) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen gap-4">
                <div className="text-xl text-[#004643]">Order not found</div>
                <Link 
                    to="/" 
                    className="bg-[#004643] text-[#fffffe] px-6 py-2 rounded hover:bg-[#004643]/90"
                >
                    Back to Home
                </Link>
            </div>
        );
    }

    const subtotal = orderDetails.orderItem.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingFee = subtotal > 100 ? 0 : 10;
    const total = orderDetails.totalPrice || (subtotal + shippingFee);

    return (
        <div className="max-w-4xl mx-auto p-6 my-5 rounded-lg">
            <h1 className="text-4xl font-bold text-center text-[#001e1d] mb-8">
                Thank You for Your Order!
            </h1>

            <div className="p-6 rounded-lg bg-[#004643]">
                <div className="flex justify-between mb-20">
                    {/* Order ID and Date */}
                    <div>
                        <h2 className="text-xl font-semibold text-[#fffffe]">
                            Order ID: {orderDetails._id}
                        </h2>
                        <p className="text-[#abd1c6] text-sm">
                            Order Date: {new Date(orderDetails.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-[#f9bc60] text-sm font-semibold mt-2">
                            Status: {orderDetails.status}
                        </p>
                    </div>
                    {/* Estimated Delivery */}
                    <div>
                        <p className="text-[#abd1c6] text-sm">
                            Estimated Delivery:{" "}
                            {calculateEstimatedDelivery(orderDetails.createdAt)}
                        </p>
                        {orderDetails.isPaid && (
                            <p className="text-[#abd1c6] text-sm mt-2">
                                ✓ Payment Confirmed
                            </p>
                        )}
                    </div>
                </div>

                {/* Order Items */}
                <div>
                    {orderDetails.orderItem.map((item, index) => (
                        <div key={`${item.productId}-${index}`} className="flex items-center mb-4 border-t border-[#fffffe] p-4">
                            <img 
                                src={item.image || '/placeholder-product.jpg'} 
                                alt={item.name} 
                                className="w-20 h-20 object-cover rounded-md mr-4"
                            />
                            <div className="text-md font-semibold flex-grow">
                                <h4 className="text-[#fffffe]">{item.name}</h4>
                                <p className="text-sm text-[#abd1c6]">
                                    {item.color && `Color: ${item.color}`}
                                    {item.color && item.size && ' | '}
                                    {item.size && `Size: ${item.size}`}
                                </p>
                            </div>
                            <div className="ml-auto text-right">
                                <p className="text-md text-[#fffffe]">${item.price.toFixed(2)}</p>
                                <p className="text-md text-[#abd1c6]">Qty: {item.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Total */}
                <div className="text-md text-[#abd1c6] p-4 border-[#fffffe] border-t">
                    <div className="flex justify-between items-center">
                        <p>Subtotal</p>
                        <p>${subtotal.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <p>Shipping</p>
                        <p>{shippingFee === 0 ? "Free" : `$${shippingFee.toFixed(2)}`}</p>
                    </div>
                </div>
                <div className="flex justify-between items-center text-lg border-t p-4 mb-6 border-[#fffffe] text-[#fffffe]">
                    <p className="font-bold">Total</p>
                    <p className="font-bold">${total.toFixed(2)}</p>
                </div>

                {/* Payment and Delivery info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Payment info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-2 text-[#fffffe]">Payment</h4>
                        <p className="text-[#abd1c6]">{orderDetails.paymentMethod}</p>
                        <p className="text-[#abd1c6] text-sm mt-1">
                            {orderDetails.isPaid ? `Paid on ${new Date(orderDetails.paidAt).toLocaleDateString()}` : 'Pending'}
                        </p>
                    </div>
                    {/* Delivery info */}
                    <div>
                        <h4 className="text-lg font-semibold text-[#fffffe] mb-2">Delivery</h4>
                        <p className="text-[#abd1c6]">{orderDetails.shippingAddress.address}</p>
                        <p className="text-[#abd1c6]">
                            {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.postalCode}
                        </p>
                        <p className="text-[#abd1c6]">{orderDetails.shippingAddress.country}</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8">
                    <Link 
                        to="/" 
                        className="text-[#f9bc60] hover:font-bold hover:scale-110 transition-colors"
                    >
                        ← Back to Home
                    </Link>
                    <Link 
                        to="/my-orders" 
                        className="text-[#f9bc60] hover:font-bold hover:scale-110 transition-colors ml-auto"
                    >
                        View All Orders →
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;
