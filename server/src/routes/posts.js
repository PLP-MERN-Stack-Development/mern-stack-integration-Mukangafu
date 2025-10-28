import express from "express";
import Post from "../models/Post.js";
import Category from "../models/Category.js";
import auth from "../middleware/auth.js";
import { upload } from "../utils/upload.js";

const router = express.Router();

// GET /api/posts?category=slug&page=1&limit=10&search=term
router.get("/", async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1"));
    const limit = Math.min(50, parseInt(req.query.limit || "10"));
    const skip = (page - 1) * limit;
    const filter = {};
    if (req.query.category) {
      const cat = await Category.findOne({ slug: req.query.category });
      if (cat) filter.category = cat._id;
    }
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { excerpt: { $regex: req.query.search, $options: "i" } },
        { content: { $regex: req.query.search, $options: "i" } }
      ];
    }
    const [posts, total] = await Promise.all([
      Post.find(filter).populate("category author", "name").sort({ createdAt: -1 }).skip(skip).limit(limit),
      Post.countDocuments(filter)
    ]);
    res.json({ data: posts, meta: { total, page, limit } });
  } catch (err) { next(err); }
});

// GET /api/posts/:id
router.get("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate("author category");
    if (!post) return res.status(404).json({ error: "Not found"});
    post.views = (post.views || 0) + 1;
    await post.save();
    res.json(post);
  } catch (err) { next(err); }
});

// POST create (auth + multer)
router.post("/", auth, upload.single("featuredImage"), async (req, res, next) => {
  try {
    const { title, excerpt, content, category: categoryId, tags = [] } = req.body;
    const slug = title.toLowerCase().replace(/\s+/g, "-").slice(0,150);
    const featuredImage = req.file ? `/${req.file.path.replace(/\\/g, "/")}` : null;
    const post = new Post({
      title, slug, excerpt, content,
      featuredImage, author: req.user._id, category: categoryId, tags: tags.split?.(",") || tags
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) { next(err); }
});

// PUT update
router.put("/:id", auth, upload.single("featuredImage"), async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Not found" });
    if (!post.author.equals(req.user._id) && req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    Object.assign(post, req.body);
    if (req.file) post.featuredImage = `/${req.file.path.replace(/\\/g, "/")}`;
    await post.save();
    res.json(post);
  } catch (err) { next(err); }
});

// DELETE
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Not found" });
    if (!post.author.equals(req.user._id) && req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    await post.remove();
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
});

export default router;
