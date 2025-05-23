import axios from "axios";

const API_URL = "http://localhost:8000/api";

const authService = {
  login: async (email, password) => {
    try {
      // Gọi API đăng nhập từ backend
      const response = await axios.post(`${API_URL}/token/`, {
        username: email, // Hoặc sử dụng email tùy theo API backend
        password: password,
      });

      console.log("Login response:", response.data); // Debug

      if (response.data.access) {
        // Lưu thông tin đăng nhập vào localStorage
        const userData = {
          email: email,
          token: response.data.access,
          refreshToken: response.data.refresh,
          user: response.data.user, // Store the full user object
        };

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("isLoggedIn", "true");

        return response.data;
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error.response?.data || error.message);
      throw error;
    }
  },

  logout: () => {
    console.log("Logging out, clearing localStorage"); // Debug
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
  },

  getCurrentUser: () => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("getCurrentUser:", user); // Debug
    return user;
  },

  refreshToken: async () => {
    try {
      const user = authService.getCurrentUser();

      if (!user || !user.refreshToken) {
        console.error("No refresh token available");
        throw new Error("Không có refresh token");
      }

      const response = await axios.post(`${API_URL}/token/refresh/`, {
        refresh: user.refreshToken,
      });

      console.log("Refresh token response:", response.data); // Debug

      if (response.data.access) {
        // Cập nhật token mới vào localStorage
        const updatedUser = {
          ...user,
          token: response.data.access,
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));
        return response.data.access;
      }
    } catch (error) {
      console.error(
        "Lỗi làm mới token:",
        error.response?.data || error.message
      );
      // Nếu refresh token hết hạn, đăng xuất người dùng
      authService.logout();
      throw error;
    }
  },
};

export default authService;
