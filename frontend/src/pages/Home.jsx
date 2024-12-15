import React from 'react';
import PostList from '../components/PostList';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50'
    }`}>
      <HeroSection />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className={`text-3xl font-bold mb-8 text-center ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          <span className={`text-transparent bg-clip-text ${
            isDarkMode
              ? 'bg-gradient-to-r from-blue-400 to-emerald-400'
              : 'bg-gradient-to-r from-indigo-500 to-cyan-500'
          }`}>
            Latest Posts
          </span>
        </h2>
        <div className={`rounded-xl shadow-xl overflow-hidden ${
          isDarkMode 
            ? 'bg-gray-800/50 backdrop-blur-sm' 
            : 'bg-white/70 backdrop-blur-sm border border-white/20'
        }`}>
          <PostList />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
