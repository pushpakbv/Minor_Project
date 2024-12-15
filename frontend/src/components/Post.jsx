import React, { useState } from 'react';
import axios from '../utils/axios';
import { Link } from 'react-router-dom';
import { getFullImageUrl } from '../utils/imageUtils';
import { useAuth } from '../context/AuthContext';

const Post = ({ post }) => {
  const [likes, setLikes] = useState(post.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user: currentUser } = useAuth();

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setLikes(response.data.likes);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error liking post:', error);
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
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
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
            <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
              {post.user.username}
            </h3>
            <p className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </Link>
      </div>
      
      {/* Post content */}
      <p className="mb-4 text-gray-800">{post.text}</p>

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
      <div className="flex items-center space-x-4 mb-4 border-t border-b border-gray-100 py-2">
        <button 
          className={`flex items-center space-x-1 ${isLiked ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-600 transition-colors`}
          onClick={() => handleLike(post._id)}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill={isLiked ? "currentColor" : "none"} 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
            />
          </svg>
          <span>{likes}</span>
        </button>
      </div>

      {/* Comments section */}
      <div className="space-y-4">
        {comments.map((comment, index) => (
          <div key={index} className="flex space-x-3 bg-gray-50 p-3 rounded-lg">
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
              <Link to={`/profile/${comment.user?._id}`} className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                {comment.user?.username}
              </Link>
              <p className="text-gray-700 mt-1">{comment.comment}</p>
              <p className="text-xs text-gray-500 mt-1">
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
              className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
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
