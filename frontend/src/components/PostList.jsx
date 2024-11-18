import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import Post from './Post';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/posts');
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <div>Loading posts...</div>;

  return (
    <div className="post-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.length === 0 ? (
        <div className="text-center text-gray-500">No posts to display.</div>
      ) : (
        posts.map((post) => (
          <Post key={post._id} post={post} />
        ))
      )}
    </div>
  );
};

export default PostList;
