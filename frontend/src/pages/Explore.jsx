import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import PostList from '../components/PostList';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { FiShuffle } from 'react-icons/fi';

const Explore = () => {
  const { isDarkMode } = useTheme();
  const { isAuthenticated } = useAuth();
  const [shuffleKey, setShuffleKey] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleShuffle = () => {
    setIsShuffling(true);
    // Update the key to force a re-render of PostList with new random order
    setShuffleKey(prev => prev + 1);
    // Reset shuffle animation after a delay
    setTimeout(() => setIsShuffling(false), 500);
  };

  return (
    <div className={`min-h-screen ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50'
    }`}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center mb-8">
          <h2 className={`text-3xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <span className={`text-transparent bg-clip-text ${
              isDarkMode
                ? 'bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'
            }`}>
              Explore Posts
            </span>
          </h2>
          
          <button
            onClick={handleShuffle}
            className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 transform ${
              isShuffling ? 'scale-95' : 'hover:scale-105'
            } ${
              isDarkMode
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-indigo-500 hover:bg-indigo-600 text-white'
            } shadow-lg hover:shadow-xl`}
            disabled={isShuffling}
          >
            <FiShuffle className={`w-5 h-5 ${isShuffling ? 'animate-spin' : ''}`} />
            <span>Shuffle Posts</span>
          </button>
          
          <p className={`mt-4 text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Discover new posts with each shuffle!
          </p>
        </div>

        <div className={`transition-opacity duration-300 ${
          isShuffling ? 'opacity-50' : 'opacity-100'
        }`}>
          <PostList key={shuffleKey} sortBy="random" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Explore;
