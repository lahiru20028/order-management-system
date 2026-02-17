import { useState } from 'react';
import axios from 'axios';

export default function Login({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      // For now, simulate login. Replace with your actual backend endpoint
      if (formData.email === 'admin@example.com' && formData.password === 'password123') {
        // Simulate successful login
        const userData = {
          id: 1,
          email: formData.email,
          name: 'Admin User',
          token: 'fake-jwt-token-' + Date.now(),
        };
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('authToken', userData.token);
        onLoginSuccess(userData);
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <img
            src="/src/LOGO.png"
            alt="Logo"
            className="h-16 w-16 mx-auto rounded-full ring-4 ring-brand-accent mb-4"
          />
          <h1 className="text-3xl font-bold" style={{ color: '#1A2B23' }}>
            Order Management
          </h1>
          <p className="text-gray-600 mt-2">Professional Order Tracking System</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent transition"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent transition"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-accent hover:bg-opacity-90 text-brand-primary font-bold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Demo Credentials:</p>
            <div className="bg-gray-50 rounded p-3 text-xs text-gray-700 space-y-1">
              <p>
                <strong>Email:</strong> admin@example.com
              </p>
              <p>
                <strong>Password:</strong> password123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
