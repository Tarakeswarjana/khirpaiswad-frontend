import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import ProductDetails from '../pages/ProductDetails';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import BookingDetails from '../pages/BookingDetails';
import Orders from '../pages/Orders';
import OrderDetails from '../pages/OrderDetails';
import AboutUs from '../pages/AboutUs';
import ContactUs from '../pages/ContactUs';
import ShippingPolicy from '../pages/ShippingPolicy';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/booking/:bookingId" element={<BookingDetails />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:orderId" element={<OrderDetails />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
        </Routes>
    );
};

export default AppRoutes;
