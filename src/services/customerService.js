import axiosInstance from "./AxiosConfig";

const customerService = {
  // Get all customers
  getAllCustomers: async (searchTerm = "") => {
    let params = {};
    if (searchTerm) {
      params = { search: searchTerm };
    }
    try {
      const response = await axiosInstance.get("/khachhang/", { params });
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi lấy danh sách khách hàng:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.detail || "Không thể lấy danh sách khách hàng"
      );
    }
  },

  // Get customer by ID
  getCustomerById: async (MaKhachHang) => {
    try {
      const response = await axiosInstance.get(`/khachhang/${MaKhachHang}/`);
      return response.data;
    } catch (error) {
      console.error(
        `Lỗi khi lấy khách hàng ${MaKhachHang}:`,
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.detail || "Không thể lấy thông tin khách hàng"
      );
    }
  },

  // Create new customer
  createCustomer: async (customerData) => {
    try {
      const payload = {
        HoTen: customerData.name?.trim(),
        DienThoai: customerData.phone?.trim(),
        Email: customerData.email?.trim(),
        DiaChi: customerData.address?.trim(),
        SoTienNo: Number(customerData.debtAmount) || 0,
      };
      console.log(
        "Payload for createCustomer:",
        JSON.stringify(payload, null, 2)
      );
      const response = await axiosInstance.post("/khachhang/", payload);
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi tạo khách hàng:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.detail || "Không thể tạo khách hàng"
      );
    }
  },

  // Update existing customer
  updateCustomer: async (MaKhachHang, customerData) => {
    try {
      // Extract numeric ID from MaKhachHang (remove "KH" prefix)
      const customerId = MaKhachHang.replace("KH", "");
      console.log(`Updating customer with ID: ${customerId}`);

      // Format payload according to API expectations
      const payload = {
        HoTen: customerData.name?.trim(),
        DiaChi: customerData.address?.trim(),
        DienThoai: customerData.phone?.trim(),
        Email: customerData.email?.trim(),
        SoTienNo: customerData.debtAmount?.toString() || "0",
      };

      console.log("Update payload:", JSON.stringify(payload, null, 2));

      // Try with trailing slash
      const response = await axiosInstance.put(
        `/khachhang/${customerId}/`,
        payload
      );

      return response.data;
    } catch (error) {
      console.error(
        `Lỗi khi cập nhật khách hàng ${MaKhachHang}:`,
        error.response?.data || error.message,
        error.response?.status
      );

      // Provide more specific error message based on response
      if (error.response?.status === 404) {
        throw new Error("Không tìm thấy khách hàng với mã này");
      } else if (error.response?.status === 400) {
        throw new Error(
          error.response?.data?.detail || "Dữ liệu cập nhật không hợp lệ"
        );
      }

      throw new Error(
        error.response?.data?.detail || "Không thể cập nhật khách hàng"
      );
    }
  },

  // Delete customer
  deleteCustomer: async (MaKhachHang) => {
    try {
      // Extract numeric ID from MaKhachHang for delete operation
      const customerId = MaKhachHang.replace("KH", "");
      console.log(`Deleting customer with ID: ${customerId}`);

      const response = await axiosInstance.delete(`/khachhang/${customerId}/`);
      return response.data;
    } catch (error) {
      console.error(
        `Lỗi khi xóa khách hàng ${MaKhachHang}:`,
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.detail || "Không thể xóa khách hàng"
      );
    }
  },
};

export default customerService;
