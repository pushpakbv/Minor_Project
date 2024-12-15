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
  const [error, setError] = useState(null);

  const isOwnProfile = !userId || userId === currentUser?.id;

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

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
      setUserData(response.data);
      setBio(response.data.bio || '');
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 404) {
        setError('Profile not found');
      } else {
        setError('Failed to load profile data. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = useCallback((e) => {
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
      setProfileImage(file);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
    }
  }, [imagePreview]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('bio', bio);
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

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

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
      setProfileImage(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  }, [bio, imagePreview, isOwnProfile, profileImage, updateUser]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setBio(userData?.bio || '');
    setProfileImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  }, [imagePreview, userData?.bio]);

  if (!userData && !error) {
    return <div className={`text-center py-8 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}><svg className="animate-spin h-5 w-5 mr-2 inline" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>Loading...</div>;
  }

  if (error) {
    return <div className={`text-center text-red-500 py-8 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{error}</div>;
  }

  return (
    <div className={`max-w-4xl mx-auto p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors duration-300`}>
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center text-gray-600 hover:text-gray-800 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </button>
      </div>
      <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} transition-colors duration-300`}>
        <div className="relative h-48 bg-gradient-to-r from-blue-400 to-teal-400">
          <img src="/logo.jpeg" alt="Logo" className="absolute top-4 left-4 w-12 h-12" />
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <img
                src={imagePreview || getFullImageUrl(userData?.profileImage)}
                alt={`${userData?.username}'s profile`}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                onError={(e) => {
                  e.target.src = '/default-avatar.png';
                }}
              />
              {isOwnProfile && isEditing && (
                <div className="absolute bottom-0 right-0">
                  <label className={`bg-white hover:bg-gray-100 text-blue-600 rounded-full p-2 cursor-pointer shadow-md transition-all duration-200 hover:scale-105 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className={`pt-20 px-6 pb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          <div className="text-center mb-6">
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{userData?.username}</h1>
            <p className={`text-gray-500 mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Joined {new Date(userData?.joinedAt).toLocaleDateString()}</p>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'} mb-1`}>Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}
                  rows="4"
                  placeholder="Tell us about yourself..."
                  maxLength={500}
                />
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>{bio.length}/500 characters</p>
              </div>

              {error && (
                <div className={`text-red-500 text-sm bg-red-50 p-3 rounded-md ${isDarkMode ? 'bg-gray-700' : 'bg-red-50'}`}>
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className={`px-4 py-2 border border-gray-300 rounded-md ${isDarkMode ? 'text-white' : 'text-gray-700'} hover:bg-gray-50 transition-colors ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors flex items-center ${isDarkMode ? 'bg-teal-600' : 'bg-teal-600'}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className={`bg-gray-50 rounded-lg p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className={`text-gray-700 whitespace-pre-wrap ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                  {userData?.bio || 'No bio yet.'}
                </p>
              </div>
              {isOwnProfile && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setIsEditing(true)}
                    className={`px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors flex items-center ${isDarkMode ? 'bg-teal-600' : 'bg-teal-600'}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
