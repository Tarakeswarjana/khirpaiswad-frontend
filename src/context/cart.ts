import { createContext } from 'react';
import type { Product, CartItem } from '../types/product';

export interface User {
    _id: string;
    name: string;
    email: string;
}

export interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product, quantity?: number) => Promise<void> | void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getCartCount: () => number;
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    user: User | null;
    setUser: (user: User | null) => void;
    showAuthModal: boolean;
    setShowAuthModal: (value: boolean) => void;
    handleAuthSuccess: () => void;
    logout: () => void;
    syncCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);
