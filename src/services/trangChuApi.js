import axiosInstance from "./AxiosConfig";

const trangChuApi = {
  getAllBooks: async () => {
    try {
      const response = await axiosInstance.get("/sach/", {
        headers: { "Content-Type": "application/json" },
      });
      console.log("API /sach/ response:", response.data);
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Dữ liệu sách không hợp lệ hoặc rỗng");
      }
      return response.data.map((s) => ({
        MaSach: s.MaSach,
        SLTon: s.SLTon || 0, // Xử lý trường hợp SLTon undefined
      }));
    } catch (error) {
      console.error("Error fetching /sach/:", error.message);
      throw error;
    }
  },

  getAllCTHoaDon: async () => {
    try {
      const response = await axiosInstance.get("/cthoadon/", {
        headers: { "Content-Type": "application/json" },
      });
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
      const response = await axiosInstance.get("/hoadon/", {
        headers: { "Content-Type": "application/json" },
      });
      console.log("API /hoadon/ response:", response.data);
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Dữ liệu hóa đơn không hợp lệ hoặc rỗng");
      }
      return response.data.map((hd) => ({
        MaHD: hd.MaHD,
        NgayLap: hd.NgayLap,
      }));
    } catch (error) {
      console.error("Error fetching /hoadon/:", error.message);
      throw error;
    }
  },
};

export default trangChuApi;
