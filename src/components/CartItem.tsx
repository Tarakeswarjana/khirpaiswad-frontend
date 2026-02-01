import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem as CartItemType } from '../types/product';
import { removeFromCartAPI, updateCartQuantityAPI } from '../services/api';

interface CartItemProps {
    item: CartItemType;
    onRemove?: () => void;
    onQuantityChange?: () => void;
}

const CartItem = ({ item, onRemove, onQuantityChange }: CartItemProps) => {
    // Extract data from API response format
    const product = item.product;
    const quantity = item.quantity;
    const imageUrl = product?.images?.[0] || product?.image || '';

    const handleRemove = async () => {
        try {
            const productId = product?._id || product?.id;
            if (productId) {
                await removeFromCartAPI(productId);
                onRemove?.();
            }
        } catch (error) {
            console.error('Error removing item:', error);
            alert('Failed to remove item from cart');
        }
    };

    const handleQuantityChange = async (newQuantity: number) => {
        if (newQuantity < 1) return;

        try {
            const productId = product?._id || product?.id;
            if (productId) {
                // Send the absolute quantity to the update endpoint
                await updateCartQuantityAPI(productId, newQuantity);
                onQuantityChange?.();
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            alert('Failed to update quantity');
        }
    };

    return (
        <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow mx-4 sm:mx-0">
            <div className="w-full sm:w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                <img
                    src={imageUrl}
                    alt={product?.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
            </div>

            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-base font-bold text-gray-800 mb-0.5">{product?.name}</h3>
                    <p className="text-xs text-gray-500 mb-1">{product?.category}</p>
                    <p className="text-lg font-bold text-amber-600">
                        ₹{(product?.price || 0).toLocaleString()}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleQuantityChange(quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                            disabled={quantity <= 1}
                            aria-label="Decrease quantity"
                        >
                            <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-10 text-center text-sm font-semibold text-gray-800">
                            {quantity}
                        </span>
                        <button
                            onClick={() => handleQuantityChange(quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                            aria-label="Increase quantity"
                        >
                            <Plus className="w-3 h-3" />
                        </button>
                    </div>

                    <button
                        onClick={handleRemove}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-50 hover:bg-red-100 text-red-600 font-medium text-sm transition-colors"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Remove</span>
                    </button>
                </div>
            </div>

            <div className="sm:ml-2 flex items-center sm:items-start justify-end">
                <p className="text-xl font-bold text-gray-800">
                    ₹{((product?.price || 0) * quantity).toLocaleString()}
                </p>
            </div>
        </div>
    );
};

export default CartItem;
