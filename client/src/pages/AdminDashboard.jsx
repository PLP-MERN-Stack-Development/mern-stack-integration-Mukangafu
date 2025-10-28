import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  FileText,
  Folder,
  LogOut,
  Home,
  Users,
  BarChart3,
  Settings,
  ClipboardList,
} from "lucide-react";
import useApi from "../api/useApi";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const { request, loading } = useApi();
  const [stats, setStats] = useState({
    posts: 0,
    categories: 0,
    users: 0,
    reports: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch admin stats
    const fetchStats = async () => {
      try {
        const posts = await request({ url: "/posts" });
        const categories = await request({ url: "/categories" });
        const users = await request({ url: "/users" }); // optional API route
        const reports = await request({ url: "/reports" }); // optional API route

        setStats({
          posts: Array.isArray(posts) ? posts.length : 0,
          categories: Array.isArray(categories) ? categories.length : 0,
          users: Array.isArray(users) ? users.length : 0,
          reports: Array.isArray(reports) ? reports.length : 0,
        });
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      }
    };
    fetchStats();
  }, [request]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4">
      {/* ---------- Header ---------- */}
      <div className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-4xl font-bold text-sky-600 mb-4 md:mb-0">
          Admin Dashboard
        </h1>

        <div className="flex flex-wrap justify-center gap-4">
          {/* ✅ HOME now links to /admin (not /) */}
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Home className="w-5 h-5" />
            Home
          </button>

          <button
            onClick={() => navigate("/add-blog")}
            className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <PlusCircle className="w-5 h-5" />
            New Blog
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* ---------- Stats Section ---------- */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <p className="text-center text-gray-500">Loading dashboard...</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Posts */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 text-center border border-gray-200 dark:border-gray-700 transition"
            >
              <FileText className="w-10 h-10 text-sky-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Total Posts</h3>
              <p className="text-3xl font-bold text-sky-600 mt-2">
                {stats.posts}
              </p>
            </motion.div>

            {/* Total Categories */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 text-center border border-gray-200 dark:border-gray-700 transition"
            >
              <Folder className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Categories</h3>
              <p className="text-3xl font-bold text-emerald-600 mt-2">
                {stats.categories}
              </p>
            </motion.div>

            {/* Users */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 text-center border border-gray-200 dark:border-gray-700 transition"
            >
              <Users className="w-10 h-10 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Users</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {stats.users}
              </p>
            </motion.div>

            {/* Reports */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 text-center border border-gray-200 dark:border-gray-700 transition"
            >
              <ClipboardList className="w-10 h-10 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Reports</h3>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {stats.reports}
              </p>
            </motion.div>
          </div>
        )}

        {/* ---------- Admin Tools ---------- */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-16">
          <motion.div
            whileHover={{ scale: 1.03 }}
            onClick={() => navigate("/admin/users")}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md cursor-pointer border border-gray-200 dark:border-gray-700 transition text-center"
          >
            <Users className="w-10 h-10 text-indigo-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Manage Users</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              View and manage registered users.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            onClick={() => navigate("/admin/analytics")}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md cursor-pointer border border-gray-200 dark:border-gray-700 transition text-center"
          >
            <BarChart3 className="w-10 h-10 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Analytics</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Track blog performance and growth.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            onClick={() => navigate("/admin/settings")}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md cursor-pointer border border-gray-200 dark:border-gray-700 transition text-center"
          >
            <Settings className="w-10 h-10 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Settings</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Customize admin preferences and security.
            </p>
          </motion.div>
        </div>

        {/* ---------- View All Posts ---------- */}
        <div className="flex justify-center mt-12 gap-4 flex-wrap">
          <button
            onClick={() => navigate("/blog")}
            className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
          >
            View All Posts
          </button>
        </div>
      </div>

      {/* ---------- Footer ---------- */}
      <footer className="mt-16 text-center text-gray-500 dark:text-gray-400 text-sm">
        © {new Date().getFullYear()} Blogs by Dannie Admin — All Rights Reserved.
      </footer>
    </section>
  );
}
