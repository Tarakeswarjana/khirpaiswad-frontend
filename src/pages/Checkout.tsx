import { useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Phone, Package, MapPin, Home, Building, Globe, X, Smartphone } from 'lucide-react';
import * as qrcode from 'qrcode';
import { useCart } from '../hooks/useCart';
import { createOrderAPI } from '../services/api';
import type { CartItem } from '../types/product';

interface NavigationState {
    bookingId: string;
    customerName: string;
    phone: string;
    bookingDate: string;
    items: CartItem[];
    total: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
    shippingAddress: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
    paymentMethod: string;
}

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, getCartTotal, clearCart } = useCart();
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
    const [bookingIdState, setBookingIdState] = useState<string | null>(null);
    const [navigationData, setNavigationData] = useState<NavigationState | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const UPI_URL = 'upi://pay?pa=8250795699@ybl&pn=Aya%20Das&am=1&cu=INR';

    // App-specific UPI URLs
    const GOOGLE_PAY_URL = 'googlepay://upi/pay?pa=8250795699@ybl&pn=Aya%20Das&am=1&cu=INR';
    const PHONEPE_URL = 'phonepe://upi/pay?pa=8250795699@ybl&pn=Aya%20Das&am=1&cu=INR';
    const PAYTM_URL = 'paytmqr://upi/pay?pa=8250795699@ybl&pn=Aya%20Das&am=1&cu=INR';

    const openUPIApp = (appUrl: string) => {
        // Try to open the specific app
        window.location.href = appUrl;

        // If the app is not installed, fall back to generic UPI after 2 seconds
        setTimeout(() => {
            window.location.href = UPI_URL;
        }, 2000);
    };

    const isMobileDevice = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    const generateQRCode = async () => {
        if (qrCanvasRef.current) {
            try {
                console.log('QR Canvas ref exists:', qrCanvasRef.current);
                await qrcode.toCanvas(qrCanvasRef.current, UPI_URL, {
                    width: 250,
                    margin: 2,
                    color: {
                        dark: '#000000',
                        light: '#ffffff',
                    },
                });
                console.log('QR Code generated successfully');
            } catch (error) {
                console.error('Error generating QR code:', error);
            }
        } else {
            console.error('QR Canvas ref is null');
        }
    };

    useEffect(() => {
        if (showQRCode) {
            console.log('Generating QR Code...');
            // Add a small delay to ensure canvas is mounted

            generateQRCode();


        }
    }, [showQRCode]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        console.log('Form submitted');

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

            console.log('Creating order with payload:', orderPayload);
            const orderResponse = await createOrderAPI(orderPayload);
            console.log('Order created:', orderResponse);
            const bookingId = orderResponse._id || `BK${Date.now()}`;

            // Check if on mobile
            const isMobile = isMobileDevice();
            console.log('Is Mobile:', isMobile);

            if (isMobile) {
                // Show payment method selection modal on mobile
                console.log('Mobile detected, showing payment selection');
                setNavigationData({
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
                });
                setShowPaymentModal(true);

                setIsSubmitting(false);
            } else {
                // Show QR code on desktop
                console.log('Desktop detected, showing QR code modal');

                setBookingIdState(bookingId);
                setNavigationData({
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
                });
                console.log('Setting showQRCode to true');
                setShowQRCode(true);
                setIsSubmitting(false);

            }

        } catch (error) {
            console.error('Error in handleSubmit:', error);
            alert('Failed to place order. Please try again.');
            setIsSubmitting(false);
        }
    };

    const handlePaymentMethodSelect = (appUrl: string) => {
        console.log('Payment method selected, opening app');
        openUPIApp(appUrl);

        // Navigate after delay
        setTimeout(() => {
            if (navigationData) {
                navigate(`/booking/${navigationData.bookingId}`, {
                    state: navigationData,
                });
            }
            setShowPaymentModal(false);
        }, 10000);
    };

    // if (cartItems.length === 0) {
    //     navigate('/cart');
    //     return null;
    // }

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
                                        <label className={`flex items-center p-4 border rounded-xl cursor-pointer hover:bg-amber-50 transition-all ${formData.paymentMethod === 'Online' ? 'border-amber-600' : 'border-gray-300'}`}>
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
                        <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg p-6 sticky top-24">
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
                                title='Close payment modal'
                                onClick={() => setShowQRCode(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                            >
                                <X className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6 mb-6 flex justify-center min-h-64">
                            <canvas ref={qrCanvasRef} width={250} height={250} />
                        </div>

                        <div className="text-center mb-6">
                            <p className="text-gray-600 mb-2">Amount</p>
                            <p className="text-3xl font-bold text-amber-600">₹{total.toLocaleString()}</p>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-blue-900">
                                <strong>Instructions:</strong> Open any UPI app on your phone and scan this QR code to complete the payment.
                            </p>
                        </div>

                        <button
                            title='Confirm payment and continue'
                            onClick={() => {
                                setShowQRCode(false);
                                if (bookingIdState && navigationData) {
                                    clearCart();
                                    navigate(`/booking/${bookingIdState}`, {
                                        state: navigationData,
                                    });
                                }
                            }}
                            className="w-full px-4 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-all"
                        >
                            Payment Done - Continue
                        </button>
                    </div>
                </div>
            )}
            {/* Payment Method Selection Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-800">Select Payment App</h3>
                            <button
                                title='Close payment selection modal'
                                onClick={() => setShowPaymentModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                            >
                                <X className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>

                        <p className="text-gray-600 mb-6 text-center">Choose your preferred UPI payment app</p>

                        <div className="text-center mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                            <p className="text-gray-600 text-sm mb-2">Amount to Pay</p>
                            <p className="text-2xl font-bold text-amber-600">₹{total.toLocaleString()}</p>
                        </div>

                        <div className="space-y-3">
                            {/* Google Pay Button */}
                            <button
                                title='Pay with Google Pay'
                                onClick={() => handlePaymentMethodSelect(GOOGLE_PAY_URL)}
                                className="w-full flex items-center gap-4 p-4 border-2 border-blue-500 rounded-xl hover:bg-blue-50 transition-all"
                            >
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <span className="text-blue-600 font-bold text-sm">G</span>
                                </div>
                                <div className="text-left flex-1">
                                    <p className="font-bold text-gray-800">Google Pay</p>
                                    <p className="text-xs text-gray-500">Fast & Secure</p>
                                </div>
                                <Smartphone className="w-5 h-5 text-blue-600" />
                            </button>

                            {/* PhonePe Button */}
                            <button
                                title='Pay with PhonePe'
                                onClick={() => handlePaymentMethodSelect(PHONEPE_URL)}
                                className="w-full flex items-center gap-4 p-4 border-2 border-purple-500 rounded-xl hover:bg-purple-50 transition-all"
                            >
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <span className="text-purple-600 font-bold text-sm">P</span>
                                </div>
                                <div className="text-left flex-1">
                                    <p className="font-bold text-gray-800">PhonePe</p>
                                    <p className="text-xs text-gray-500">Instant & Cashback</p>
                                </div>
                                <Smartphone className="w-5 h-5 text-purple-600" />
                            </button>

                            {/* Paytm Button */}
                            <button
                                title='Pay with Paytm'
                                onClick={() => handlePaymentMethodSelect(PAYTM_URL)}
                                className="w-full flex items-center gap-4 p-4 border-2 border-blue-700 rounded-xl hover:bg-blue-50 transition-all"
                            >
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <span className="text-blue-700 font-bold text-sm">T</span>
                                </div>
                                <div className="text-left flex-1">
                                    <p className="font-bold text-gray-800">Paytm</p>
                                    <p className="text-xs text-gray-500">Best Offers</p>
                                </div>
                                <Smartphone className="w-5 h-5 text-blue-700" />
                            </button>
                        </div>

                        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-xs text-amber-900">
                                <strong>Note:</strong> You will be redirected to your selected app to complete the payment.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
