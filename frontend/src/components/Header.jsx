import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getFullImageUrl } from '../utils/imageUtils';

const Header = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
  };

  return (
    <header className={`${
      isDarkMode 
        ? 'bg-gray-800/90 backdrop-blur-sm border-b border-gray-700' 
        : 'bg-white/80 backdrop-blur-sm border-b border-indigo-100'
    } sticky top-0 z-50 transition-all duration-300`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 group">
          <img 
            src="/logo.jpeg" 
            alt="Logo" 
            className="w-10 h-10 rounded-full ring-2 ring-indigo-500/20 group-hover:ring-indigo-500/40 transition-all duration-300" 
          />
          <span className={`text-2xl font-bold ${
            isDarkMode 
              ? 'text-white' 
              : 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500'
          }`}>
            TheCipher
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className={`px-3 py-1.5 rounded-lg transition-all duration-300 ${
              isDarkMode
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
            }`}
          >
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          
          {isAuthenticated && user && (
            <>
              <Link to="/profile" className="flex items-center hover:opacity-90 transition-opacity">
                <div className="relative">
                  <img
                    src={getFullImageUrl(user.profileImage)}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20 hover:ring-indigo-500/40 transition-all duration-300"
                    onError={(e) => {
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                </div>
              </Link>
              <Link 
                to="/create-post" 
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white'
                }`}
              >
                Create Post
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600'
                } disabled:opacity-50`}
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </>
          )}
          {!isAuthenticated && (
            <>
              <Link 
                to="/login" 
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600'
                }`}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white'
                }`}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
