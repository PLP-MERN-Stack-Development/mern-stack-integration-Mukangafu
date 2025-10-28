// server/models/Post.js
import mongoose from "mongoose";

// Comment schema
const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

// Post schema
const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    content: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    author: { type: String, default: "Dannie" },
    image: { type: String, default: "default-post.jpg" },
    slug: { type: String, unique: true },
    excerpt: { type: String, maxlength: 200 },
    isPublished: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: [commentSchema],
  },
  { timestamps: true }
);

// Create slug from title before saving
postSchema.pre("save", function (next) {
  if (!this.isModified("title")) return next();
  this.slug = this.title.toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-");
  next();
});

// Virtual for post URL
postSchema.virtual("url").get(function () {
  return `/posts/${this.slug}`;
});

// Method to add a comment
postSchema.methods.addComment = function (userId, content) {
  this.comments.push({ author: userId, text: content });
  return this.save();
};

// Method to increment view count
postSchema.methods.incrementViewCount = function () {
  this.viewCount += 1;
  return this.save();
};

export default mongoose.model("Post", postSchema);
