import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import Post from './Post';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchPosts = async () => {
      try {
        const response = await axios.get('/posts');
        setPosts(response.data.posts || response.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching posts:', err);
        if (err.response?.status === 401) {
          navigate('/login');
        } else {
          setError('Error fetching posts');
        }
        setLoading(false);
      }
    };

    fetchPosts();
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        {error}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-8 shadow-xl">
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No posts</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new post.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {posts.map((post) => (
        <div key={post._id} className="transform transition-all duration-300 hover:scale-[1.02]">
          <Post post={post} />
        </div>
      ))}
    </div>
  );
};

export default PostList;
