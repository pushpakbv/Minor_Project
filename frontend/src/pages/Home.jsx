import React from 'react';
import PostList from '../components/PostList';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
      <HeroSection />
      <div className="max-w-6xl mx-auto mt-6 p-4">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Latest Posts
        </h2>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <PostList />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
