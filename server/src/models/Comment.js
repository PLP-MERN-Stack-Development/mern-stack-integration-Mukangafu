import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  authorName: String,
  authorUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: { type: String, required: true },
  approved: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Comment", CommentSchema);
