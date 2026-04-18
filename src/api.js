import axios from "axios";

export const API = axios.create({
  baseURL: "https://thj-backend.onrender.com/api/hero",
});

// Attach admin token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});