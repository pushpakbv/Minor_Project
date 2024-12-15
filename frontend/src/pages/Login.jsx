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
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50'
    }`}>
      <div className={`max-w-md w-full transform transition-all duration-300 ease-in-out hover:scale-[1.02] rounded-xl shadow-2xl p-8 space-y-6 ${
        isDarkMode 
          ? 'bg-gray-800/90 backdrop-blur-sm shadow-gray-900/50' 
          : 'bg-white/70 backdrop-blur-sm shadow-lg border border-white/20'
      }`}>
        <div className="transform transition-all">
          <img
            className="mx-auto h-16 w-auto rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
            src="/logo.jpeg"
            alt="Logo"
          />
          <h2 className={`mt-6 text-center text-3xl font-extrabold tracking-tight ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          } transition-colors duration-300`}>
            Welcome Back
          </h2>
          <p className={`mt-2 text-center text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          } transition-colors duration-300`}>
            Sign in to continue to your account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/90 backdrop-blur-sm text-white p-4 rounded-lg text-sm shadow-lg animate-shake">
              {error}
            </div>
          )}
          <div className="space-y-5">
            <div className="transform transition-all duration-300">
              <label htmlFor="email" className={`block text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              } transition-colors duration-300`}>
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`mt-1 block w-full px-4 py-3 border rounded-lg text-sm transition-all duration-300
                  ${isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500' 
                    : 'bg-white/90 border-indigo-100 text-gray-900 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm'
                  } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="transform transition-all duration-300">
              <label htmlFor="password" className={`block text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              } transition-colors duration-300`}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={`mt-1 block w-full px-4 py-3 border rounded-lg text-sm transition-all duration-300
                  ${isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500' 
                    : 'bg-white/90 border-indigo-100 text-gray-900 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm'
                  } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
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
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white 
                ${isLoading ? 'bg-gray-400' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'}
                transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 
                ${isDarkMode ? 'focus:ring-indigo-500 ring-offset-gray-800' : 'focus:ring-blue-500 ring-offset-white'}`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
          
          <div className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Don't have an account?{' '}
            <Link to="/signup" className={`font-medium ${
              isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-blue-600 hover:text-blue-500'
            } transition-colors duration-300`}>
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
