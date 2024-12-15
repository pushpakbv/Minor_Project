const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/profile/:userId', authenticate, userController.getProfile);
router.put('/profile', authenticate, upload.single('profileImage'), userController.updateProfile);

module.exports = router; 