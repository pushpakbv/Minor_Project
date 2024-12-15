import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { Link } from 'react-router-dom';
import { getFullImageUrl } from '../utils/imageUtils';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Post = ({ post }) => {
  const [likes, setLikes] = useState(post.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const { user: currentUser, isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme();

  // Update state when post data changes
  useEffect(() => {
    setLikes(post.likes?.length || 0);
    setIsLiked(post.isLiked || false);
  }, [post.likes, post.isLiked]);

  const handleLike = async (postId) => {
    if (!isAuthenticated) {
      // Show a toast or alert that user needs to login
      console.log('Please login to like posts');
      return;
    }

    try {
      setLikeLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      // Optimistically update UI
      const prevLikes = likes;
      const prevIsLiked = isLiked;
      setIsLiked(!isLiked);
      setLikes(isLiked ? likes - 1 : likes + 1);

      const response = await axios.post(`/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.success) {
        setLikes(response.data.likes);
        setIsLiked(response.data.isLiked);
      } else {
        // Revert on failure
        setLikes(prevLikes);
        setIsLiked(prevIsLiked);
      }
    } catch (error) {
      console.error('Error liking post:', error);
      // Revert the like state if the request fails
      setLikes(prevLikes);
      setIsLiked(prevIsLiked);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setIsLoading(true);
      const response = await axios.post(`/posts/${post._id}/comment`, 
        { comment: newComment }
      );

      setComments([...comments, response.data.comment]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isVideo = post.media?.match(/\.(mp4|webm|ogg)$/i);

  return (
    <div className={`rounded-lg shadow-md p-4 mb-4 ${isDarkMode ? 'bg-[#1a1a1b]' : 'bg-white'}`}>
      {/* User info section */}
      <div className="flex items-center mb-4">
        <Link to={`/profile/${post.user._id}`} className="flex items-center hover:opacity-90 transition-opacity">
          <img
            src={getFullImageUrl(post.user.profileImage)}
            alt={post.user.username}
            className="w-10 h-10 rounded-full object-cover mr-3 border border-gray-200"
            onError={(e) => {
              e.target.src = '/default-avatar.png';
            }}
          />
          <div>
            <h3 className={`font-semibold hover:text-blue-600 transition-colors ${isDarkMode ? 'text-[#d7dadc]' : 'text-gray-900'}`}>
              {post.user.username}
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </Link>
      </div>
      
      {/* Post content */}
      <p className={`mb-4 ${isDarkMode ? 'text-[#d7dadc]' : 'text-gray-800'}`}>{post.text}</p>

      {/* Media content */}
      {post.media && (
        <div className="mb-4 rounded-lg overflow-hidden">
          {isVideo ? (
            <video 
              controls 
              className="w-full rounded-lg"
              preload="metadata"
            >
              <source src={getFullImageUrl(post.media)} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={getFullImageUrl(post.media)}
              alt="Post media"
              className="w-full rounded-lg"
              onError={(e) => {
                console.error('Error loading media:', e);
                e.target.style.display = 'none';
              }}
            />
          )}
        </div>
      )}

      {/* Like section */}
      <div className="flex items-center space-x-4 mb-4 py-2">
        <div 
          className={`flex items-center space-x-1 cursor-pointer ${
            isLiked ? 'text-blue-500' : isDarkMode ? 'text-white' : 'text-gray-500'
          } hover:text-blue-500 transition-colors ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={!isAuthenticated || likeLoading ? undefined : () => handleLike(post._id)}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5"
            fill={isLiked ? "currentColor" : "none"}
            viewBox="0 0 24 24" 
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
            />
          </svg>
          <span>{likes}</span>
        </div>
      </div>

      {/* Comments section */}
      <div className="space-y-4">
        {comments.map((comment, index) => (
          <div key={index} className={`flex space-x-3 p-3 rounded-lg ${isDarkMode ? 'bg-[#272729]' : 'bg-gray-50'}`}>
            <Link to={`/profile/${comment.user?._id}`} className="flex-shrink-0">
              <img
                src={getFullImageUrl(comment.user?.profileImage)}
                alt={comment.user?.username}
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
                onError={(e) => {
                  e.target.src = '/default-avatar.png';
                }}
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link to={`/profile/${comment.user?._id}`} className={`font-medium hover:text-blue-600 transition-colors ${isDarkMode ? 'text-[#d7dadc]' : 'text-gray-900'}`}>
                {comment.user?.username}
              </Link>
              <p className={`mt-1 ${isDarkMode ? 'text-[#d7dadc]' : 'text-gray-700'}`}>{comment.comment}</p>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {new Date(comment.createdAt).toLocaleDateString()} at {new Date(comment.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Comment form */}
      <form onSubmit={handleComment} className="mt-4">
        <div className="flex space-x-3">
          <img
            src={getFullImageUrl(currentUser?.profileImage)}
            alt="Your profile"
            className="w-8 h-8 rounded-full object-cover border border-gray-200"
            onError={(e) => {
              e.target.src = '/default-avatar.png';
            }}
          />
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className={`w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${isDarkMode ? 'bg-[#272729] text-[#d7dadc]' : 'bg-white text-gray-800'}`}
              rows="2"
            />
            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                disabled={isLoading || !newComment.trim()}
                className={`px-4 py-2 rounded-lg text-white ${
                  isLoading || !newComment.trim()
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 transition-colors'
                }`}
              >
                {isLoading ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Post;
