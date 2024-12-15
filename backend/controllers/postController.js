const Post = require('../models/Post');
const path = require('path');

exports.createPost = async (req, res) => {
    try {
        const { text } = req.body;
        
        let mediaUrl = null;
        if (req.file) {
            // Get file extension
            const ext = path.extname(req.file.originalname).toLowerCase();
            const isVideo = ['.mp4', '.webm', '.ogg'].includes(ext);
            
            mediaUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            
            // Add proper content type for videos
            if (isVideo) {
                req.file.contentType = `video/${ext.substring(1)}`;
            }
        }
    
        const newPost = new Post({
            userId: req.user.id,
            text,
            media: mediaUrl,
        });
    
        await newPost.save();
        await newPost.populate('userId', 'username profileImage');
        
        const formattedPost = {
            ...newPost.toJSON(),
            user: {
                id: newPost.userId._id,
                username: newPost.userId.username,
                profileImage: newPost.userId.profileImage || '/default-avatar.png'
            }
        };

        res.status(201).json({ 
            message: 'Post created successfully', 
            post: formattedPost 
        });
    } catch (error) {
        console.error('Post creation error:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate('userId', 'username profileImage')
            .populate('comments.userId', 'username profileImage')
            .populate('likes', 'username');
            
        const currentUserId = req.user ? req.user.id : null;
        
        const formattedPosts = posts.map(post => ({
            ...post.toJSON(),
            user: {
                id: post.userId._id,
                username: post.userId.username,
                profileImage: post.userId.profileImage || '/default-avatar.png'
            },
            isLiked: currentUserId ? post.likes.some(like => like._id.toString() === currentUserId) : false,
            comments: post.comments.map(comment => ({
                ...comment.toJSON(),
                user: {
                    id: comment.userId._id,
                    username: comment.userId.username,
                    profileImage: comment.userId.profileImage || '/default-avatar.png'
                }
            }))
        }));

        res.status(200).json({ posts: formattedPosts });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Error fetching posts' });
    }
};

exports.likePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ 
                success: false,
                error: 'Post not found' 
            });
        }

        const likeIndex = post.likes.indexOf(userId);
        const wasLiked = likeIndex !== -1;

        if (!wasLiked) {
            post.likes.push(userId);
        } else {
            post.likes.splice(likeIndex, 1);
        }

        await post.save();
        
        return res.status(200).json({ 
            success: true,
            message: wasLiked ? 'Post unliked' : 'Post liked',
            likes: post.likes.length,
            isLiked: !wasLiked
        });
    } catch (error) {
        console.error('Like error:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Error processing like/unlike action'
        });
    }
};

exports.commentPost = async (req, res) => {
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
        
        // Populate the new comment's user details
        await post.populate('comments.userId', 'username profileImage');
        
        const formattedComment = {
            ...post.comments[post.comments.length - 1].toJSON(),
            user: {
                id: req.user.id,
                username: post.comments[post.comments.length - 1].userId.username,
                profileImage: post.comments[post.comments.length - 1].userId.profileImage || '/default-avatar.png'
            }
        };

        res.status(201).json({ 
            message: 'Comment added successfully', 
            comment: formattedComment 
        });
    } catch (error) {
        console.error('Comment error:', error);
        res.status(500).json({ error: 'Error adding comment' });
    }
};
    

exports.getComments = async (req, res) => {
    try {
        const { postId } = req.params;
    
        const post = await Post.findById(postId).populate('comments.userId', 'username');
        if (!post) return res.status(404).json({ message: 'Post not found' });
    
        res.status(200).json({ comments: post.comments });
      } catch (error) {
        res.status(500).json({ error: 'Error fetching comments' });
      }
};
