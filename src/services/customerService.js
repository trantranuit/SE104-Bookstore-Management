import axios from "axios";

const API_URL = "http://localhost:8000/api";

// Get authentication token from localStorage or your auth service
const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user.token;
};

// Configure axios with headers
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token to each request
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Customer API service
const customerService = {
  // Get all customers (with optional search params)
  getAllCustomers: async (searchTerm = "") => {
    let params = {};
    if (searchTerm) {
      // Add search parameters based on backend API
      params = { name: searchTerm };
    }

    try {
      const response = await apiClient.get("/khachhang/", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
  },

  // Get customer by ID
  getCustomerById: async (id) => {
    try {
      const response = await apiClient.get(`/khachhang/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer ${id}:`, error);
      throw error;
    }
  },

  // Create new customer
  createCustomer: async (customerData) => {
    try {
      const response = await apiClient.post("/khachhang/", {
        HoTen: customerData.name,
        DienThoai: customerData.phone,
        Email: customerData.email,
        DiaChi: customerData.address,
        SoTienNo: customerData.debtAmount,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating customer:", error);
      throw error;
    }
  },

  // Update existing customer
  updateCustomer: async (id, customerData) => {
    try {
      const response = await apiClient.put(`/khachhang/${id}/`, {
        HoTen: customerData.name,
        DienThoai: customerData.phone,
        Email: customerData.email,
        DiaChi: customerData.address,
        SoTienNo: customerData.debtAmount,
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating customer ${id}:`, error);
      throw error;
    }
  },

  // Delete customer
  deleteCustomer: async (id) => {
    try {
      await apiClient.delete(`/khachhang/${id}/`);
      return true;
    } catch (error) {
      console.error(`Error deleting customer ${id}:`, error);
      throw error;
    }
  },
};

export default customerService;
