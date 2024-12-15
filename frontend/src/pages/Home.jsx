import React from 'react';
import { Navigate } from 'react-router-dom';
import PostList from '../components/PostList';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isDarkMode } = useTheme();
  const { isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={`min-h-screen ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50'
    }`}>
      <HeroSection />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className={`text-2xl font-bold mb-6 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Latest Posts
        </h2>
        <PostList />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
