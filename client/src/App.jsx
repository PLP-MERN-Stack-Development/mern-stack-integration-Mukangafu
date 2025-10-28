// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import Categories from "./pages/Categories";
import PostList from "./pages/PostList";
import PostView from "./pages/PostView";
import PostForm from "./pages/PostForm";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AddBlog from "./pages/AddBlog";

import Login from "./pages/Login"; // User login
import Register from "./pages/Register"; 
import AdminLogin from "./pages/AdminLogin"; // Admin login
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-bg duration-500 text-gray-900 dark:text-gray-100">
        {/* Navbar */}
        <Navbar />

        {/* Main content */}
        <main className="flex-grow mt-14 transition-bg duration-500">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<PostList />} />
            <Route path="/post/:id" element={<PostView />} />
            <Route path="/category/:categoryName" element={<PostList />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} /> {/* User login */}
            <Route path="/register" element={<Register />} /> {/* User register */}
            <Route path="/admin-login" element={<AdminLogin />} /> {/* Admin login */}

            {/* User-protected routes */}
            <Route
              path="/create"
              element={
                <PrivateRoute>
                  <PostForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <PrivateRoute>
                  <PostForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-blog"
              element={
                <PrivateRoute>
                  <AddBlog />
                </PrivateRoute>
              }
            />

            {/* Admin-only routes */}
            <Route
              path="/admin"
              element={
                <PrivateRoute adminOnly={true}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
