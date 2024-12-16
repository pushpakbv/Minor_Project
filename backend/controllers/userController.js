const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const fs = require('fs-extra');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId)
      .select('-password')
      .lean();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's posts count
    const postsCount = await Post.countDocuments({ user: userId });

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profileImage: user.profileImage || '/default-avatar.png',
        joinedAt: user.joinedAt,
        postsCount
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Error fetching user profile' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = {};
    
    if (req.body.bio !== undefined) {
      updates.bio = req.body.bio;
    }

    if (req.file) {
      try {
        // If user had a previous profile image, delete it from Cloudinary
        const currentUser = await User.findById(req.user.id);
        if (currentUser.profileImage && !currentUser.profileImage.includes('default-avatar')) {
          const publicId = currentUser.profileImage.split('/').pop().split('.')[0];
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (cloudinaryError) {
            console.error('Error deleting old profile image:', cloudinaryError);
          }
        }
        
        // Update with new image
        updates.profileImage = req.file.path;
      } catch (uploadError) {
        console.error('Error handling profile image:', uploadError);
        return res.status(500).json({ error: 'Error updating profile image' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        bio: updatedUser.bio,
        profileImage: updatedUser.profileImage || '/default-avatar.png'
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Error updating profile' });
  }
};