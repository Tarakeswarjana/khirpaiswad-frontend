import { useState, useEffect } from 'react';
import { Package, AlertCircle } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { fetchAllProducts } from '../components/AllApiCalls';
import type { Product } from '../types/product';

const Home = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchAllProducts();
                setProducts(data);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to load products';
                console.error('Error loading products:', err);
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    // Loading State
    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <Package className="w-16 h-16 text-amber-600 animate-pulse mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading premium products...</p>
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                    <p className="text-red-600 font-medium mb-2">Error Loading Products</p>
                    <p className="text-gray-600 text-sm mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Empty State
    if (products.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">No products available</p>
                </div>
            </div>
        );
    }

    // Products Grid
    return (
        <div className="py-12 sm:py-16 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                {/* Professional Banner */}
                <div className="mb-16 rounded-3xl overflow-hidden shadow-lg border border-amber-200 relative" style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1599599810694-200c7a6f3339?w=1200&h=400&fit=crop")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}>
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/40"></div>

                    {/* Content */}
                    <div className="relative px-6 sm:px-12 py-6 sm:py-16">
                        <div className="text-center">
                            <p className="text-amber-300 text-sm sm:text-base font-semibold tracking-widest uppercase mb-3">
                                Discover Excellence
                            </p>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                                Premium
                            </h1>
                            <p className="text-gray-100 text-base sm:text-lg max-w-2xl mx-auto mb-6 leading-relaxed">
                                Handcrafted with tradition and prepared with passion. Experience the authentic taste of heritage in every bite.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                                <div className="text-center">
                                    <p className="text-2xl sm:text-3xl font-bold text-amber-300">100%</p>
                                    <p className="text-gray-200 text-xs sm:text-sm">Authentic</p>
                                </div>
                                <div className="text-center border-l border-r border-amber-300/50 px-4 sm:px-6">
                                    <p className="text-2xl sm:text-3xl font-bold text-amber-300">Fresh</p>
                                    <p className="text-gray-200 text-xs sm:text-sm">Daily Prepared</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl sm:text-3xl font-bold text-amber-300">⭐</p>
                                    <p className="text-gray-200 text-xs sm:text-sm">Premium Quality</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <ProductCard key={product._id || product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
