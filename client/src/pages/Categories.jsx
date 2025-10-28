// src/pages/Categories.jsx
import React, { useEffect, useState } from "react";
import useApi from "../api/useApi";
import PostCard from "../components/PostCard";

export default function Categories() {
  const { request, loading, error } = useApi();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    console.log("Categories mounted");

    request({ url: "/posts" })
      .then((res) => {
        console.log("API response:", res);
        if (Array.isArray(res) && res.length > 0) {
          setPosts(res);
        } else {
          console.warn("API returned empty");
          setPosts([]);
        }
      })
      .catch((err) => {
        console.error("API error:", err);
        setPosts([]);
      });
  }, []);

  if (loading)
    return (
      <div className="text-center py-20 text-gray-500">Loading posts...</div>
    );

  if (error)
    return (
      <div className="text-center py-20 text-red-600">
        Error loading posts: {JSON.stringify(error)}
      </div>
    );

  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-8 text-center">📝 Latest Posts</h1>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts available.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post._id || post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
