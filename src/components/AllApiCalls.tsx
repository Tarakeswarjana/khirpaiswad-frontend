import { httpGet, handleApiError } from '../services/httpClient';
import type { Product } from '../types/product';

interface ApiProduct {
    _id: string;
    name: string;
    price: number;
    description: string;
    images: string[];
    category: string;
    stock: number;
    createdAt: string;
    updatedAt: string;
}

interface ApiResponse {
    success: boolean;
    data: ApiProduct[];
    pagination: {
        total: number;
        page: number;
        pages: number;
    };
}

// Function to fetch products from API
export const fetchAllProducts = async (): Promise<Product[]> => {
    try {
        const response = await httpGet<ApiResponse>('/products');

        if (response.success && response.data) {
            // Transform API response to Product type
            const transformedProducts: Product[] = response.data.map((item) => ({
                id: item._id,
                name: item.name,
                price: item.price,
                description: item.description,
                image: item.images[0] || '',
                highlights: [
                    `Category: ${item.category}`,
                    `Stock: ${item.stock}`,
                    'Premium Quality',
                ],
                category: item.category,
            }));

            return transformedProducts;
        }

        return [];
    } catch (err) {
        const errorMessage = handleApiError(err);
        console.error('Error loading products:', err);
        throw new Error(errorMessage);
    }
};
