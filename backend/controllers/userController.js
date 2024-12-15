const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const fs = require('fs-extra');
const path = require('path');


exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    
    const user = new User({ username, email, password });
    await user.save();

    // Generate token for the new user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    // Return token and user data
    res.status(201).json({
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        profileImage: user.profileImage || '/default-avatar.png'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isPasswordValid = await user.comparePassword(req.body.password);
    if (!isPasswordValid) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        profileImage: user.profileImage || '/default-avatar.png'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.logout =  (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).send({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.validateToken = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ valid: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ valid: false });
    }

    res.json({
      valid: true,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        profileImage: user.profileImage || '/default-avatar.png',
        bio: user.bio
      }
    });
  } catch (error) {
    res.status(401).json({ valid: false });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = {};
    
    if (req.body.bio !== undefined) {
      updates.bio = req.body.bio;
    }

    if (req.file) {
      // Cloudinary automatically uploads and provides the URL
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

    res.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Error updating profile' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    // Check if we have either a valid userId parameter or a valid user in the request
    const userId = req.params.userId || req.user?.id;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    
    // Handle specific mongoose CastError for invalid ObjectId
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }
    
    res.status(500).json({ error: 'Error fetching profile' });
  }
};