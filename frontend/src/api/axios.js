import axios from "axios";
import { apiBaseUrl } from "./config.js";

const api = axios.create({
  baseURL: `${apiBaseUrl}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("dispatch_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
