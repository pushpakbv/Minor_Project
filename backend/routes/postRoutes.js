const express = require('express');
const multer = require('multer');
const Post = require('../models/Post');
const authenticate = require('../middlewares/authMiddleware');
const path = require('path');

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Add file extension handling
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Add file filter to only allow images and videos
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png','image/webp','image/jpg', 'image/gif', 'video/mp4'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Create a new post
router.post('/create', authenticate, upload.single('media'), async (req, res) => {
  try {
    const { text } = req.body;
    
    // Create the full URL for the media file
    const mediaUrl = req.file 
      ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
      : null;

    const newPost = new Post({
      userId: req.user.id,
      text,
      media: mediaUrl,
    });

    await newPost.save();
    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    console.error('Post creation error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Fetch all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching posts' });
  }
});

/**
 * Like or Unlike a Post
 */
router.post('/:postId/like', authenticate, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Toggle like
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json({ message: 'Post updated successfully', likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ error: 'Error liking/unliking post' });
  }
});

/**
 * Add a Comment
 */
router.post('/:postId/comment', authenticate, async (req, res) => {
  try {
    const { postId } = req.params;
    const { comment } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const newComment = {
      userId: req.user.id,
      comment,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json({ message: 'Comment added successfully', comments: post.comments });
  } catch (error) {
    res.status(500).json({ error: 'Error adding comment' });
  }
});

/**
 * Fetch All Comments for a Post
 */
router.get('/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate('comments.userId', 'username');
    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.status(200).json({ comments: post.comments });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching comments' });
  }
});

module.exports = router;

