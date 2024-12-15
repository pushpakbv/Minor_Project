const express = require('express');
const multer = require('multer');
const authenticate = require('../middlewares/authMiddleware');
const path = require('path');
const {createPost, getPosts, likePost, getComments, commentPost, getUserPosts, deletePost} = require('../controllers/postController');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const router = express.Router();

// Configure Cloudinary storage for posts
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'posts',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4'],
    resource_type: 'auto' // allows both images and videos
  }
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
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.post('/create', authenticate, upload.single('media'), createPost);
router.get('/', authenticate, getPosts);
router.get('/user-posts', authenticate, getUserPosts);
router.post('/:postId/like', authenticate, likePost);
router.post('/:postId/comment', authenticate, commentPost);
router.get('/:postId/comments', getComments);
router.delete('/:postId', authenticate, deletePost);

module.exports = router;
