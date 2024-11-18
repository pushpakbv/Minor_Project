const Post = require('../models/Post');

exports.createPost = async (req, res) => {
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
};

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json({ posts });
      } catch (error) {
        res.status(500).json({ error: 'Error fetching posts' });
      }
};

exports.likePost = async (req, res) => {
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
    
        res.status(201).json({ message: 'Comment added successfully', comments: post.comments });
      } catch (error) {
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


