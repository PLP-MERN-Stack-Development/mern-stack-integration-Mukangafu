// src/controllers/post.controller.js
const Post = require('../models/Post');

exports.createPost = async (req, res, next) => {
  try {
    const post = await Post.create({ ...req.body, author: req.user.id });
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

exports.getMyPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.user.id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().populate('author', 'name');
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.user.id },
      req.body,
      { new: true }
    );
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, author: req.user.id });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    next(err);
  }
};
