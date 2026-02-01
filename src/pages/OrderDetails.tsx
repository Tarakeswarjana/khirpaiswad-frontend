import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, AlertCircle, CheckCircle, Clock } from 'lucide-react';

import { fetchOrderByIdAPI, fetchOrderInvoiceAPI } from '../services/api';
import { useCart } from '../hooks/useCart';

interface OrderItem {
    _id: string;
    product: {
        _id: string;
        name: string;
        price: number;
        description: string;
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

interface InvoiceData {
    invoiceNumber: string;
    orderDate: string;
    orderStatus: string;
    paymentStatus: string;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
        subtotal: number;
    }>;
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    subtotal: number;
    tax: number;
    total: number;
}

const OrderDetails = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const { isLoggedIn } = useCart();
    const [order, setOrder] = useState<Order | null>(null);
    const [invoice, setInvoice] = useState<InvoiceData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showInvoice, setShowInvoice] = useState(false);
    const [downloadingInvoice, setDownloadingInvoice] = useState(false);
    const invoiceRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/');
            return;
        }

        const loadOrder = async () => {
            try {
                setLoading(true);
                setError(null);
                if (orderId) {
                    const response = await fetchOrderByIdAPI(orderId);
                    if (response.success) {
                        setOrder(response.data);
                    } else {
                        setError('Failed to load order details');
                    }
                }
            } catch (err) {
                console.error('Error loading order:', err);
                setError('Failed to load order. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        loadOrder();
    }, [orderId, isLoggedIn, navigate]);

    const handleViewInvoice = async () => {
        try {
            if (orderId) {
                const response = await fetchOrderInvoiceAPI(orderId);
                if (response.success) {
                    setInvoice(response.data);
                    setShowInvoice(true);
                } else {
                    alert('Failed to load invoice');
                }
            }
        } catch (err) {
            console.error('Error loading invoice:', err);
            alert('Failed to load invoice');
        }
    };

    const downloadInvoicePDF = () => {
        if (!invoiceRef.current) return;

        setDownloadingInvoice(true);

        try {
            const filename = `${invoice?.invoiceNumber || 'invoice'}.pdf`;
            const htmlContent = invoiceRef.current.innerHTML;

            const printWindow = window.open('', '', 'height=800,width=900');
            if (printWindow) {
                printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
    <title>${filename}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        @media print {
            body { margin: 0; }
            button { display: none; }
        }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>`);
                printWindow.document.close();

                setTimeout(() => {
                    printWindow.print();
                    setDownloadingInvoice(false);
                }, 250);
            }
        } catch (error) {
            console.error('Error opening print dialog:', error);
            alert('Failed to download invoice');
            setDownloadingInvoice(false);
        }
    };


    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
            case 'delivered':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'pending':
            case 'processing':
                return <Clock className="w-5 h-5 text-yellow-600" />;
            default:
                return <AlertCircle className="w-5 h-5 text-gray-600" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 font-medium">{error || 'Order not found'}</p>
                    <button
                        onClick={() => navigate('/orders')}
                        className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/orders')}
                    className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Orders
                </button>

                {/* Order Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Details</h1>
                            <p className="text-gray-600">
                                Invoice: <span className="font-semibold">{order.invoiceNumber}</span>
                            </p>
                        </div>
                        <button
                            onClick={handleViewInvoice}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-md hover:shadow-lg"
                        >
                            <Download className="w-5 h-5" />
                            View Invoice
                        </button>
                    </div>

                    {/* Status Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 mb-2">Order Status</p>
                            <div className="flex items-center gap-2">
                                {getStatusIcon(order.orderStatus)}
                                <span className="font-semibold text-gray-800 capitalize">
                                    {order.orderStatus}
                                </span>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 mb-2">Payment Status</p>
                            <div className="flex items-center gap-2">
                                {getStatusIcon(order.paymentStatus)}
                                <span className="font-semibold text-gray-800 capitalize">
                                    {order.paymentStatus}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Order Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-200 pt-6">
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Order Date</p>
                            <p className="font-semibold text-gray-800">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Payment Method</p>
                            <p className="font-semibold text-gray-800">{order.paymentMethod}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Total Amount</p>
                            <p className="font-bold text-amber-600 text-lg">
                                ₹{order.totalAmount.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Items</h2>
                    <div className="space-y-4">
                        {order.orderItems.map((item) => (
                            <div
                                key={item._id}
                                className="flex flex-col sm:flex-row items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                            >
                                {item.product.images && item.product.images[0] && (
                                    <img
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        className="w-24 h-24 object-cover rounded"
                                    />
                                )}
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                        {item.product.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-3">
                                        {item.product.description}
                                    </p>
                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-600">Quantity</p>
                                            <p className="font-semibold text-gray-800">{item.quantity}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Unit Price</p>
                                            <p className="font-semibold text-gray-800">
                                                ₹{item.price.toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Subtotal</p>
                                            <p className="font-bold text-amber-600">
                                                ₹{(item.price * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Shipping Address</h2>
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <p className="text-gray-700 mb-2">{order.shippingAddress.address}</p>
                        <p className="text-gray-700 mb-2">
                            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                        </p>
                        <p className="text-gray-700 font-semibold">{order.shippingAddress.country}</p>
                    </div>
                </div>
            </div>

            {/* Invoice Modal */}
            {showInvoice && invoice && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 p-4 flex items-center justify-center">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Invoice Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-gray-800">Invoice</h3>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={downloadInvoicePDF}
                                    disabled={downloadingInvoice}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold transition-all cursor-pointer"
                                >
                                    <Download className="w-5 h-5" />
                                    {downloadingInvoice ? 'Downloading...' : 'Download PDF'}
                                </button>
                                <button
                                    onClick={() => setShowInvoice(false)}
                                    className="text-gray-500 hover:text-gray-700 text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        {/* Invoice Content */}
                        <div ref={invoiceRef} className="p-8 bg-white">
                            {/* Invoice Header */}
                            <div className="mb-8 border-b border-gray-300 pb-8">
                                <h1 className="text-4xl font-bold text-amber-600 mb-2">INVOICE</h1>
                                <p className="text-gray-600">
                                    Invoice #: <span className="font-semibold">{invoice.invoiceNumber}</span>
                                </p>
                                <p className="text-gray-600">
                                    Order Date:{' '}
                                    <span className="font-semibold">
                                        {new Date(invoice.orderDate).toLocaleDateString()}
                                    </span>
                                </p>
                            </div>

                            {/* Company & Address Info */}
                            <div className="grid grid-cols-2 gap-8 mb-8">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800 mb-2 uppercase">
                                        From
                                    </h3>
                                    <p className="font-bold text-lg text-gray-800">Khirpaiswad</p>
                                    <p className="text-gray-600">India</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800 mb-2 uppercase">
                                        Ship To
                                    </h3>
                                    <p className="text-gray-700">{invoice.shippingAddress.address}</p>
                                    <p className="text-gray-700">
                                        {invoice.shippingAddress.city}, {invoice.shippingAddress.postalCode}
                                    </p>
                                    <p className="text-gray-700">{invoice.shippingAddress.country}</p>
                                </div>
                            </div>

                            {/* Items Table */}
                            <div className="mb-8">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100 border-b-2 border-gray-800">
                                            <th className="text-left p-3 font-bold text-gray-800">
                                                Item
                                            </th>
                                            <th className="text-center p-3 font-bold text-gray-800 w-20">
                                                Qty
                                            </th>
                                            <th className="text-right p-3 font-bold text-gray-800 w-24">
                                                Price
                                            </th>
                                            <th className="text-right p-3 font-bold text-gray-800 w-28">
                                                Total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoice.items.map((item, idx) => (
                                            <tr key={idx} className="border-b border-gray-200">
                                                <td className="p-3 text-gray-700">{item.name}</td>
                                                <td className="p-3 text-center text-gray-700">
                                                    {item.quantity}
                                                </td>
                                                <td className="p-3 text-right text-gray-700">
                                                    ₹{item.price.toLocaleString()}
                                                </td>
                                                <td className="p-3 text-right font-semibold text-gray-800">
                                                    ₹{item.subtotal.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Summary */}
                            <div className="flex justify-end mb-8">
                                <div className="w-64">
                                    <div className="flex justify-between border-b border-gray-300 py-2">
                                        <span className="text-gray-700">Subtotal:</span>
                                        <span className="font-semibold text-gray-800">
                                            ₹{invoice.subtotal.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-300 py-2">
                                        <span className="text-gray-700">Tax:</span>
                                        <span className="font-semibold text-gray-800">
                                            ₹{invoice.tax.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-3 bg-gray-100 px-3 rounded">
                                        <span className="font-bold text-gray-800">Total:</span>
                                        <span className="font-bold text-amber-600 text-lg">
                                            ₹{invoice.total.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Status */}
                            <div className="grid grid-cols-2 gap-4 border-t border-gray-300 pt-6">
                                <div>
                                    <p className="text-sm text-gray-600">Order Status</p>
                                    <p className="font-semibold text-gray-800 capitalize">
                                        {invoice.orderStatus}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Payment Status</p>
                                    <p className="font-semibold text-gray-800 capitalize">
                                        {invoice.paymentStatus}
                                    </p>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="mt-6 pt-6 border-t border-gray-300">
                                <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                                <p className="font-semibold text-gray-800">{invoice.paymentMethod}</p>
                            </div>

                            {/* Footer */}
                            <div className="mt-8 pt-6 border-t border-gray-300 text-center text-gray-600 text-sm">
                                <p>Thank you for your business!</p>
                                <p>For inquiries, please contact us at khirpaiswad.com@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetails;
