import { Link } from 'react-router-dom';
import { ShoppingCart, History } from 'lucide-react';
import { useCart } from '../../hooks/useCart';

const Header = () => {
    const { cartItems, isLoggedIn } = useCart();
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    <Link to="/" className="flex items-center gap-2 group">
                        <img src="/khirpaiswadlogo.png" alt="Khirpaiswad" className="w-12 h-12 transition-transform group-hover:scale-110" />
                        <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                            Khirpaiswad
                        </span>
                    </Link>

                    <div className="flex items-center gap-6">
                        <Link
                            to="/"
                            className="hidden sm:block text-gray-700 hover:text-amber-600 font-medium transition-colors"
                        >
                            Products
                        </Link>

                        {isLoggedIn && (
                            <Link
                                to="/orders"
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium transition-all hover:shadow-md"
                                title="My Orders"
                            >
                                <History className="w-5 h-5" />
                                <span className="hidden sm:inline">Orders</span>
                            </Link>
                        )}

                        <Link
                            to="/cart"
                            className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium transition-all hover:shadow-md"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            <span className="hidden sm:inline">Cart</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-amber-600 rounded-full shadow-lg">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
