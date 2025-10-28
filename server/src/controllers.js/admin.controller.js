// src/controllers/admin.controller.js
const User = require('../models/User');
const Post = require('../models/Post');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.changeUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User role updated', user });
  } catch (err) {
    next(err);
  }
};

exports.getAllPostsAdmin = async (req, res, next) => {
  try {
    const posts = await Post.find().populate('author', 'name email');
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

exports.deletePostAdmin = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted by admin' });
  } catch (err) {
    next(err);
  }
};
