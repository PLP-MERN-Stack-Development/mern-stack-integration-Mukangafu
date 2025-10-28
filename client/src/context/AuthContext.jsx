// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import useApi from "../api/useApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { request } = useApi();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (savedUser && token) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  // ✅ Register
  const register = async (name, email, password) => {
    try {
      const res = await request({
        url: "/users/register",
        method: "POST",
        data: { name, email, password },
      });

      if (res?.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        setUser(res.user);
        return { success: true };
      } else {
        return { success: false, message: "Invalid response from server" };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  // ✅ Login
  const login = async (email, password) => {
    try {
      const res = await request({
        url: "/users/login",
        method: "POST",
        data: { email, password },
      });

      if (res?.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        setUser(res.user);
        return { success: true };
      } else return { success: false, message: "Invalid response from server" };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
