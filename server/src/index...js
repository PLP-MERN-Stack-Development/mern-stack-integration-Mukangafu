import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import postsRouter from "./routes/posts.js";
import categoriesRouter from "./routes/categories.js";
import authRouter from "./routes/auth.js";
import commentsRouter from "./routes/comments.js";
import errorHandler from "./middleware/errorHandler.js";
import path from "path";

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(morgan("dev"));
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), process.env.UPLOAD_DIR || "uploads")));

// API routes
app.use("/api/posts", postsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/auth", authRouter);
app.use("/api/comments", commentsRouter);

// central error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
