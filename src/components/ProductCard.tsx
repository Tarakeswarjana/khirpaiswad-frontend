import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import type { Product } from '../types/product';
import { useCart } from '../hooks/useCart';

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const productId = product._id || product.id;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addToCart(product);
        navigate('/cart');
    };

    return (
        <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <Link to={`/product/${productId}`} className="block">
                <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                    <img
                        src={product.image || (product.images && product.images.length > 0 ? product.images[0] : '')}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 right-4 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold text-amber-700 shadow-lg">
                        {product.category}
                    </div>
                </div>

                <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-amber-700 transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {product.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <span className="text-3xl font-bold text-amber-600">
                                ₹{product.price.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Link
                            to={`/product/${productId}`}
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all"
                        >
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">View</span>
                        </Link>
                        <button
                            onClick={handleAddToCart}
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium transition-all hover:shadow-lg"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            <span className="text-sm">Add</span>
                        </button>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
