import axios from "axios";
import { getCSRFToken } from "../utilities/csrf";

const BASE_URL = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getCSRFToken();
  if (token) {
    config.headers["X-CSRFToken"] = token;
  }
  return config;
});

export default api;
