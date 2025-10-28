import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import useApi from "../api/useApi";

export default function Dashboard() {
  const { user } = useAuth();
  const { request } = useApi();
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: "", category: "", content: "" });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch user's posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await request({ url: "/posts/my-posts", method: "GET" });
        setPosts(res || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    if (user) fetchPosts();
  }, [user]);

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("category", form.category);
      data.append("content", form.content);
      if (file) data.append("image", file);

      await request({ url: "/posts", method: "POST", data });
      alert("✅ Post created successfully!");

      // Reset form & refresh posts
      setForm({ title: "", category: "", content: "" });
      setFile(null);
      const updated = await request({ url: "/posts/my-posts", method: "GET" });
      setPosts(updated || []);
    } catch (err) {
      console.error("Post creation error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="text-center mt-20">Loading user data...</div>;

  return (
    <div className="max-w-5xl mx-auto mt-24 p-4">
      <h1 className="text-2xl font-bold mb-4 text-sky-700 dark:text-sky-300">
        Welcome, {user.name || user.email}
      </h1>

      {/* ✅ Create new post form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow mb-8"
      >
        <h2 className="text-lg font-semibold mb-4">Create a New Post</h2>

        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-3 mb-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
          required
        />

        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full p-3 mb-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
          required
        />

        <textarea
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full p-3 mb-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
          rows="4"
          required
        ></textarea>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-3"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition"
        >
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>

      {/* ✅ Display user’s posts */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Your Posts</h2>
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow"
              >
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p className="text-sm text-gray-500">{post.category}</p>
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  {post.content.substring(0, 100)}...
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
