import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String },
  content: { type: String, required: true },
  featuredImage: { type: String }, // URL or path to uploads/
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  tags: [String],
  published: { type: Boolean, default: true },
  views: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Post", PostSchema);
