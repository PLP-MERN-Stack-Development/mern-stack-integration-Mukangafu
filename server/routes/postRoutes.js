import express from "express";
import { body, validationResult } from "express-validator";
import Post from "../models/Post.js";
import Category from "../models/Category.js";

const router = express.Router();

// ========================
// GET all posts with optional filtering + randomization
// ========================
router.get("/", async (req, res) => {
  try {
    const { category, search, page = 1, limit = 9 } = req.query;

    const query = {};
    if (category) query.category = category;          // filter by category
    if (search) query.title = { $regex: search, $options: "i" };

    const total = await Post.countDocuments(query);

    let posts = await Post.find(query)
      .populate("category", "name")
      .sort({ createdAt: -1 }); // default: newest first

    // Randomize only if no category filter
    if (!category) posts = posts.sort(() => 0.5 - Math.random());

    // Pagination
    const start = (page - 1) * limit;
    const paginated = posts.slice(start, start + Number(limit));

    res.json({
      data: paginated,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("category", "name");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new post
router.post(
  "/",
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("content").notEmpty().withMessage("Content is required"),
    body("category").notEmpty().withMessage("Category is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const newPost = await Post.create(req.body);
      res.status(201).json(newPost);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Update post
router.put("/:id", async (req, res) => {
  try {
    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Post not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete post
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ========================
// Likes & Comments
// ========================

// Add comment
router.post(
  "/:id/comments",
  [body("text").notEmpty().withMessage("Comment text is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: "Post not found" });

      const comment = { text: req.body.text };
      post.comments.push(comment);
      await post.save();

      res.status(201).json(comment);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Toggle like
router.post("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.likes = post.likes + 1;
    await post.save();

    res.json({ likes: post.likes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
