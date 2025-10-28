// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../api/useApi";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { request, loading, error } = useApi();
  const { login } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [localErr, setLocalErr] = useState("");

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const isValid =
    form.name.trim().length >= 2 &&
    /^\S+@\S+\.\S+$/.test(form.email) &&
    form.password.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalErr("");

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
    };

    try {
      // Updated to match backend route
      const res = await request({
        url: "/users/register", // <-- matches app.use("/api/users", userAuthRoutes)
        method: "POST",
        data: payload,
      });

      if (res?.token && res?.user) {
        login({ token: res.token, user: res.user });
        navigate(res.user.role === "admin" ? "/admin" : "/dashboard", {
          replace: true,
        });
      } else {
        setLocalErr("Unexpected response from server.");
      }
    } catch (err) {
      console.error("Register error:", err);
      setLocalErr(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Create an account</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="name"
          type="text"
          placeholder="Full name"
          value={form.name}
          onChange={onChange}
          required
          className="p-3 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={onChange}
          required
          className="p-3 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
        />
        <input
          name="password"
          type="password"
          placeholder="Password (min 8 chars)"
          value={form.password}
          onChange={onChange}
          required
          minLength={8}
          className="p-3 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
        />

        <button
          type="submit"
          disabled={loading || !isValid}
          className={`p-3 text-white rounded transition ${
            loading || !isValid
              ? "bg-purple-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {(localErr || error) && (
        <p className="text-red-500 mt-3">
          {localErr || error?.message || JSON.stringify(error)}
        </p>
      )}
    </div>
  );
}
