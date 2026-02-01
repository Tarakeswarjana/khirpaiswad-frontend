import { useLocation, useParams, Navigate } from 'react-router-dom';
import { CheckCircle, Calendar, Phone, User, Package } from 'lucide-react';
import type { BookingDetails as BookingDetailsType } from '../types/product';

const BookingDetails = () => {
    const { bookingId } = useParams<{ bookingId: string }>();
    const location = useLocation();
    const bookingData = location.state as BookingDetailsType;

    if (!bookingData) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                        Booking Confirmed!
                    </h1>
                    <p className="text-gray-600">
                        Thank you for your order. We'll contact you shortly.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <span className="text-white font-semibold">Booking ID</span>
                            <span className="text-white font-mono font-bold">{bookingId}</span>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-amber-100 flex-shrink-0">
                                    <User className="w-5 h-5 text-amber-700" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Customer Name</p>
                                    <p className="font-semibold text-gray-800">{bookingData.customerName}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-amber-100 flex-shrink-0">
                                    <Phone className="w-5 h-5 text-amber-700" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                                    <p className="font-semibold text-gray-800">{bookingData.phone}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-amber-100 flex-shrink-0">
                                    <Calendar className="w-5 h-5 text-amber-700" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Booking Date</p>
                                    <p className="font-semibold text-gray-800">
                                        {new Date(bookingData.bookingDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-green-100 flex-shrink-0">
                                    <Package className="w-5 h-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Status</p>
                                    <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                                        Confirmed
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Items</h2>
                            <div className="space-y-4">
                                {bookingData.items.map((item) => (
                                    <div
                                        key={item.product.id}
                                        className="flex items-center gap-4 p-4 rounded-xl bg-gray-50"
                                    >
                                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-white flex-shrink-0">
                                            <img
                                                src={item.product.image}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 mb-1">
                                                {item.product.name}
                                            </h3>
                                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-amber-600">
                                                ₹{(item.product.price * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-gray-200 mt-6 pt-6">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-gray-700">Subtotal</span>
                                <span className="font-semibold text-gray-800">
                                    ₹{bookingData.total.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-gray-700">Delivery</span>
                                <span className="font-semibold text-green-600">Free</span>
                            </div>
                            <div className="border-t border-gray-200 pt-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold text-gray-800">Total</span>
                                    <span className="text-3xl font-bold text-amber-600">
                                        ₹{bookingData.total.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-gray-600 mb-4">
                        A confirmation email has been sent to your registered email address.
                    </p>
                    <a
                        href="/"
                        className="inline-block px-8 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-all shadow-lg hover:shadow-xl"
                    >
                        Continue Shopping
                    </a>
                </div>
            </div>
        </div>
    );
};

export default BookingDetails;
