import axios from "axios";

const API_URL = "http://localhost:8000/api";

const authService = {
  login: async (email, password) => {
    try {
      // Gọi API đăng nhập
      const response = await axios.post(`${API_URL}/token/`, {
        username: email,
        password: password,
      });

      console.log("Login response:", response.data);

      if (response.data.access) {
        // Lấy role từ user object, mặc định là "Kho" nếu không có
        const role = response.data.user?.role || "Kho";
        const userData = {
          email: email,
          token: response.data.access,
          refreshToken: response.data.refresh,
          user: response.data.user,
          role: role,
        };

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("currentRole", role);

        return response.data;
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error.response?.data || error.message);
      throw error;
    }
  },

  logout: () => {
    console.log("Logging out, clearing localStorage");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentRole");
  },

  getCurrentUser: () => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("getCurrentUser:", user);
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

      console.log("Refresh token response:", response.data);

      if (response.data.access) {
        const updatedUser = {
          ...user,
          token: response.data.access,
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));
        return response.data.access;
      }
    } catch (error) {
      console.error("Lỗi làm mới token:", error.response?.data || error.message);
      authService.logout();
      throw error;
    }
  },
};

export default authService;