import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchUserOrdersAPI } from '../services/api';
import { useCart } from '../hooks/useCart';

interface OrderItem {
    _id: string;
    product: {
        _id: string;
        name: string;
        price: number;
        images: string[];
    };
    quantity: number;
    price: number;
}

interface ShippingAddress {
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

interface Order {
    _id: string;
    orderItems: OrderItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    totalAmount: number;
    orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentStatus: 'pending' | 'completed' | 'failed';
    invoiceNumber: string;
    createdAt: string;
}

const Orders = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useCart();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/');
            return;
        }

        const loadOrders = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetchUserOrdersAPI();
                if (response.success && Array.isArray(response.data)) {
                    setOrders(response.data);
                } else {
                    setOrders([]);
                }
            } catch (err) {
                console.error('Error loading orders:', err);
                setError('Failed to load orders. Please try again later.');
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, [isLoggedIn, navigate]);

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getOrderStatusColor = (status: string) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-purple-100 text-purple-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
            case 'delivered':
                return <CheckCircle className="w-5 h-5" />;
            case 'pending':
            case 'processing':
                return <Clock className="w-5 h-5" />;
            case 'failed':
            case 'cancelled':
                return <AlertCircle className="w-5 h-5" />;
            default:
                return <Package className="w-5 h-5" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading your orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 font-medium">{error}</p>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">No Orders Yet</h2>
                    <p className="text-gray-600 mb-8">You haven't placed any orders yet. Start shopping now!</p>
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-all shadow-lg hover:shadow-xl"
                    >
                        <Package className="w-5 h-5" />
                        Start Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8">My Orders</h1>

                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            {/* Order Header */}
                            <div
                                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() =>
                                    setExpandedOrder(expandedOrder === order._id ? null : order._id)
                                }
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div>
                                                <p className="text-sm text-gray-600">Order ID</p>
                                                <p className="font-bold text-gray-800">{order.invoiceNumber}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Order Date</p>
                                                <p className="font-semibold text-gray-800">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Total Amount</p>
                                                <p className="font-bold text-amber-600 text-lg">
                                                    ₹{order.totalAmount.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Status Badges */}
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <div
                                                className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(
                                                    order.orderStatus
                                                )}`}
                                            >
                                                {getStatusIcon(order.orderStatus)}
                                                <span className="capitalize">{order.orderStatus}</span>
                                            </div>
                                            <div
                                                className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(
                                                    order.paymentStatus
                                                )}`}
                                            >
                                                {getStatusIcon(order.paymentStatus)}
                                                <span>Payment: {order.paymentStatus}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expand Icon */}
                                    <div className="ml-4">
                                        {expandedOrder === order._id ? (
                                            <ChevronUp className="w-6 h-6 text-gray-400" />
                                        ) : (
                                            <ChevronDown className="w-6 h-6 text-gray-400" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {expandedOrder === order._id && (
                                <div className="border-t border-gray-200 p-6 bg-gray-50">
                                    {/* Order Items */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4">Order Items</h3>
                                        <div className="space-y-3">
                                            {order.orderItems.map((item) => (
                                                <div
                                                    key={item._id}
                                                    className="flex items-start gap-4 bg-white p-4 rounded-lg border border-gray-100"
                                                >
                                                    {item.product.images && item.product.images[0] && (
                                                        <img
                                                            src={item.product.images[0]}
                                                            alt={item.product.name}
                                                            className="w-20 h-20 object-cover rounded"
                                                        />
                                                    )}
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-gray-800">
                                                            {item.product.name}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Quantity: {item.quantity}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Unit Price: ₹{item.price}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-gray-800">
                                                            ₹{(item.price * item.quantity).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Shipping Address */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-bold text-gray-800 mb-3">Shipping Address</h3>
                                        <div className="bg-white p-4 rounded-lg border border-gray-100">
                                            <p className="text-gray-700">{order.shippingAddress.address}</p>
                                            <p className="text-gray-700">
                                                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                                            </p>
                                            <p className="text-gray-700">{order.shippingAddress.country}</p>
                                        </div>
                                    </div>

                                    {/* Order Summary and View Details Button */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-white p-4 rounded-lg border border-gray-100">
                                            <div className="flex justify-between items-center text-gray-700 mb-2">
                                                <span>Payment Method:</span>
                                                <span className="font-semibold">{order.paymentMethod}</span>
                                            </div>
                                            <div className="border-t border-gray-200 pt-3 flex justify-between items-center text-lg">
                                                <span className="font-bold">Total:</span>
                                                <span className="font-bold text-amber-600">
                                                    ₹{order.totalAmount.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/orders/${order._id}`)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors h-fit"
                                        >
                                            View Full Details
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Orders;
