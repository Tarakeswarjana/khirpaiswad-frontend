import { useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Phone, Package, MapPin, Home, Building, Globe, X } from 'lucide-react';
import * as qrcode from 'qrcode';
import { useCart } from '../hooks/useCart';
import { createOrderAPI } from '../services/api';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, getCartTotal } = useCart();
    const total = getCartTotal();
    const qrCanvasRef = useRef<HTMLCanvasElement>(null);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        bookingDate: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'India',
        paymentMethod: 'Online',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showQRCode, setShowQRCode] = useState(false);

    const UPI_URL = 'upi://pay?pa=8250795699@ybl&pn=Aya%20Das&am=1&cu=INR';
    // "upi://pay?pa=8250795699@ybl&pn=Aya%20Das&am=1&cu=INR&tn=Cozyon%20Order%201234"

    const isMobileDevice = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    const generateQRCode = async () => {
        if (qrCanvasRef.current) {
            try {
                await qrcode.toCanvas(qrCanvasRef.current, UPI_URL, {
                    width: 250,
                    margin: 2,
                    color: {
                        dark: '#000000',
                        light: '#ffffff',
                    },
                });
            } catch (error) {
                console.error('Error generating QR code:', error);
            }
        }
    };

    useEffect(() => {
        if (showQRCode) {
            generateQRCode();
        }
    }, [showQRCode]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Create order via API with pending payment status
            const orderPayload = {
                shippingAddress: {
                    address: formData.address,
                    city: formData.city,
                    postalCode: formData.postalCode,
                    country: formData.country,
                },
                paymentMethod: formData.paymentMethod,
                paymentStatus: 'pending', // Initially pending
            };

            const orderResponse = await createOrderAPI(orderPayload);
            const bookingId = orderResponse._id || `BK${Date.now()}`;

            // Check if on mobile
            if (isMobileDevice()) {
                // Open UPI app on mobile
                window.location.href = UPI_URL;
                // Navigate after delay to allow UPI app to open
                setTimeout(() => {
                    navigate(`/booking/${bookingId}`, {
                        state: {
                            bookingId,
                            customerName: formData.name,
                            phone: formData.phone,
                            bookingDate: formData.bookingDate,
                            items: cartItems,
                            total,
                            status: 'pending',
                            paymentStatus: 'pending',
                            createdAt: new Date().toISOString(),
                            shippingAddress: orderPayload.shippingAddress,
                            paymentMethod: orderPayload.paymentMethod,
                        },
                    });
                }, 1000);
            } else {
                // Show QR code on desktop
                setShowQRCode(true);
                // Navigate after QR modal is shown
                setTimeout(() => {
                    navigate(`/booking/${bookingId}`, {
                        state: {
                            bookingId,
                            customerName: formData.name,
                            phone: formData.phone,
                            bookingDate: formData.bookingDate,
                            items: cartItems,
                            total,
                            status: 'pending',
                            paymentStatus: 'pending',
                            createdAt: new Date().toISOString(),
                            shippingAddress: orderPayload.shippingAddress,
                            paymentMethod: orderPayload.paymentMethod,
                        },
                    });
                }, 3000);
            }
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Failed to place order. Please try again.');
            setIsSubmitting(false);
        }
    };

    if (cartItems.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking Details</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                                            placeholder="Enter your phone number"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Preferred Booking Date
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="date"
                                            required
                                            value={formData.bookingDate}
                                            onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                                            aria-label="Preferred booking date"
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-6 mt-8">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <MapPin className="w-5 h-5" />
                                        Shipping Address
                                    </h3>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Address
                                        </label>
                                        <div className="relative">
                                            <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                required
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                                                placeholder="Enter your address"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                City
                                            </label>
                                            <div className="relative">
                                                <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.city}
                                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                                                    placeholder="Enter your city"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Postal Code
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.postalCode}
                                                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                                                placeholder="Enter postal code"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Country
                                        </label>
                                        <div className="relative">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                required
                                                value={formData.country}
                                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                                                placeholder="Enter country"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-6 mt-8">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Method</h3>

                                    <div className="space-y-3">
                                        <label className="flex items-center p-4 border border-gray-300 rounded-xl cursor-pointer hover:bg-amber-50 transition-all" style={{ borderColor: formData.paymentMethod === 'Online' ? '#b45309' : '' }}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="Online"
                                                checked={formData.paymentMethod === 'Online'}
                                                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                                className="w-4 h-4 text-amber-600 cursor-pointer"
                                            />
                                            <span className="ml-3 font-semibold text-gray-700">Online Payment</span>
                                        </label>

                                        {/* <label className="flex items-center p-4 border border-gray-300 rounded-xl cursor-pointer hover:bg-amber-50 transition-all" style={{ borderColor: formData.paymentMethod === 'Cash' ? '#b45309' : '' }}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="Cash"
                                                checked={formData.paymentMethod === 'Cash'}
                                                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                                className="w-4 h-4 text-amber-600 cursor-pointer"
                                            />
                                            <span className="ml-3 font-semibold text-gray-700">Cash on Delivery</span>
                                        </label> */}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-bold text-lg transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                                >
                                    <Package className="w-5 h-5" />
                                    {isSubmitting ? 'Processing Order...' : 'Place Order'}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                {cartItems.map((item) => (
                                    <div key={item.product.id} className="flex justify-between items-start text-sm">
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-800 line-clamp-1">
                                                {item.product.name}
                                            </p>
                                            <p className="text-gray-600">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-semibold text-gray-800 ml-2">
                                            ₹{(item.product.price * item.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-amber-200 pt-4 space-y-3">
                                <div className="flex justify-between items-center text-gray-700">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">${total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-700">
                                    <span>Delivery</span>
                                    <span className="font-semibold text-green-600">Free</span>
                                </div>
                                <div className="border-t border-amber-200 pt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-800">Total</span>
                                        <span className="text-2xl font-bold text-amber-600">
                                            ₹{total.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* QR Code Modal */}
            {showQRCode && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-800">Scan to Pay</h3>
                            <button
                                title='btn'
                                onClick={() => setShowQRCode(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                            >
                                <X className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6 mb-6 flex justify-center">
                            <canvas ref={qrCanvasRef} />
                        </div>

                        <div className="text-center mb-6">
                            <p className="text-gray-600 mb-2">Amount</p>
                            <p className="text-3xl font-bold text-amber-600">${total.toLocaleString()}</p>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-blue-900">
                                <strong>Instructions:</strong> Open any UPI app on your phone and scan this QR code to complete the payment.
                            </p>
                        </div>

                        <button
                            onClick={() => setShowQRCode(false)}
                            className="w-full px-4 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-all"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
