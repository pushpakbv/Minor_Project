import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/posts/${postId}/comments`);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleAddComment = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `/posts/${postId}/comment`,
        { comment: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="comments mt-4">
      <h3 className="text-lg font-semibold">Comments</h3>
      <div>
        {comments.map((comment, index) => (
          <p key={index} className="text-sm text-gray-600 mt-2">
            {comment.comment}
          </p>
        ))}
      </div>
      <div className="mt-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full border p-2 rounded"
        />
        <button
          onClick={handleAddComment}
          className="mt-2 bg-blue-600 text-white py-2 px-4 rounded"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default Comments;
