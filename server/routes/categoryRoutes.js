import express from "express";
import { body, validationResult } from "express-validator";
import Category from "../models/Category.js";

const router = express.Router();

// @desc   Get all categories
// @route  GET /api/categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc   Create category
// @route  POST /api/categories
router.post(
  "/",
  [body("name").notEmpty().withMessage("Category name is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const existing = await Category.findOne({ name: req.body.name });
      if (existing) return res.status(400).json({ message: "Category already exists" });

      const category = await Category.create(req.body);
      res.status(201).json(category);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;
