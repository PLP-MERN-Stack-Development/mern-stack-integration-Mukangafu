// src/pages/PostList.jsx
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import useApi from "../api/useApi";
import PostCard from "../components/PostCard";

export default function PostList() {
  const { categoryName } = useParams(); // category slug from URL
  const navigate = useNavigate();
  const { request, loading, error } = useApi();

  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [categorySlug, setCategorySlug] = useState(categoryName || "");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, limit: 9 });

  // 🔁 Update selected category when URL changes
  useEffect(() => {
    setCategorySlug(categoryName || "");
    setPage(1);
  }, [categoryName]);

  // 🗂️ Fetch categories once
  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await request({ url: "/categories", method: "get" });
        setCategories(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    }
    fetchCategories();
  }, [request]);

  // 📦 Fetch posts (filters applied)
  useEffect(() => {
    async function fetchPosts() {
      try {
        // Wait until categories are loaded if filtering by category
        if (categorySlug && categories.length === 0) return;

        const params = { page, limit: meta.limit };
        if (search) params.search = search;

        // If category is selected, find its slug or ID
        if (categorySlug) {
          const selected = categories.find(
            (c) => c.slug === categorySlug || c.name === categorySlug
          );
          if (selected) params.category = selected.slug || selected._id;
        }

        const res = await request({ url: "/posts", method: "get", params });
        const fetched = Array.isArray(res) ? res : res.data || [];

        setPosts(fetched);
        setMeta(res.meta || { total: fetched.length, limit: 9 });
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    }

    fetchPosts();
  }, [categorySlug, categories, search, page, request]);

  // 🗑️ Delete post (optimistic)
  const handleDelete = async (id) => {
    const original = [...posts];
    setPosts((prev) => prev.filter((p) => p._id !== id));
    try {
      await request({ url: `/posts/${id}`, method: "delete" });
    } catch (err) {
      console.error("Delete failed:", err);
      setPosts(original);
    }
  };

  const totalPages = Math.max(1, Math.ceil((meta.total || posts.length) / meta.limit));

  return (
    <section className="max-w-7xl mx-auto px-4 pt-28 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          📝 {categorySlug ? `${categorySlug} Posts` : "All Blog Posts"}
        </h1>

        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search posts..."
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-sky-400 outline-none"
          />

          <select
            value={categorySlug}
            onChange={(e) => {
              const selected = e.target.value;
              setCategorySlug(selected);
              setPage(1);
              if (selected) navigate(`/category/${selected}`);
              else navigate(`/blog`);
            }}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-sky-400 outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c.slug || c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Quick Category Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((c) => (
          <Link
            key={c._id}
            to={`/category/${c.slug || c.name}`}
            className={`px-4 py-2 rounded-full transition ${
              categorySlug === (c.slug || c.name)
                ? "bg-sky-500 text-white"
                : "bg-sky-100 dark:bg-sky-800 text-sky-800 dark:text-white hover:bg-sky-500 hover:text-white"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {/* Posts */}
      {loading ? (
        <div className="text-center text-gray-500 py-20">Loading posts...</div>
      ) : error ? (
        <div className="text-center text-red-600 py-10">
          Error: {error.message || JSON.stringify(error)}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No posts found. Try changing your filters.
        </div>
      ) : (
        <>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onDelete={handleDelete} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className={`px-4 py-2 rounded-lg border transition ${
                page <= 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-sky-500 hover:text-white"
              }`}
            >
              Prev
            </button>

            <span className="text-gray-600 dark:text-gray-300">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className={`px-4 py-2 rounded-lg border transition ${
                page >= totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-sky-500 hover:text-white"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}
