import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import axios from '../utils/axios';
import Post from '../components/Post';
import Footer from '../components/Footer';

const YourPosts = () => {
  const { isDarkMode } = useTheme();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get('/posts/user-posts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPosts(response.data.posts || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      setError('Failed to load your posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className={`text-3xl font-bold mb-8 text-center ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          <span className={`text-transparent bg-clip-text ${
            isDarkMode
              ? 'bg-gradient-to-r from-blue-400 to-emerald-400'
              : 'bg-gradient-to-r from-indigo-500 to-cyan-500'
          }`}>
            Your Posts
          </span>
        </h2>
        <div className={`rounded-xl shadow-xl overflow-hidden ${
          isDarkMode 
            ? 'bg-gray-800/50 backdrop-blur-sm' 
            : 'bg-white/70 backdrop-blur-sm border border-white/20'
        }`}>
          <div className="max-w-2xl mx-auto space-y-6 py-8 px-4 sm:px-6 lg:px-8">
            {error ? (
              <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative" role="alert">
                <strong className="font-medium">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            ) : posts.length === 0 ? (
              <div className={`text-center p-8 rounded-lg ${
                isDarkMode ? 'bg-gray-700/50' : 'bg-white/50'
              } backdrop-blur-sm border border-gray-200 dark:border-gray-700`}>
                <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  You haven't created any posts yet.
                </p>
              </div>
            ) : (
              posts.map(post => (
                <Post 
                  key={post._id} 
                  post={post}
                  onPostUpdate={fetchUserPosts}
                  showDeleteButton={true}
                />
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default YourPosts;
