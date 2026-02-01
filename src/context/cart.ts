import { createContext } from 'react';
import type { Product, CartItem } from '../types/product';

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
    showAuthModal: boolean;
    setShowAuthModal: (value: boolean) => void;
    handleAuthSuccess: () => void;
    logout: () => void;
    syncCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);
