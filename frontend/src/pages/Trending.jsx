import React from 'react';
import { Navigate } from 'react-router-dom';
import PostList from '../components/PostList';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Trending = () => {
  const { isDarkMode } = useTheme();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={`min-h-screen ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50'
    }`}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center mb-8">
          <h2 className={`text-3xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <span className={`text-transparent bg-clip-text ${
              isDarkMode
                ? 'bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'
            }`}>
              Trending Posts
            </span>
          </h2>
        </div>
        <PostList sortBy="trending" />
      </div>
      <Footer />
    </div>
  );
};

export default Trending;
