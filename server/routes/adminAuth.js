// server/routes/adminAuth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // your user model

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key_here";

// ======================
// 🔑 Admin Login
// ======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const admin = await User.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    // Check role
    if (admin.role !== "admin")
      return res.status(403).json({ message: "Access denied. Not an admin." });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate token
    const token = jwt.sign(
      { id: admin._id, name: admin.name, role: "admin" },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: { id: admin._id, name: admin.name, email: admin.email, role: "admin" },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
