import axios from 'axios';
import type { Product } from '../types/product';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Classic Baborsha',
    price: 299.99,
    description:
      'Traditional Baborsha prepared using age-old recipes, slow-cooked milk solids, and natural sweetness. Soft, rich, and deeply rooted in heritage taste.',
    image:
      'https://images.unsplash.com/photo-1624300629298-e9de39c13be5?w=800&h=600&fit=crop',
    highlights: [
      'Authentic Heritage Recipe',
      'Slow-Cooked Milk Base',
      'No Artificial Colors',
      'Freshly Made Daily',
    ],
    category: 'Baborsha',
  },
  {
    id: '2',
    name: 'Kheer Baborsha',
    price: 349.99,
    description:
      'A luxurious fusion of Baborsha soaked in thick, aromatic kheer. Infused with cardamom and saffron for a royal dessert experience.',
    image:
      'https://images.unsplash.com/photo-1627662056597-2d7b5f1a1b64?w=800&h=600&fit=crop',
    highlights: [
      'Kheer Infused',
      'Saffron & Cardamom Flavor',
      'Rich & Creamy Texture',
      'Festival Special',
    ],
    category: 'Baborsha',
  },
  {
    id: '3',
    name: 'Dry Fruit Baborsha',
    price: 399.99,
    description:
      'Premium Baborsha loaded with handpicked almonds, cashews, pistachios, and raisins. A perfect blend of crunch and softness.',
    image:
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop',
    highlights: [
      'Loaded with Dry Fruits',
      'High Nutritional Value',
      'Premium Quality Ingredients',
      'Perfect for Gifting',
    ],
    category: 'Baborsha',
  },
  {
    id: '4',
    name: 'Jaggery Baborsha',
    price: 279.99,
    description:
      'A healthier take on Baborsha made with pure natural jaggery. Earthy sweetness with a nostalgic rural flavor.',
    image:
      'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=800&h=600&fit=crop',
    highlights: [
      'Made with Pure Jaggery',
      'No Refined Sugar',
      'Traditional Taste',
      'Light & Digestive',
    ],
    category: 'Baborsha',
  },
  {
    id: '5',
    name: 'Saffron Royal Baborsha',
    price: 449.99,
    description:
      'An indulgent royal Baborsha infused with premium Kashmiri saffron strands, offering aroma, richness, and elegance.',
    image:
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&h=600&fit=crop',
    highlights: [
      'Kashmiri Saffron',
      'Royal Preparation',
      'Rich Aroma',
      'Limited Edition',
    ],
    category: 'Baborsha',
  },
  {
    id: '6',
    name: 'Mini Baborsha Bites',
    price: 199.99,
    description:
      'Small bite-sized Baborsha pieces perfect for parties, events, and quick indulgence. Same authentic taste in a mini form.',
    image:
      'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&h=600&fit=crop',
    highlights: [
      'Bite-Sized Portions',
      'Ideal for Events',
      'Easy to Serve',
      'Kids Friendly',
    ],
    category: 'Baborsha',
  },
  {
    id: '7',
    name: 'Festival Special Baborsha Box',
    price: 899.99,
    description:
      'A curated festive box featuring assorted Baborsha varieties. Perfect for gifting during festivals and special occasions.',
    image:
      'https://images.unsplash.com/photo-1626078436898-9d65d8f5a4c3?w=800&h=600&fit=crop',
    highlights: [
      'Assorted Varieties',
      'Premium Gift Packaging',
      'Festive Exclusive',
      'Family Pack',
    ],
    category: 'Gift Box',
  },
  {
    id: '8',
    name: 'Sugar-Free Baborsha',
    price: 379.99,
    description:
      'Carefully crafted sugar-free Baborsha using natural sweeteners, designed for diabetic-friendly indulgence without compromising taste.',
    image:
      'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=800&h=600&fit=crop',
    highlights: [
      'Sugar-Free Recipe',
      'Diabetic Friendly',
      'Natural Sweeteners',
      'Balanced Taste',
    ],
    category: 'Healthy Sweets',
  },
];


export const fetchProducts = async (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProducts);
    }, 500);
  });
};

export const fetchProductById = async (id: string): Promise<Product | undefined> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await api.get(`/products/${id}`);
    console.log(response, "+++++++");

    if (response?.data?.success && response.data.data) {
      const apiProduct = response.data.data;
      // Map API response to Product interface
      return {
        _id: apiProduct._id,
        id: apiProduct._id,
        name: apiProduct.name,
        price: apiProduct.price,
        description: apiProduct.description,
        image: apiProduct.images?.[0] || '',
        images: apiProduct.images || [],
        category: apiProduct.category,
        stock: apiProduct.stock,
        highlights: [],
        createdBy: apiProduct.createdBy,
        createdAt: apiProduct.createdAt,
        updatedAt: apiProduct.updatedAt,
      };
    }
  } catch (error) {
    console.error('Error fetching product from API:', error);
    // Fallback to mock data if API fails
    return new Promise((resolve) => {
      setTimeout(() => {
        const product = mockProducts.find((p) => p.id === id);
        resolve(product);
      }, 300);
    });
  }
};

export const addToCartAPI = async (productId: string, quantity: number) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await api.post('/cart/add', {
      productId,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const getCartAPI = async () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await api.get('/cart');
    console.log(response, "+++++++");
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

export const removeFromCartAPI = async (productId: string) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await api.delete(`/cart/remove/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

export const updateCartQuantityAPI = async (productId: string, quantity: number) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await api.put('/cart/update', {
      productId,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    throw error;
  }
};

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface CreateOrderPayload {
  shippingAddress: ShippingAddress;
  paymentMethod: string;
}

export const createOrderAPI = async (orderData: CreateOrderPayload) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const checkPaymentStatusAPI = async (orderId: string) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await api.get(`/orders/${orderId}/payment-status`);
    return response.data;
  } catch (error) {
    console.error('Error checking payment status:', error);
    throw error;
  }
};

export const fetchUserOrdersAPI = async () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await api.get('/orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const fetchOrderByIdAPI = async (orderId: string) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

export const fetchOrderInvoiceAPI = async (orderId: string) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await api.get(`/orders/${orderId}/invoice`);
    return response.data;
  } catch (error) {
    console.error('Error fetching invoice:', error);
    throw error;
  }
};

export default api;
