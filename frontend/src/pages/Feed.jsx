import React from 'react';
import PostList from '../components/PostList';

const Feed = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">TheCipher</h1>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
          >
            Logout
          </button>
        </div>
      </header>
      <div className="feed max-w-4xl mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-6">Your Feed</h1>
      <PostList />
    </div>
    </div>
  );
};

export default Feed;
