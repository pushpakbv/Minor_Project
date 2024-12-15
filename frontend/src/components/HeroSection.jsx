import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HeroSection = () => {
  const { isDarkMode } = useTheme();
  const { isAuthenticated } = useAuth();

  return (
    <div className={`relative overflow-hidden ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50'
    }`}>
      {/* Decorative circles */}
      <div className={`absolute top-0 left-0 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob ${
        isDarkMode ? 'bg-purple-300' : 'bg-blue-300'
      }`}></div>
      <div className={`absolute top-0 right-0 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 ${
        isDarkMode ? 'bg-yellow-300' : 'bg-indigo-300'
      }`}></div>
      <div className={`absolute -bottom-8 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 ${
        isDarkMode ? 'bg-pink-300' : 'bg-cyan-300'
      }`}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <div className="text-center">
          <h1 className={`text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Welcome to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">
              TheCipher
            </span>
          </h1>
          <p className={`mt-3 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:text-xl md:max-w-3xl ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Share your thoughts, connect with others, and discover amazing content in our vibrant community.
          </p>
          
          {!isAuthenticated && (
            <div className="mt-8 flex justify-center gap-4">
              <Link
                to="/signup"
                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600'
                    : 'bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600'
                }`}
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className={`inline-flex items-center px-6 py-3 border text-base font-medium rounded-md transition-all duration-300 ${
                  isDarkMode
                    ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                    : 'border-indigo-200 text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
