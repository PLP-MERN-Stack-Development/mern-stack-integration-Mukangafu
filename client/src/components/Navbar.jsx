import React, { useState, useEffect } from "react";
import { Sun, Moon, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinkClass = (path) =>
    `hover:text-sky-600 transition-colors duration-200 ${
      location.pathname === path ? "text-sky-600 font-semibold" : ""
    }`;

  // Home path depends on role
  const homePath = user?.role === "admin" ? "/admin" : "/";

  return (
    <nav className="bg-white dark:bg-gray-800 shadow fixed w-full z-40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Left links */}
          <div className="flex items-center gap-6">
            <Link to={homePath} className="text-lg font-bold text-sky-600 dark:text-sky-400 md:hidden">
              BlogVerse
            </Link>

            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link to={homePath} className={navLinkClass(homePath)}>Home</Link>
              <Link to="/blog" className={navLinkClass("/blog")}>Blog</Link>
              {user && user.role !== "admin" && (
                <Link to="/add-blog" className={navLinkClass("/add-blog")}>Add Blog</Link>
              )}
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={() => setDark(!dark)}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Auth buttons */}
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{user.name || user.email}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium hover:text-red-500 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium hover:text-sky-600 transition-colors duration-200">Login</Link>
                <Link to="/register" className="text-sm font-medium hover:text-sky-600 transition-colors duration-200">Register</Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 px-4 py-3 space-y-2">
          <Link to={homePath} onClick={() => setMenuOpen(false)} className="block hover:text-sky-600">Home</Link>
          <Link to="/blog" onClick={() => setMenuOpen(false)} className="block hover:text-sky-600">Blog</Link>

          {user && user.role !== "admin" && (
            <Link to="/add-blog" onClick={() => setMenuOpen(false)} className="block hover:text-sky-600">Add Blog</Link>
          )}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Admin Dashboard
            </Link>
          )}

          {user ? (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="block w-full text-left hover:text-red-500"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block hover:text-sky-600">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block hover:text-sky-600">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
