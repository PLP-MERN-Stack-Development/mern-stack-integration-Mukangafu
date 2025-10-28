// src/api/useApi.js
import { useState, useCallback, useRef } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // Set sensible defaults; don't override FormData
  const isFormData = config.data instanceof FormData;
  if (!isFormData && !config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

export default function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Optional: protects against race conditions/unmounted updates
  const inFlight = useRef(0);

  const request = useCallback(
    async ({ url, method = "get", data = undefined, params = undefined, headers = undefined }) => {
      setError(null);
      inFlight.current += 1;
      setLoading(true);
      try {
        const res = await api.request({ url, method, data, params, headers });

        return res.data; // expected: { token, user } or your API payload
      } catch (err) {
        // Normalize the error
        const status = err.response?.status ?? 0;
        const payload = err.response?.data;
        const message =
          (typeof payload === "string" && payload) ||
          payload?.message ||
          err.message ||
          "Request failed";

        const shaped = { status, message, details: payload?.details ?? payload ?? null };
        setError(shaped);
        throw shaped; // consumers can catch {status, message, details}
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
