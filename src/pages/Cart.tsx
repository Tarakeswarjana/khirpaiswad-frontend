import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Loader } from 'lucide-react';
import CartItem from '../components/CartItem';
import { useCart } from '../hooks/useCart';

const Cart = () => {
    const { cartItems, getCartTotal, syncCart } = useCart();
    const [isLoading, setIsLoading] = useState(false);
    const total = getCartTotal();
    const items = cartItems;

    const handleItemRemoved = async () => {
        setIsLoading(true);
        try {
            await syncCart();
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuantityChanged = async () => {
        setIsLoading(true);
        try {
            await syncCart();
        } finally {
            setIsLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
                    <p className="text-gray-600 mb-8">
                        Discover our premium collection and add items to your cart.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-all shadow-lg hover:shadow-xl"
                    >
                        Browse Products
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="py-6 relative">
            {isLoading && (
                <div className="fixed inset-0  bg-opacity-10 flex items-center justify-center z-50 rounded-lg">
                    <div className=" rounded-lg shadow-lg p-8 flex flex-col items-center gap-4">
                        <Loader className="w-10 h-10 text-amber-600 animate-spin" />
                        <p className="text-gray-700 font-medium">Updating cart...</p>
                    </div>
                </div>
            )}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-3">
                        {items.map((item) => (
                            <CartItem
                                key={item._id || item.product._id || item.product.id}
                                item={item}
                                onRemove={handleItemRemoved}
                                onQuantityChange={handleQuantityChanged}
                            />
                        ))}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg shadow-md p-5 sticky top-20">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-5">
                                <div className="flex justify-between items-center text-sm text-gray-700">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">${total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-gray-700">
                                    <span>Shipping</span>
                                    <span className="font-semibold text-green-600">Free</span>
                                </div>
                                <div className="border-t border-amber-200 pt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-gray-800">Total</span>
                                        <span className="text-xl font-bold text-amber-600">
                                            ₹{total.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Link
                                to="/checkout"
                                className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg"
                            >
                                Proceed to Checkout
                                <ArrowRight className="w-4 h-4" />
                            </Link>

                            <Link
                                to="/"
                                className="block text-center mt-3 text-sm text-amber-700 hover:text-amber-800 font-medium transition-colors"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
