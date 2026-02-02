import { useState } from 'react';
import { X, Mail, Lock, User } from 'lucide-react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: () => void;
}

type AuthMode = 'login' | 'register';

const AuthModal = ({ isOpen, onClose, onLoginSuccess }: AuthModalProps) => {
    const [mode, setMode] = useState<AuthMode>('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Login form state
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    // Register form state
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Call login API
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if (data.success) {
                // Store token
                localStorage.setItem('authToken', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));
                onLoginSuccess();
                onClose();
                setLoginData({ email: '', password: '' });
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Call register API
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData),
            });

            const data = await response.json();

            if (data.success) {
                // Store token
                localStorage.setItem('authToken', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));
                onLoginSuccess();
                onClose();
                setRegisterData({ name: '', email: '', password: '' });
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {mode === 'login' ? 'Login' : 'Create Account'}
                    </h2>
                    <button
                        title='Close authentication modal'
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {mode === 'login' ? (
                        <form onSubmit={handleLogin}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            required
                                            value={loginData.email}
                                            onChange={(e) =>
                                                setLoginData({ ...loginData, email: e.target.value })
                                            }
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <input
                                            type="password"
                                            required
                                            value={loginData.password}
                                            onChange={(e) =>
                                                setLoginData({ ...loginData, password: e.target.value })
                                            }
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Logging in...' : 'Login'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            required
                                            value={registerData.name}
                                            onChange={(e) =>
                                                setRegisterData({ ...registerData, name: e.target.value })
                                            }
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            required
                                            value={registerData.email}
                                            onChange={(e) =>
                                                setRegisterData({ ...registerData, email: e.target.value })
                                            }
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <input
                                            type="password"
                                            required
                                            value={registerData.password}
                                            onChange={(e) =>
                                                setRegisterData({ ...registerData, password: e.target.value })
                                            }
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Creating Account...' : 'Register'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Toggle between login and register */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                            <button
                                onClick={() => {
                                    setMode(mode === 'login' ? 'register' : 'login');
                                    setError(null);
                                }}
                                className="text-amber-600 hover:text-amber-700 font-semibold transition-colors"
                            >
                                {mode === 'login' ? 'Register here' : 'Login here'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
