import React from 'react';
import PostList from '../components/PostList';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto mt-6">
        <h1 className="text-2xl font-bold mb-6">Welcome to TheCipher</h1>
        <PostList />
      </div>
    </div>
  );
};

export default Home;
