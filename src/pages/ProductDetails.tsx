import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Home, ShoppingCart, Check, Plus, Minus } from 'lucide-react';
import type { Product } from '../types/product';
import { fetchProductById } from '../services/api';
import { useCart } from '../hooks/useCart';

const ProductDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const { addToCart, isLoggedIn, setShowAuthModal } = useCart();

    useEffect(() => {
        const loadProduct = async () => {
            if (id) {
                try {
                    const data = await fetchProductById(id);
                    console.log(data, "==========");
                    if (data) {
                        setProduct(data);
                    } else {
                        navigate('/');
                    }
                } catch (error) {
                    console.error('Error loading product:', error);
                    navigate('/');
                } finally {
                    setLoading(false);
                }
            }
        };

        loadProduct();
    }, [id, navigate]);

    const handleAddToCart = async () => {
        // First check if user is logged in
        if (!isLoggedIn) {
            setShowAuthModal(true);
            return;
        }

        if (product) {
            await addToCart(product, quantity);
            setAddedToCart(true);
            setTimeout(() => {
                navigate('/cart');
            }, 1000);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading product...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return null;
    }

    return (
        <div className="py-6">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                <nav className="flex items-center gap-2 text-sm mb-6">
                    <Link to="/" className="flex items-center gap-1 text-gray-500 hover:text-amber-600 transition-colors">
                        <Home className="w-4 h-4" />
                        Home
                    </Link>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 font-medium">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    <div className="rounded-lg overflow-hidden bg-gray-100 shadow-lg">
                        <img
                            src={product.image || (product.images && product.images.length > 0 ? product.images[0] : '')}
                            alt={product.name}
                            className="w-full h-full object-cover aspect-square"
                        />
                    </div>

                    <div className="flex flex-col">
                        <div className="mb-3">
                            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                                {product.category}
                            </span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
                            {product.name}
                        </h1>

                        <div className="mb-4">
                            <span className="text-3xl sm:text-4xl font-bold text-amber-600">
                                ₹{product.price.toLocaleString()}
                            </span>
                        </div>

                        <div className="mb-5">
                            <h2 className="text-base font-bold text-gray-800 mb-2">Description</h2>
                            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-base font-bold text-gray-800 mb-2">Highlights</h2>
                            <ul className="space-y-1.5">
                                {(product.highlights || []).map((highlight, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                                        <span className="text-sm text-gray-700">{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-auto">
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Quantity
                                </label>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                                        aria-label="Decrease quantity"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-12 text-center text-lg font-bold text-gray-800">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                                        aria-label="Increase quantity"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Link
                                    to="/cart"
                                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition-all"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    View Cart
                                </Link>
                                <button
                                    onClick={handleAddToCart}
                                    className={`flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm transition-all ${addedToCart
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-amber-600 hover:bg-amber-700'
                                        } text-white shadow-md hover:shadow-lg`}
                                >
                                    {addedToCart ? (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Added to Cart
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="w-4 h-4" />
                                            Add to Cart
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
