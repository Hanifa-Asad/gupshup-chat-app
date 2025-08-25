// import axios from "axios";

// export const axiosInstance = axios.create({
//   baseURL: import.meta.env.MODE === "development" ? "https://gupshup-chat-app-gz05.onrender.com" : "/api",
//   withCredentials: true,
// });

// frontend/src/lib/axios.js
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development"
    ? "http://localhost:5000/api" // local dev
    : "https://gupshup-chat-app-gz05.onrender.com/api", // deployed backend
  withCredentials: true,
});
