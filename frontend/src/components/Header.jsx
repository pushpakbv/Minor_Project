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
    <header className={`${isDarkMode ? 'bg-slate-800' : 'gradient-primary'} text-white py-4 shadow-md transition-colors duration-300`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center text-2xl font-bold">
          <img src="/logo.jpeg" alt="Logo" className="w-10 h-10 mr-2 rounded-full" />
          TheCipher
        </Link>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className={`px-3 py-1 rounded-md transition-colors duration-300 ${
              isDarkMode
                ? 'bg-slate-700 text-white hover:bg-slate-600'
                : 'bg-white text-blue-600 hover:bg-gray-100'
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
                    className="w-8 h-8 rounded-full object-cover border-2 border-white"
                    onError={(e) => {
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                </div>
              </Link>
              <Link 
                to="/create-post" 
                className="btn-primary"
              >
                Create Post
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={`px-4 py-2 rounded-md text-white transition-colors duration-300 ${
                  isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
                } disabled:opacity-50`}
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </>
          )}
          {!isAuthenticated && (
            <>
              <Link to="/login" className="btn-primary">
                Login
              </Link>
              <Link to="/signup" className="btn-primary">
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
