import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from '../utils/axios';

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.token && response.data.user) {
        login(response.data.token, response.data.user);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-[#1a1a1b]' : 'bg-blue-50'}`}>
      <div className={`max-w-md w-full rounded-lg shadow-md p-8 space-y-6 ${isDarkMode ? 'bg-[#272729]' : 'bg-white'}`}>
        <div>
          <img
            className="mx-auto h-12 w-auto rounded-full"
            src="/logo.jpeg"
            alt="Logo"
          />
          <h2 className={`mt-6 text-center text-3xl font-bold ${isDarkMode ? 'text-[#d7dadc]' : 'text-gray-900'}`}>
            Create your account
          </h2>
          <p className={`mt-2 text-center text-sm ${isDarkMode ? 'text-[#d7dadc]' : 'text-gray-600'}`}>
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-[#0079d3] hover:text-[#006cbd] transition-colors duration-300"
            >
              Sign in
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className={`block text-sm font-medium ${isDarkMode ? 'text-[#d7dadc]' : 'text-gray-700'}`}>
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0079d3] focus:border-transparent ${
                  isDarkMode 
                    ? 'bg-[#1a1a1b] border-[#343536] text-[#d7dadc]' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? 'text-[#d7dadc]' : 'text-gray-700'}`}>
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0079d3] focus:border-transparent ${
                  isDarkMode 
                    ? 'bg-[#1a1a1b] border-[#343536] text-[#d7dadc]' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Enter your email"
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
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0079d3] focus:border-transparent ${
                  isDarkMode 
                    ? 'bg-[#1a1a1b] border-[#343536] text-[#d7dadc]' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Enter your password"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className={`block text-sm font-medium ${isDarkMode ? 'text-[#d7dadc]' : 'text-gray-700'}`}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0079d3] focus:border-transparent ${
                  isDarkMode 
                    ? 'bg-[#1a1a1b] border-[#343536] text-[#d7dadc]' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0079d3] hover:bg-[#006cbd] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0079d3] disabled:opacity-50"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
