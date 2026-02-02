import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Product, CartItem } from '../types/product';
import { CartContext } from './cart';
import type { User } from './cart';
import { addToCartAPI, getCartAPI } from '../services/api';

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        try {
            const savedCart = localStorage.getItem('cart');
            console.log(savedCart, "99999222");
            if (!savedCart) return [];

            const parsed = JSON.parse(savedCart);
            // Validate that parsed data is an array of cart items
            if (Array.isArray(parsed) && parsed.every((item) => item.product && typeof item.quantity === 'number')) {
                return parsed;
            }

            // If invalid, clear it
            localStorage.removeItem('cart');
            return [];
        } catch (error: unknown) {
            // If parsing fails, clear corrupted data
            console.error('Failed to load cart from localStorage:', error);
            localStorage.removeItem('cart');
            return [];
        }
    });

    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return !!localStorage.getItem('authToken');
    });

    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [showAuthModal, setShowAuthModal] = useState(false);

    // Sync cart from API on mount
    useEffect(() => {
        const syncCartFromAPI = async () => {
            if (!isLoggedIn) return;

            try {
                const apiCart = await getCartAPI();
                console.log(apiCart, "20202");
                if (apiCart && Array.isArray(apiCart.items)) {
                    setCartItems(apiCart.items);
                    console.log(apiCart, "====88");
                    // localStorage will be updated by the other useEffect
                }
            } catch (error) {
                console.error('Failed to sync cart from API:', error);
            }
        };

        syncCartFromAPI();
    }, [isLoggedIn]);

    useEffect(() => {
        // Only save valid cart data
        if (cartItems.length > 0) {
            localStorage.setItem('cart', JSON.stringify(cartItems));
        } else {
            localStorage.removeItem('cart');
        }
    }, [cartItems]);

    const addToCart = async (product: Product, quantity: number = 1) => {
        // Check if user is logged in
        if (!isLoggedIn) {
            setShowAuthModal(true);
            return;
        }

        const productId = product._id || product.id;

        try {
            // Call API to add to cart
            await addToCartAPI(productId || '', quantity);

            // Fetch fresh cart data from API
            const apiCart = await getCartAPI();
            console.log(apiCart, "00000==");
            if (apiCart && Array.isArray(apiCart.items)) {
                setCartItems(apiCart.items);
            }
        } catch (error) {
            console.error('Error adding to cart via API:', error);
        }
    };

    const handleAuthSuccess = () => {
        setIsLoggedIn(true);
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setShowAuthModal(false);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
        clearCart();
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    };

    const removeFromCart = (productId: string) => {
        setCartItems((prevItems) => prevItems.filter((item) => (item.product._id || item.product.id) !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCartItems((prevItems) =>
            prevItems.map((item) =>
                (item.product._id || item.product.id) === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cart');
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const syncCart = async () => {
        try {
            const apiCart = await getCartAPI();
            if (apiCart && apiCart.items && Array.isArray(apiCart.items)) {
                setCartItems(apiCart.items);
            }
        } catch (error) {
            console.error('Failed to sync cart from API:', error);
        }
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartTotal,
                getCartCount,
                isLoggedIn,
                setIsLoggedIn,
                user,
                setUser,
                showAuthModal,
                setShowAuthModal,
                handleAuthSuccess,
                logout,
                syncCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
