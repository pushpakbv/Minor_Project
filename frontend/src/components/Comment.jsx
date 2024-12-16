import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { getFullImageUrl } from '../utils/imageUtils';

const Comments = ({ postId }) => {
  const { user: currentUser } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/posts/${postId}/comments`);
      setComments(response.data.comments);
      setError('');
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setIsLoading(true);
      const response = await axios.post(`/posts/${postId}/comment`, { 
        content: newComment 
      });

      // Add the new comment to the list with user data
      setComments(prevComments => [{
        ...response.data.comment,
        user: {
          id: currentUser.id,
          username: currentUser.username,
          profileImage: currentUser.profileImage
        }
      }, ...prevComments]);

      setNewComment('');
      setError('');
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !comments.length) {
    return <div className="text-center py-4">Loading comments...</div>;
  }

  return (
    <div className="comments mt-4 space-y-4">
      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}
      
      <form onSubmit={handleAddComment} className="flex items-center space-x-2">
        <img
          src={getFullImageUrl(currentUser?.profileImage)}
          alt={currentUser?.username}
          className="w-8 h-8 rounded-full object-cover"
        />
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !newComment.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Post
        </button>
      </form>

      <div className="space-y-4">
        {comments.map(comment => (
          <div key={comment._id} className="flex space-x-2">
            <img
              src={getFullImageUrl(comment.user?.profileImage)}
              alt={comment.user?.username}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <div className="font-semibold">{comment.user?.username}</div>
              <div className="text-sm">{comment.content}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
