import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getFullImageUrl } from '../utils/imageUtils';

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated, updateUser } = useAuth();
  const { isDarkMode } = useTheme();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [error, setError] = useState(null);

  const isOwnProfile = !userId || userId === currentUser?.id;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // For own profile, use current user data initially
    if (!userId && currentUser) {
      setUserData({
        ...currentUser,
        profileImage: currentUser.profileImage || '/default-avatar.png'
      });
      setBio(currentUser.bio || '');
    }

    // Always fetch fresh data
    const targetId = userId || currentUser?.id;
    if (targetId) {
      fetchUserData(targetId);
    }
  }, [userId, currentUser?.id, isAuthenticated, navigate]);

  const fetchUserData = async (targetId) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await axios.get(`/users/profile/${targetId}`);
      const fetchedData = {
        ...response.data,
        profileImage: response.data.profileImage || '/default-avatar.png'
      };
      
      setUserData(fetchedData);
      setBio(fetchedData.bio || '');
      
      // Update auth context if it's the current user
      if (!userId || targetId === currentUser?.id) {
        updateUser(fetchedData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // If API fails but we have current user data, use that for own profile
      if (!userId && currentUser && error.response?.status !== 404) {
        const fallbackData = {
          ...currentUser,
          profileImage: currentUser.profileImage || '/default-avatar.png'
        };
        setUserData(fallbackData);
        setBio(fallbackData.bio || '');
      } else if (error.response?.status === 404) {
        setError('Profile not found');
      } else {
        setError('Failed to load profile data. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = useCallback(async (e) => {
    const file = e.target.files[0];
    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png'];
      if (!validImageTypes.includes(file.type)) {
        setError('Only JPEG and PNG formats are supported');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }

      try {
        setIsImageLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('profileImage', file);

        const response = await axios.put('/users/profile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const updatedUserData = response.data;
        setUserData(updatedUserData);
        if (isOwnProfile) {
          updateUser(updatedUserData);
        }

        // Clear the file input
        e.target.value = '';
      } catch (error) {
        console.error('Error updating profile picture:', error);
        setError(error.response?.data?.error || 'Failed to update profile picture');
      } finally {
        setIsImageLoading(false);
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(null);
        setProfileImage(null);
      }
    }
  }, [imagePreview, isOwnProfile, updateUser]);

  const handleSave = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('bio', bio);

      const response = await axios.put('/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedUserData = response.data;
      setUserData(updatedUserData);
      if (isOwnProfile) {
        updateUser(updatedUserData);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  }, [bio, isOwnProfile, updateUser]);

  if (!userData && !error) {
    return (
      <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900'
      }`}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900'
      }`}>
        <div className="p-8 text-center">
          <div className="text-red-500 font-medium">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 text-gray-900'
    }`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              isDarkMode
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                : 'bg-white/80 hover:bg-white/90 text-indigo-600 backdrop-blur-sm'
            }`}
          >
            ← Back
          </button>
        </div>
        <div className={`max-w-3xl mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl transition-all duration-300`}>
          {isLoading || isImageLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              <div className="relative group">
                <div className={`w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 transition-all duration-300 ${
                  isDarkMode ? 'ring-gray-700 group-hover:ring-indigo-500' : 'ring-gray-100 group-hover:ring-blue-500'
                }`}>
                  <img
                    src={getFullImageUrl(userData.profileImage)}
                    alt={`${userData.username}'s profile`}
                    className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                
                {isOwnProfile && (
                  <div className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/2">
                    <label htmlFor="profile-image" className={`flex items-center justify-center w-10 h-10 rounded-full cursor-pointer 
                      transition-all duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-700 hover:bg-indigo-600 text-gray-300 hover:text-white' 
                          : 'bg-white hover:bg-blue-500 text-gray-600 hover:text-white'
                      } shadow-lg`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </label>
                    <input
                      type="file"
                      id="profile-image"
                      className="hidden"
                      accept="image/jpeg,image/png"
                      onChange={handleImageChange}
                    />
                  </div>
                )}
              </div>

              <div className="text-center space-y-2">
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {userData.username}
                </h1>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {userData.email}
                </p>
              </div>

              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors duration-300`}>
                {isEditing ? (
                  <div className="space-y-4">
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className={`w-full p-3 rounded-lg transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-800 text-white border-gray-600 focus:border-indigo-500' 
                          : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500'
                      } border focus:ring-2 focus:ring-opacity-50`}
                      rows="4"
                      placeholder="Write something about yourself..."
                    />
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setBio(userData.bio || '');
                        }}
                        className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                          isDarkMode
                            ? 'bg-gray-600 hover:bg-gray-500 text-gray-200'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 
                          text-white rounded-lg transition-all duration-300 transform hover:scale-105"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-wrap`}>
                      {userData.bio || 'No bio yet.'}
                    </p>
                    {isOwnProfile && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className={`absolute top-0 right-0 p-2 rounded-lg transition-colors duration-300 ${
                          isDarkMode
                            ? 'text-gray-400 hover:text-white hover:bg-gray-600'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                        }`}
                        aria-label="Edit bio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
