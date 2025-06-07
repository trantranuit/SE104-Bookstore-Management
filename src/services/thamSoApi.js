import axiosInstance from "./AxiosConfig";

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Request URL:", config.url);
    console.log("Request Payload:", config.data); // Thêm log payload
    return config;
  },
  (error) => Promise.reject(error)
);

const thamSoApi = {
  getThamSo: async () => {
    try {
      const response = await axiosInstance.get("/thamso/");
      console.log("API Response Data:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching tham so:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  updateThamSo: async (id, data) => {
    try {
      const response = await axiosInstance.put(`/thamso/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating tham so:", {
        message: error.message,
        responseData: error.response?.data, // Log chi tiết phản hồi lỗi
        status: error.response?.status,
      });
      throw error;
    }
  },
};

export default thamSoApi;
