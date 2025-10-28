import { useState, useCallback, useRef } from "react";
import axios from "axios";

// Use your production API URL from Vercel, fallback to local
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_PREFIX = "/api"; // keep routes clean

const api = axios.create({
  baseURL: `${BASE_URL}${API_PREFIX}`,
  timeout: 15000,
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  const isFormData = config.data instanceof FormData;
  if (!isFormData && !config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

export default function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inFlight = useRef(0);

  const request = useCallback(
    async ({ url, method = "get", data, params, headers }) => {
      setError(null);
      inFlight.current += 1;
      setLoading(true);
      try {
        const res = await api.request({ url, method, data, params, headers });
        return res.data;
      } catch (err) {
        const status = err.response?.status ?? 0;
        const payload = err.response?.data;
        const message =
          (typeof payload === "string" && payload) ||
          payload?.message ||
          err.message ||
          "Request failed";
        const shaped = { status, message, details: payload?.details ?? payload ?? null };
        setError(shaped);
        throw shaped;
      } finally {
        inFlight.current -= 1;
        if (inFlight.current <= 0) {
          inFlight.current = 0;
          setLoading(false);
        }
      }
    },
    []
  );

  return { loading, error, request };
}
