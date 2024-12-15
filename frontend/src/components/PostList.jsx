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
      <div className="text-center py-8 text-gray-600">
        Loading posts...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {posts.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">No posts to display.</div>
      ) : (
        posts.map((post) => (
          <Post key={post._id} post={post} />
        ))
      )}
    </div>
  );
};

export default PostList;
