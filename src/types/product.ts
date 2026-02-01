export interface Product {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  images?: string[];
  highlights?: string[];
  category: string;
  stock?: number;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  _id?: string;
  product: Product;
  quantity: number;
  price?: number;
}

export interface BookingDetails {
  bookingId: string;
  customerName: string;
  phone: string;
  bookingDate: string;
  items: CartItem[];
  total: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}
