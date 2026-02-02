import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, History, LogOut, User as UserIcon } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useState, useRef, useEffect } from 'react';

const Header = () => {
    const navigate = useNavigate();
    const { cartItems, isLoggedIn, user, logout } = useCart();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        navigate('/');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    <Link to="/" className="flex items-center gap-2 group">
                        <img src="/khirpaiswadlogo.png" alt="Khirpaiswad" className="w-12 h-12 transition-transform group-hover:scale-110" />
                        <span className="text-2xl font-bold bg-linear-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                            Khirpaiswad
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/"
                            className="hidden sm:block text-gray-700 hover:text-amber-600 font-medium transition-colors"
                        >
                            Products
                        </Link>

                        {isLoggedIn && (
                            <Link
                                to="/orders"
                                className="flex items-center   py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium transition-all hover:shadow-md"
                                title="My Orders"
                            >
                                <History className="w-5 h-5" />
                                <span className="hidden sm:inline">Orders</span>
                            </Link>
                        )}

                        <Link
                            to="/cart"
                            className="relative flex items-center  py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium transition-all hover:shadow-md"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            <span className="hidden sm:inline">Cart</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-amber-600 rounded-full shadow-lg">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {isLoggedIn && (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-r from-amber-50 to-orange-50 hover:shadow-md transition-all"
                                    title="User Menu"
                                >
                                    <UserIcon className="w-5 h-5 text-amber-600" />
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-xs text-gray-600">Hello,</p>
                                            <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 transition-all"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span className="font-medium">Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
