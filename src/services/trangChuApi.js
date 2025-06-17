import axiosInstance from "./AxiosConfig";

const trangChuApi = {
  getAllBooks: async () => {
    try {
      // No token headers required - using the default configuration from axiosInstance
      const response = await axiosInstance.get("/sach/");
      console.log("API /sach/ response:", response.data);
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Dữ liệu sách không hợp lệ hoặc rỗng");
      }
      return response.data.map((s) => ({
        MaSach: s.MaSach,
        TenDauSach: s.TenDauSach || "Không xác định", // Thêm tên sách
        SLTon: s.SLTon || 0, // Xử lý trường hợp SLTon undefined
      }));
    } catch (error) {
      console.error("Error fetching /sach/:", error.message);
      throw error;
    }
  },

  getAllDauSach: async () => {
    try {
      const response = await axiosInstance.get("/dausach/");
      console.log("API /dausach/ response:", response.data);
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Dữ liệu đầu sách không hợp lệ hoặc rỗng");
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching /dausach/:", error.message);
      throw error;
    }
  },

  getAllCTHoaDon: async () => {
    try {
      // No token headers required
      const response = await axiosInstance.get("/cthoadon/");
      console.log("API /cthoadon/ response:", response.data);
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Dữ liệu chi tiết hóa đơn không hợp lệ hoặc rỗng");
      }
      return response.data.map((ct) => ({
        id: ct.id,
        SLBan: ct.SLBan || 0, // Xử lý trường hợp SLBan undefined
        MaHD: ct.MaHD,
        MaSach: ct.MaSach,
      }));
    } catch (error) {
      console.error("Error fetching /cthoadon/:", error.message);
      throw error;
    }
  },
  getAllHoaDon: async () => {
    try {
      // No token headers required
      const response = await axiosInstance.get("/hoadon/");
      console.log("API /hoadon/ response:", response.data);
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Dữ liệu hóa đơn không hợp lệ hoặc rỗng");
      }
      return response.data.map((hd) => ({
        MaHD: hd.MaHD,
        NgayLap: hd.NgayLap,
        SoTienTra: hd.SoTienTra || 0, // Thêm tổng tiền của hóa đơn
      }));
    } catch (error) {
      console.error("Error fetching /hoadon/:", error.message);
      throw error;
    }
  },
};

export default trangChuApi;
