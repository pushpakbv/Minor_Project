import React, { useState } from 'react';
import axios from '../utils/axios';

const CreatePost = () => {
  const [text, setText] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    setMedia(file);

    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setMediaPreview(fileUrl);
    } else {
      setMediaPreview(null);
    }
  };

  const handlePostCreation = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('text', text);
    if (media) formData.append('media', media);

    try {
      setError('');
      setSuccess('');
      const token = localStorage.getItem('token');
      await axios.post('/posts/create', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Post created successfully!');
      setText('');
      setMedia(null);
      setMediaPreview(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
      console.error('Error creating post:', err);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Create a Post</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {success && <p className="text-green-500 text-center mb-4">{success}</p>}
      <form onSubmit={handlePostCreation}>
        <textarea
          className="w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <div className="mb-4">
          <label className="block text-gray-600 mb-2 font-medium">Attach an image or video:</label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleMediaChange}
            className="block w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer"
          />
          {mediaPreview && (
            <div className="mt-4">
              {media?.type.startsWith('image') ? (
                <img src={mediaPreview} alt="Preview" className="max-w-full rounded-lg shadow" />
              ) : (
                <video controls className="max-w-full rounded-lg shadow">
                  <source src={mediaPreview} />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
