import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
      const response = await axios.post(`/posts/${postId}/comment`, 
        { comment: newComment }
      );
      
      setComments([...comments, response.data.comment]);
      setNewComment('');
      setError('');
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  if (isLoading && !comments.length) {
    return <div className="text-center py-4">Loading comments...</div>;
  }

  return (
    <div className="comments mt-4">
      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}
      
      <div className="space-y-4">
        {comments.map((comment, index) => (
          <div key={index} className="flex items-start space-x-3">
            <img
              src={comment.user?.profileImage || '/default-avatar.png'}
              alt={comment.user?.username}
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                e.target.src = '/default-avatar.png';
              }}
            />
            <div className="flex-1">
              <p className="font-semibold text-sm">{comment.user?.username}</p>
              <p className="text-sm text-gray-600">{comment.comment}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleAddComment} className="mt-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full border p-2 rounded resize-none focus:ring-2 focus:ring-blue-500"
          rows="2"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !newComment.trim()}
          className={`mt-2 px-4 py-2 rounded text-white ${
            isLoading || !newComment.trim() 
              ? 'bg-blue-300' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  );
};

export default Comments;
