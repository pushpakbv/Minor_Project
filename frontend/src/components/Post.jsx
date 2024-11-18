import React, { useState } from 'react';
import axios from '../utils/axios';
import Comments from './Comment';

const Post = ({ post }) => {
  const [likes, setLikes] = useState(post.likes?.length || 0);
  const [mediaError, setMediaError] = useState(false);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`/posts/${post._id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLikes(response.data.likes);
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };

  const renderMedia = () => {
    if (!post.media || mediaError) return null;

    const handleMediaError = () => {
      console.error('Media failed to load:', post.media);
      setMediaError(true);
    };

    if (post.media.endsWith('.mp4')) {
      return (
        <video 
          src={post.media} 
          controls 
          className="w-full h-64 rounded object-cover"
          onError={handleMediaError}
        />
      );
    }

    return (
      <img 
        src={post.media} 
        alt="Post content"
        className="w-full h-64 rounded object-cover"
        onError={handleMediaError}
        loading="lazy"
      />
    );
  };

  return (
    <div className="post bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-4">
        <p className="text-gray-700">{post.text}</p>
        {post.media && !mediaError && (
          <div className="media mt-3 min-h-[200px] flex items-center justify-center">
            {renderMedia()}
          </div>
        )}
        <div className="flex items-center justify-between mt-3">
          <button
            onClick={handleLike}
            className="text-blue-500 hover:text-blue-700 focus:outline-none focus:ring focus:ring-blue-300 transition-transform transform hover:scale-105"
          >
            ❤️ {likes}
          </button>
        </div>
        <Comments postId={post._id} />
      </div>
    </div>
  );
};

export default Post;
