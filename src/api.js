import axios from "axios";

export const API = axios.create({
  baseURL: "https://thj-backend.onrender.com/api/hero",
  withCredentials: true
});
