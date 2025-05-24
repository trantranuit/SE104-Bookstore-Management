import axios from "axios";
import authService from "./authService";

const API_URL = "http://localhost:8000/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để tự động thêm token vào mọi request
axiosInstance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("Interceptor: user from localStorage:", user); // Debug
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    } else {
      console.warn("Interceptor: No user or token found in localStorage");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor để tự động refresh token khi token hết hạn
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 (Unauthorized) và chưa thử refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Thử refresh token
        const token = await authService.refreshToken();
        console.log("Interceptor: New token after refresh:", token); // Debug
        // Thêm token mới vào request và thử lại
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        originalRequest.headers["Authorization"] = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Interceptor: Refresh token failed:", refreshError);
        authService.logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
