import axios from "axios";
import { getCSRFToken } from "../utilities/csrf";

const api = axios.create({
  baseURL: "http://localhost:8000",
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
