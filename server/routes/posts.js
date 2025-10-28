// routes/posts.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Post from "../models/Post.js";

const router = express.Router();

// Fix __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==================================================
// 🗂 Multer Storage Configuration
// ==================================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const validType =
      allowed.test(file.mimetype) &&
      allowed.test(path.extname(file.originalname).toLowerCase());
    validType
      ? cb(null, true)
      : cb(new Error("Only image files (jpg, png, gif, webp) are allowed!"));
  },
});

// ==================================================
// 📄 GET All Posts
// ==================================================
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search, latest } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: "i" };

    let query = Post.find(filter).populate("category", "name"); // only populate category

    if (latest === "true") {
      query = query.sort({ createdAt: -1 }).limit(Number(limit));
    } else {
      query = query
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));
    }

    const posts = await query;
    const total = await Post.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: posts,
      meta: { total, page: Number(page), limit: Number(limit) },
    });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ success: false, message: "Server error fetching posts." });
  }
});

// ==================================================
// ✍️ CREATE New Post
// ==================================================
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, content, category, author } = req.body;

    const newPost = new Post({
      title,
      content,
      category,
      author: author || "Dannie",
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await newPost.save();
    res.status(201).json({ success: true, data: newPost });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ success: false, message: "Server error creating post." });
  }
});

// ==================================================
// ✏️ UPDATE Post
// ==================================================
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, content, category, author } = req.body;
    const updateData = { title, content, category, author };
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;

    const post = await Post.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!post)
      return res.status(404).json({ success: false, message: "Post not found." });

    res.status(200).json({ success: true, data: post });
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ success: false, message: "Server error updating post." });
  }
});

// ==================================================
// 🗑 DELETE Post
// ==================================================
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post)
      return res.status(404).json({ success: false, message: "Post not found." });

    res.status(200).json({ success: true, message: "Post deleted successfully." });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ success: false, message: "Server error deleting post." });
  }
});

// ==================================================
// ❤️ LIKE / 💔 UNLIKE Post
// ==================================================
router.post("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      return res.status(404).json({ success: false, message: "Post not found." });

    post.likes = (post.likes || 0) + 1;
    await post.save();

    res.status(200).json({ success: true, likes: post.likes });
  } catch (err) {
    console.error("Error liking post:", err);
    res.status(500).json({ success: false, message: "Server error liking post." });
  }
});

router.post("/:id/unlike", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      return res.status(404).json({ success: false, message: "Post not found." });

    post.likes = Math.max((post.likes || 1) - 1, 0);
    await post.save();

    res.status(200).json({ success: true, likes: post.likes });
  } catch (err) {
    console.error("Error unliking post:", err);
    res.status(500).json({ success: false, message: "Server error unliking post." });
  }
});

export default router;
