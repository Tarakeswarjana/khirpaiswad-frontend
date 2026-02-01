import { Heart, Facebook, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-br from-gray-800 to-gray-900 border-t border-gray-700 mt-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Left side - Social Media Icons */}
                    <div className="flex flex-col items-start">
                        <h3 className="text-lg font-bold text-white mb-6">Follow Us</h3>
                        <div className="flex gap-4">
                            <a
                                href="#"
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg hover:bg-amber-50 text-gray-800 hover:text-amber-600 transition-all"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg hover:bg-amber-50 text-gray-800 hover:text-amber-600 transition-all"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg hover:bg-amber-50 text-gray-800 hover:text-amber-600 transition-all"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Right side - Descriptions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-4">Heritage</h3>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Premium furniture and decor for modern living. Crafted with excellence, delivered with care.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/about" className="text-gray-300 hover:text-amber-400 text-sm transition-colors">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/contact" className="text-gray-300 hover:text-amber-400 text-sm transition-colors">
                                        Contact
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/shipping-policy" className="text-gray-300 hover:text-amber-400 text-sm transition-colors">
                                        Shipping Policy
                                    </Link>
                                </li>

                            </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                    <p className="text-gray-300 text-sm flex items-center justify-center gap-1">
                        Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by Heritage Team
                    </p>
                    <p className="text-gray-400 text-xs mt-2">
                        © {new Date().getFullYear()} Heritage. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
