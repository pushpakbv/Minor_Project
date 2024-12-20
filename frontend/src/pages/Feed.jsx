import React from 'react';
import PostList from '../components/PostList';

const Feed = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="feed max-w-4xl mx-auto mt-6">
        <h1 className="text-2xl font-bold mb-6">Your Feed</h1>
        <PostList />
      </div>
    </div>
  );
};

export default Feed;
