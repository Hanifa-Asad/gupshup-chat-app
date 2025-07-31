import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "https://gupshup-chat-app-gz05.onrender.com" : "/api",
  withCredentials: true,
});