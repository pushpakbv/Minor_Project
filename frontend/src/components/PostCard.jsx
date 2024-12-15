import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { AiOutlineHeart, AiFillHeart, AiOutlineComment } from 'react-icons/ai';
import { formatDistanceToNow } from 'date-fns';

const PostCard = ({ post, onPostUpdate }) => {
  const { isDarkMode } = useTheme();

  const handleLike = async () => {
    try {
      // Implement like functionality here
      if (onPostUpdate) {
        onPostUpdate();
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <div className={`rounded-lg shadow-md ${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    } overflow-hidden`}>
      <div className="p-4">
        {/* User Info */}
        <div className="flex items-center mb-4">
          <img
            src={post.user?.avatar || '/default-avatar.png'}
            alt={post.user?.username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="ml-3">
            <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {post.user?.username || 'Anonymous'}
            </p>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>

        {/* Post Content */}
        <Link to={`/post/${post._id}`}>
          <h2 className={`text-xl font-semibold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {post.title}
          </h2>
          <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {post.text}
          </p>
          {post.media && (
            <img
              src={post.media}
              alt="Post content"
              className="w-full h-auto rounded-lg mb-4"
            />
          )}
        </Link>

        {/* Interactions */}
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
          >
            {post.isLiked ? (
              <AiFillHeart className="w-6 h-6 text-red-500" />
            ) : (
              <AiOutlineHeart className="w-6 h-6" />
            )}
            <span>{post.likes?.length || 0}</span>
          </button>
          <Link
            to={`/post/${post._id}`}
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
          >
            <AiOutlineComment className="w-6 h-6" />
            <span>{post.comments?.length || 0}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
