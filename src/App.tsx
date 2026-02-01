import { BrowserRouter } from 'react-router-dom';
import { useContext } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';
import { CartProvider } from './context/CartContext';
import { CartContext } from './context/cart';
import AuthModal from './components/AuthModal';

function AppContent() {
  const context = useContext(CartContext);

  if (!context) return null;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-1">
        <AppRoutes />
      </main>
      <Footer />
      <AuthModal
        isOpen={context.showAuthModal}
        onClose={() => context.setShowAuthModal(false)}
        onLoginSuccess={context.handleAuthSuccess}
      />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
