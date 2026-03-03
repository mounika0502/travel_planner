import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.MODE === "production"
      ? "https://travel-planner-8akq.onrender.com/api/"
      : "http://127.0.0.1:8000/api/",
});

// Attach JWT token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
