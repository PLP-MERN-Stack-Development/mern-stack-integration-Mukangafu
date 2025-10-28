// src/pages/Home.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../api/useApi";
import PostCard from "../components/PostCard";

export default function Home() {
  const { request, loading, error } = useApi();
  const [posts, setPosts] = useState([]);
  const sliderRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  // Fetch latest posts
  useEffect(() => {
    async function fetchLatestPosts() {
      try {
        const res = await request({ url: "/posts?limit=6&page=1" });
        if (res && res.data) {
          const postsWithMeta = res.data.map(post => ({
            ...post,
            liked: false,
          }));
          setPosts(postsWithMeta);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    }
    fetchLatestPosts();
  }, []);

  // Auto-scrolling effect
  useEffect(() => {
    if (!posts.length) return;
    const slider = sliderRef.current;
    if (!slider) return;

    let scrollAmount = 0;
    const speed = 1; // pixels per frame
    let rafId;

    const scroll = () => {
      if (!isPaused && slider.scrollWidth > slider.clientWidth) {
        scrollAmount += speed;
        if (scrollAmount >= slider.scrollWidth - slider.clientWidth) {
          scrollAmount = 0; // loop back
        }
        slider.scrollTo({ left: scrollAmount });
      }
      rafId = requestAnimationFrame(scroll);
    };

    rafId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(rafId);
  }, [posts, isPaused]);

  // Toggle like
  const toggleLike = async (postId) => {
    const post = posts.find(p => p._id === postId);
    if (!post) return;

    const newLiked = !post.liked;
    setPosts(prev =>
      prev.map(p =>
        p._id === postId
          ? { ...p, liked: newLiked, likes: newLiked ? (p.likes || 0) + 1 : (p.likes || 1) - 1 }
          : p
      )
    );

    try {
      await request({
        url: `/posts/${postId}/${newLiked ? "like" : "unlike"}`,
        method: "POST",
      });
    } catch (err) {
      console.error("Failed to update like:", err);
      setPosts(prev =>
        prev.map(p =>
          p._id === postId ? { ...p, liked: post.liked, likes: post.likes } : p
        )
      );
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500">

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white py-16 px-6 text-center rounded-b-3xl shadow-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2">Blogs by Dannie</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          Explore latest insights, tips, and stories across multiple categories. Dive in and discover something new!
        </p>
      </section>

      {/* Latest Posts */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-8 text-center">📝 Latest Posts</h2>

        {loading && <p className="text-center text-gray-500">Loading posts...</p>}
        {error && <p className="text-center text-red-600">{JSON.stringify(error)}</p>}
        {!loading && !error && posts.length === 0 && (
          <p className="text-center text-gray-500">No posts available.</p>
        )}

        {!loading && !error && posts.length > 0 && (
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-hidden py-4"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {posts.map(post => (
              <div
                key={post._id}
                className="flex-shrink-0 w-[300px] sm:w-[250px] cursor-pointer"
                onClick={() => navigate(`/post/${post._id}`)}
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-xl transition">
                  <PostCard post={post} />

                  {/* Likes */}
                  <div className="flex items-center justify-between mt-4">
                    <button
                      className={`text-xl ${post.liked ? "text-red-500" : "text-gray-400"} transition`}
                      onClick={(e) => {
                        e.stopPropagation(); // prevent navigation
                        toggleLike(post._id);
                      }}
                    >
                      ❤️ {post.likes || 0}
                    </button>
                    <span className="text-gray-500 text-sm">{post.comments.length} comments</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
