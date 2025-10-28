// src/components/PostCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  if (!post) return null; // Safety check

  const { _id, title, content, image, author, createdAt, likes, comments } = post;

  const snippet = content
    ? content.replace(/<[^>]+>/g, "").slice(0, 120) + (content.length > 120 ? "..." : "")
    : "No content available.";

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
      {/* 🖼️ Post image */}
      <Link to={`/post/${_id}`}>
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover rounded-t-xl"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 dark:bg-gray-800 flex items-center justify-center rounded-t-xl text-gray-500 text-sm">
            No image available
          </div>
        )}
      </Link>

      {/* 📄 Content */}
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/post/${_id}`}>
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100 hover:text-sky-600 transition-colors duration-200">
            {title || "Untitled Post"}
          </h3>
        </Link>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 leading-relaxed">
          {snippet}
        </p>

        {/* 👤 Author & Date */}
        <div className="mt-auto text-xs text-gray-500 dark:text-gray-400">
          By <span className="font-medium">{author || "Dannie"}</span> •{" "}
          {createdAt ? new Date(createdAt).toLocaleDateString() : "Unknown Date"}
        </div>

        {/* 🔗 Read More Button */}
        <Link
          to={`/post/${_id}`}
          className="inline-block mt-3 text-sky-600 hover:text-sky-800 font-medium text-sm"
        >
          Read More →
        </Link>

        {/* Optional: Likes & Comments */}
        {typeof likes !== "undefined" && typeof comments !== "undefined" && (
          <div className="mt-2 text-xs text-gray-400 flex justify-between">
            <span>❤️ {likes || 0}</span>
            <span>💬 {comments?.length || 0}</span>
          </div>
        )}
      </div>
    </div>
  );
}
