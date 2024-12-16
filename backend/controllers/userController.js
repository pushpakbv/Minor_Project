const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const fs = require('fs-extra');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// ... (rest of the code remains the same)

exports.updateProfile = async (req, res) => {
  try {
    const updates = {};
    
    if (req.body.bio !== undefined) {
      updates.bio = req.body.bio;
    }

    if (req.file) {
      updates.profileImage = req.file.path;
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
        id: updatedUser._id.toString(),
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

// ... (rest of the code remains the same)