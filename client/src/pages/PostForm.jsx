// src/pages/PostForm.jsx
import React, { useEffect, useState } from "react";
import useApi from "../api/useApi";
import { useNavigate, useParams } from "react-router-dom";

export default function PostForm() {
  const { id } = useParams();
  const { request } = useApi();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: "", excerpt: "", content: "", category: "" });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const cats = await request({ url: "/categories" });
        setCategories(cats);
        if (id) {
          const post = await request({ url: `/posts/${id}` });
          setForm({ title: post.title, excerpt: post.excerpt || "", content: post.content, category: post.category?._id || "" });
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("excerpt", form.excerpt);
      fd.append("content", form.content);
      fd.append("category", form.category);
      if (file) fd.append("featuredImage", file);

      if (id) {
        await request({ url: `/posts/${id}`, method: "put", data: fd, headers: { "Content-Type": "multipart/form-data" }});
      } else {
        await request({ url: "/posts", method: "post", data: fd, headers: { "Content-Type": "multipart/form-data" }});
      }
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-28 pb-12">
      <h2 className="text-2xl font-bold mb-4">{id ? "Edit Post" : "Create Post"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
        <input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} className="w-full p-3 rounded border" placeholder="Title" required />
        <input value={form.excerpt} onChange={e => setForm(f => ({...f, excerpt: e.target.value}))} className="w-full p-3 rounded border" placeholder="Short excerpt" />
        <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} className="w-full p-3 rounded border" required>
          <option value="">Select category</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <textarea value={form.content} onChange={e => setForm(f => ({...f, content: e.target.value}))} className="w-full p-3 rounded border h-56" placeholder="Post content (HTML or markdown allowed)"></textarea>

        <div>
          <label className="block text-sm mb-1">Featured image</label>
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="px-4 py-2 bg-sky-600 text-white rounded">{loading ? "Saving..." : "Save Post"}</button>
        </div>
      </form>
    </div>
  );
}
