import axiosInstance from "./AxiosConfig";

const userApi = {
  getAllUsers: async () => {
    try {
      const response = await axiosInstance.get("/user/");
      return response.data.map((user) => ({
        id: user.id,
        last_name: user.last_name,
        first_name: user.first_name,
        role: user.role,
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  getUsersByRole: async (role) => {
    try {
      const response = await axiosInstance.get("/user/");
      return response.data
        .filter((user) => user.role === role)
        .map((user) => ({
          id: user.id,
          fullName: `${user.last_name} ${user.first_name}`.trim(),
          role: user.role,
        }));
    } catch (error) {
      console.error("Error fetching users by role:", error);
      throw error;
    }
  },
};

export default userApi;
