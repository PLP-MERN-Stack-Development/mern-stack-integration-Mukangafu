// server.js - Main server file for the MERN blog application

// Import required modules
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import postRoutes from "./routes/posts.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import userAuthRoutes from "./routes/userAuth.js";
import adminAuthRoutes from "./routes/adminAuth.js";

// Config
dotenv.config();
const app = express();

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect MongoDB (Unified)
const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;

mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

// Routes
app.use("/api/posts", postRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userAuthRoutes);
app.use("/api/admin", adminAuthRoutes);

// Default Route
app.get("/", (req, res) => res.send("🚀 API running successfully"));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
