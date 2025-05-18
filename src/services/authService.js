import axios from "axios";

const API_URL = "http://localhost:8000/api";

const authService = {
  login: async (email, password, role) => {
    try {
      // Gọi API đăng nhập từ backend
      const response = await axios.post(`${API_URL}/token/`, {
        username: email, // Hoặc sử dụng email tùy theo API backend
        password: password,
      });

      if (response.data.access) {
        // Lưu thông tin đăng nhập vào localStorage
        const userData = {
          email: email,
          role: role,
          token: response.data.access,
          refreshToken: response.data.refresh,
        };

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("isLoggedIn", "true");

        return response.data;
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem("user"));
  },

  refreshToken: async () => {
    try {
      const user = authService.getCurrentUser();

      if (!user || !user.refreshToken) {
        throw new Error("Không có refresh token");
      }

      const response = await axios.post(`${API_URL}/token/refresh/`, {
        refresh: user.refreshToken,
      });

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
      console.error("Lỗi làm mới token:", error);
      // Nếu refresh token hết hạn, đăng xuất người dùng
      authService.logout();
      throw error;
    }
  },
};

export default authService;
