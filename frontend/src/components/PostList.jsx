import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import Post from './Post';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(response.data.posts);
      setError(null);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative" role="alert">
          <strong className="font-medium">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-8 px-4 sm:px-6 lg:px-8">
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-8 shadow-xl">
            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No posts</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new post.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <div key={post._id} className="transform transition-all duration-300 hover:scale-[1.02]">
              <Post post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;
