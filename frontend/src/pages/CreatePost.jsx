import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { useTheme } from '../context/ThemeContext';

const CreatePost = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [text, setText] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        setError('File size should be less than 50MB');
        return;
      }

      // Check file type
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'video/mp4',
        'video/webm',
        'video/ogg'
      ];

      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Only images and videos are allowed.');
        return;
      }

      setMedia(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const handlePostCreation = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('text', text);
      if (media) formData.append('media', media);

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} py-8 transition-colors duration-300`}>
      <div className={`max-w-lg mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 transition-colors duration-300`}>
        <h2 className={`text-2xl font-bold text-center mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Create a Post</h2>
        
        {error && <p className={`text-red-500 text-center mb-4 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>{error}</p>}
        {success && <p className={`text-green-500 text-center mb-4 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`}>{success}</p>}
        <form onSubmit={handlePostCreation}>
          <textarea
            className={`w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            rows="4"
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <div className="mb-4">
            <label className={`block text-gray-600 mb-2 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Attach an image or video:</label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className={`block w-full text-sm text-gray-900 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'} rounded-lg cursor-pointer`}
            />
            {mediaPreview && (
              <div className="mt-4">
                {media?.type.startsWith('image') ? (
                  <img src={mediaPreview} alt="Preview" className="max-w-full rounded-lg shadow-md" />
                ) : (
                  <video controls className="max-w-full rounded-lg shadow-md">
                    <source src={mediaPreview} />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition ${isDarkMode ? 'hover:bg-blue-400' : 'hover:bg-blue-600'} disabled:opacity-50`}
          >
            {isLoading ? 'Creating...' : 'Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
