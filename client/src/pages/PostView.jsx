// src/pages/PostView.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApi from "../api/useApi";
import { useAuth } from "../context/AuthContext";

export default function PostView() {
  const { id } = useParams();
  const { request, loading, error } = useApi();
  const { user: currentUser } = useAuth(); // dynamic current user
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [liking, setLiking] = useState(false);

  // Fetch single post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await request({ url: `/posts/${id}` });
        setPost(res?.data || res);
      } catch (err) {
        console.error("Failed to fetch post:", err);
      }
    };
    fetchPost();
  }, [id]);

  // Handle like
  const handleLike = async () => {
    if (!post) return;
    setLiking(true);
    try {
      await request({ url: `/posts/${post._id}/like`, method: "POST" });
      setPost((prev) => ({ ...prev, likes: (prev.likes || 0) + 1 }));
    } catch (err) {
      console.error("Failed to like post:", err);
    } finally {
      setLiking(false);
    }
  };

  // Add new comment
  const submitComment = async () => {
    if (!commentText.trim()) return;
    setSubmitting(true);

    const optimisticComment = {
      _id: Date.now().toString(),
      text: commentText,
      author: currentUser?.name || "Anonymous",
      createdAt: new Date().toISOString(),
    };
    setPost((prev) => ({
      ...prev,
      comments: [...(prev.comments || []), optimisticComment],
    }));
    setCommentText("");

    try {
      const res = await request({
        url: `/posts/${id}/comments`,
        method: "POST",
        data: { text: optimisticComment.text },
      });

      if (res?.data) {
        setPost((prev) => ({
          ...prev,
          comments: [...prev.comments.slice(0, -1), res.data],
        }));
      }
    } catch (err) {
      console.error("Failed to post comment:", err);
      setPost((prev) => ({
        ...prev,
        comments: prev.comments.slice(0, -1),
      }));
      alert("Failed to post comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Edit comment
  const startEditing = (comment) => {
    setEditingCommentId(comment._id);
    setEditingCommentText(comment.text);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  const saveComment = async (commentId) => {
    if (!editingCommentText.trim()) return;
    try {
      const res = await request({
        url: `/posts/${id}/comments/${commentId}`,
        method: "PUT",
        data: { text: editingCommentText },
      });
      if (res?.data) {
        setPost((prev) => ({
          ...prev,
          comments: prev.comments.map((c) => (c._id === commentId ? res.data : c)),
        }));
        cancelEditing();
      }
    } catch (err) {
      console.error("Failed to update comment:", err);
      alert("Failed to update comment.");
    }
  };

  const deleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await request({ url: `/posts/${id}/comments/${commentId}`, method: "DELETE" });
      setPost((prev) => ({
        ...prev,
        comments: prev.comments.filter((c) => c._id !== commentId),
      }));
    } catch (err) {
      console.error("Failed to delete comment:", err);
      alert("Failed to delete comment.");
    }
  };

  if (loading || !post)
    return <p className="text-center mt-20">Loading post...</p>;
  if (error)
    return (
      <p className="text-center mt-20 text-red-600">
        {JSON.stringify(error)}
      </p>
    );

  const { title, content, image, author, createdAt, likes, comments } = post;

  return (
    <div className="max-w-3xl mx-auto px-4 pt-28 pb-12">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-gray-500 mb-4">
        By {author || "Dannie"} | {createdAt ? new Date(createdAt).toLocaleDateString() : "Unknown Date"}
      </p>

      {image && <img src={image} alt={title} className="w-full rounded-lg mb-6 shadow-md" />}

      <div className="prose dark:prose-invert max-w-none mb-10" dangerouslySetInnerHTML={{ __html: content }} />

      {/* Likes */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleLike}
          disabled={liking}
          className={`px-3 py-1 rounded ${likes > 0 ? "bg-red-500 text-white" : "bg-gray-200"}`}
        >
          ❤️ {likes || 0}
        </button>
        <span className="text-gray-500">{comments?.length || 0} comments</span>
      </div>

      {/* Comments Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        {!comments?.length && <p className="text-gray-500">No comments yet.</p>}
        <ul className="space-y-4">
          {comments?.map((c) => (
            <li key={c._id} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              {editingCommentId === c._id ? (
                <>
                  <textarea
                    value={editingCommentText}
                    onChange={(e) => setEditingCommentText(e.target.value)}
                    className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => saveComment(c._id)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p>{c.text}</p>
                  <span className="text-xs text-gray-400">
                    {c.author || "Anonymous"} — {new Date(c.createdAt).toLocaleString()}
                  </span>

                  {(c.author === currentUser?.name || currentUser?.role === "admin") && (
                    <div className="mt-1 flex gap-2">
                      {c.author === currentUser?.name && (
                        <button
                          onClick={() => startEditing(c)}
                          className="text-blue-500 text-sm hover:underline"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => deleteComment(c._id)}
                        className="text-red-500 text-sm hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Add Comment */}
      <div className="mt-6">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          rows="4"
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={submitComment}
          disabled={submitting}
          className="mt-3 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          {submitting ? "Submitting..." : "Post Comment"}
        </button>
      </div>
    </div>
  );
}
