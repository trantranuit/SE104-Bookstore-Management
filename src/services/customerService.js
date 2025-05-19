import axiosInstance from "./AxiosConfig";

// Customer API service
const customerService = {
  // Get all customers (with optional search params)
  getAllCustomers: async (searchTerm = "") => {
    let params = {};
    if (searchTerm) {
      params = {
        search: searchTerm, // Changed to use a single search parameter that will match either name or phone
      };
    }

    try {
      const response = await axiosInstance.get("/khachhang/", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
  },

  // Get customer by ID
  getCustomerById: async (id) => {
    try {
      const response = await axiosInstance.get(`/khachhang/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer ${id}:`, error);
      throw error;
    }
  },

  // Create new customer
  createCustomer: async (customerData) => {
    try {
      const response = await axiosInstance.post("/khachhang/", {
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
      const response = await axiosInstance.put(`/khachhang/${id}/`, {
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
      const response = await axiosInstance.delete(`/khachhang/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting customer ${id}:`, error);
      throw error;
    }
  },
};

export default customerService;
