import axiosInstance from "./AxiosConfig";

const phieuNhapSachApi = {
  // Lấy danh sách thể loại
  getTheLoai: async () => {
    try {
      const response = await axiosInstance.get("/theloai/");
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi lấy danh sách thể loại:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Thêm thể loại mới
  addTheLoai: async (tenTheLoai) => {
    try {
      const response = await axiosInstance.post("/theloai/", {
        TenTheLoai: tenTheLoai,
      });
      console.log("Thêm thể loại thành công:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi thêm thể loại:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Lấy danh sách tác giả
  getTacGia: async () => {
    try {
      const response = await axiosInstance.get("/tacgia/");
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi lấy danh sách tác giả:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Thêm tác giả mới
  addTacGia: async (tenTacGia) => {
    try {
      const response = await axiosInstance.post("/tacgia/", {
        TenTG: tenTacGia,
      });
      console.log("Thêm tác giả thành công:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi thêm tác giả:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Lấy danh sách đầu sách
  getDauSach: async () => {
    try {
      const response = await axiosInstance.get("/dausach/");
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi lấy danh sách đầu sách:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Thêm đầu sách mới
  addDauSach: async (tenSach, maTheLoai, maTacGia) => {
    try {
      const response = await axiosInstance.post("/dausach/", {
        TenSach: tenSach,
        MaTheLoai: maTheLoai,
        MaTG: [maTacGia],
      });
      console.log("Thêm đầu sách thành công:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi thêm đầu sách:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Lấy danh sách sách
  getSach: async () => {
    try {
      const response = await axiosInstance.get("/sach/");
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi lấy danh sách sách:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Thêm sách mới
  addSach: async (maSach, nxb, namXB, maDauSach) => {
    try {
      const response = await axiosInstance.post("/sach/", {
        MaSach: maSach,
        NXB: nxb,
        NamXB: namXB,
        SLTon: 0,
        MaDauSach: maDauSach,
      });
      console.log("Thêm sách thành công:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi thêm sách:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Cập nhật sách
  updateSach: async (maSach, data) => {
    try {
      const response = await axiosInstance.put(`/sach/${maSach}/`, {
        MaSach: maSach,
        ...data,
      });
      console.log("Cập nhật sách thành công:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi cập nhật sách:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Lấy danh sách phiếu nhập sách
  getPhieuNhapSach: async () => {
    try {
      const response = await axiosInstance.get("/phieunhapsach/");
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi lấy danh sách phiếu nhập:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Thêm phiếu nhập sách mới
  addPhieuNhapSach: async (maPhieuNhap, data) => {
    try {
      const response = await axiosInstance.post("/phieunhapsach/", {
        NgayNhap: data.NgayNhap,
        NguoiNhap_input: data.NguoiNhap_input, // Sử dụng NguoiNhap_input
      });
      console.log("Thêm phiếu nhập thành công:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi thêm phiếu nhập:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Cập nhật phiếu nhập sách
  updatePhieuNhapSach: async (maPhieuNhap, data) => {
    try {
      const response = await axiosInstance.put(
        `/phieunhapsach/${maPhieuNhap}/`,
        {
          MaPhieuNhap: maPhieuNhap,
          NgayNhap: data.NgayNhap,
          NguoiNhap: data.NguoiNhap,
          MaSach: data.MaSach,
        }
      );
      console.log("Cập nhật phiếu nhập thành công:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi cập nhật phiếu nhập:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Thêm chi tiết nhập sách
  addCTNhapSach: async (maPhieuNhap, maSach, soLuong, giaNhap) => {
    try {
      const response = await axiosInstance.post("/ctnhapsach/", {
        MaPhieuNhap: maPhieuNhap,
        MaSach: maSach,
        SLNhap: soLuong,
        GiaNhap: giaNhap,
      });
      console.log("Thêm chi tiết nhập sách thành công:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi thêm chi tiết nhập sách:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Cập nhật chi tiết nhập sách
  updateCTNhapSach: async (id, maPhieuNhap, maSach, soLuong, giaNhap) => {
    try {
      if (!id || !soLuong || !giaNhap) {
        throw new Error("Thiếu thông tin bắt buộc: id, soLuong, hoặc giaNhap");
      }
      if (soLuong <= 0 || giaNhap <= 0) {
        throw new Error("Số lượng và giá nhập phải lớn hơn 0");
      }
      const response = await axiosInstance.put(`/ctnhapsach/${id}/`, {
        MaPhieuNhap: maPhieuNhap,
        MaSach: maSach,
        SLNhap: parseInt(soLuong),
        GiaNhap: parseFloat(giaNhap),
      });
      console.log("Cập nhật chi tiết nhập sách thành công:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi cập nhật chi tiết nhập sách:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Lấy chi tiết nhập sách
  getCTNhapSach: async () => {
    try {
      const response = await axiosInstance.get("/ctnhapsach/");
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi lấy danh sách chi tiết nhập sách:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Lấy thông số (nếu có)
  getThamSo: async () => {
    try {
      const response = await axiosInstance.get("/thamso/");
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi lấy thông số:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default phieuNhapSachApi;
