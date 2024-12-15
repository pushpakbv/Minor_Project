import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from '../utils/axios';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('/auth/login', formData);
      console.log('Login response:', response.data);
      if (response.data.token && response.data.user) {
        login(response.data.token, response.data.user);
        navigate('/');
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-[#1a1a1b]' : 'bg-blue-50'}`}>
      <div className={`max-w-md w-full rounded-lg shadow-md p-8 space-y-6 ${isDarkMode ? 'bg-[#272729]' : 'bg-white'}`}>
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="/logo.jpeg"
            alt="Logo"
          />
          <h2 className={`mt-6 text-center text-3xl font-bold ${isDarkMode ? 'text-[#d7dadc]' : 'text-gray-900'}`}>
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500 text-white p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? 'text-[#d7dadc]' : 'text-gray-700'}`}>
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`mt-1 block w-full px-3 py-2 border rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0079d3] focus:border-transparent ${
                  isDarkMode 
                    ? 'bg-[#1a1a1b] border-[#343536] text-[#d7dadc]' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${isDarkMode ? 'text-[#d7dadc]' : 'text-gray-700'}`}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={`mt-1 block w-full px-3 py-2 border rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0079d3] focus:border-transparent ${
                  isDarkMode 
                    ? 'bg-[#1a1a1b] border-[#343536] text-[#d7dadc]' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0079d3] hover:bg-[#006cbd] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0079d3] disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-sm text-center">
            <Link to="/register" className="font-medium text-[#0079d3] hover:text-[#006cbd]">
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
