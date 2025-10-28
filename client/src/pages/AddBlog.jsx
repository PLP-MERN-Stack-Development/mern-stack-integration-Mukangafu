import React, { useState, useEffect } from "react";
import useApi from "../api/useApi";

export default function AddBlog() {
  const { request, loading } = useApi();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
    author: "Dannie",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await request({ url: "/categories" });
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    }
    fetchCategories();
  }, [request]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.title || !form.content || !form.category) {
      setMessage("⚠️ Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("category", form.category);
    formData.append("author", form.author);
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await request({
        url: "/posts",
        method: "POST",
        data: formData,
      });

      if (res && res._id) {
        setMessage("✅ Blog post created successfully!");
        setForm({ title: "", content: "", category: "", author: "Dannie" });
        setImageFile(null);
        setPreview(null);
      } else {
        setMessage("❌ Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error creating post.");
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
        ✍️ Add New Blog Post
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-8 space-y-6"
      >
        {message && (
          <div
            className={`p-3 rounded-lg text-center ${
              message.startsWith("✅")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter post title"
            className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-sky-400 outline-none"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Category *
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-sky-400 outline-none"
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-4 w-full rounded-lg shadow-md object-cover h-64"
            />
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Content *
          </label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Write your blog post..."
            rows="8"
            className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-sky-400 outline-none"
          />
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-8 py-3 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "💾 Publish Post"}
          </button>
        </div>
      </form>
    </section>
  );
}
