import React from 'react';
import PostList from '../components/PostList';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'app-container-dark' : 'app-container'}`}>
      <HeroSection />
      <div className="max-w-6xl mx-auto mt-6 p-4">
        <h2 className={`text-3xl font-bold mb-6 text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Latest Posts
        </h2>
        <div className={`card ${isDarkMode ? 'card-dark' : 'card-light'}`}>
          <PostList />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
