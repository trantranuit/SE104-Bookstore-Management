import axiosInstance from "./AxiosConfig";

const phieuNhapSachApi = {
  getTheLoai: async () => {
    try {
      const response = await axiosInstance.get("/theloai/");
      if (!Array.isArray(response.data)) {
        throw new Error("Dữ liệu thể loại không hợp lệ");
      }
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi lấy danh sách thể loại:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  addTheLoai: async (tenTheLoai) => {
    try {
      if (!tenTheLoai || typeof tenTheLoai !== "string") {
        throw new Error("Tên thể loại không hợp lệ");
      }
      const response = await axiosInstance.post("/theloai/", {
        TenTheLoai: tenTheLoai,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi thêm thể loại:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  getTacGia: async () => {
    try {
      const response = await axiosInstance.get("/tacgia/");
      if (!Array.isArray(response.data)) {
        throw new Error("Dữ liệu tác giả không hợp lệ");
      }
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi lấy danh sách tác giả:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  addTacGia: async (tenTacGia) => {
    try {
      if (!tenTacGia || typeof tenTacGia !== "string") {
        throw new Error("Tên tác giả không hợp lệ");
      }
      const response = await axiosInstance.post("/tacgia/", {
        TenTG: tenTacGia,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi thêm tác giả:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  getDauSach: async () => {
    try {
      const response = await axiosInstance.get("/dausach/");
      if (!Array.isArray(response.data)) {
        throw new Error("Dữ liệu đầu sách không hợp lệ");
      }
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi lấy danh sách đầu sách:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  addDauSach: async (tenSach, maTheLoai, maTacGia) => {
    try {
      if (!tenSach || !maTheLoai || !maTacGia) {
        throw new Error("Thiếu thông tin đầu sách");
      }
      const response = await axiosInstance.post("/dausach/", {
        TenSach: tenSach,
        MaTheLoai: maTheLoai,
        MaTG: Array.isArray(maTacGia) ? maTacGia : [maTacGia],
      });
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi thêm đầu sách:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  getSach: async () => {
    try {
      const response = await axiosInstance.get("/sach/");
      if (!Array.isArray(response.data)) {
        throw new Error("Dữ liệu sách không hợp lệ");
      }
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi lấy danh sách sách:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  addSach: async (maSach, nxb, namXB, maDauSach) => {
    try {
      if (!maSach || !nxb || !namXB || !maDauSach) {
        throw new Error("Thiếu thông tin sách");
      }
      const response = await axiosInstance.post("/sach/", {
        MaSach: maSach,
        NXB: nxb,
        NamXB: namXB,
        SLTon: 0,
        MaDauSach: maDauSach,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi thêm sách:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  updateSach: async (maSach, data) => {
    try {
      if (!maSach || !data) {
        throw new Error("Thiếu thông tin cập nhật sách");
      }
      const response = await axiosInstance.put(`/sach/${maSach}/`, {
        MaSach: maSach,
        ...data,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi cập nhật sách:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  getPhieuNhapSach: async () => {
    try {
      const response = await axiosInstance.get("/phieunhapsach/");
      if (!Array.isArray(response.data)) {
        throw new Error("Dữ liệu phiếu nhập không hợp lệ");
      }
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi lấy danh sách phiếu nhập:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  addPhieuNhapSach: async (maPhieuNhap, data) => {
    try {
      const payload = {
        NgayNhap: data.NgayNhap,
        NguoiNhap_input: data.NguoiNhap_input,
      };
      console.log("Creating phieu nhap:", payload);
      const response = await axiosInstance.post("/phieunhapsach/", payload);
      if (!response.data || !response.data.MaPhieuNhap) {
        throw new Error("Không nhận được mã phiếu nhập từ server");
      }
      return response.data;
    } catch (error) {
      console.error(
        "Error creating phieu nhap:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  addCTNhapSach: async (maPhieuNhap, maSach, soLuong, giaNhap) => {
    try {
      const payload = {
        MaPhieuNhap_input: maPhieuNhap,
        MaSach_input: maSach,
        SLNhap: soLuong,
        GiaNhap: giaNhap,
      };
      console.log("Adding chi tiet:", payload);
      const response = await axiosInstance.post("/ctnhapsach/", payload);
      if (!response.data || !response.data.MaCT_NhapSach) {
        throw new Error("Không nhận được mã chi tiết từ server");
      }
      return response.data;
    } catch (error) {
      console.error(
        "Error adding chi tiet:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  updatePhieuNhapSach: async (maPhieuNhap, data) => {
    try {
      if (!maPhieuNhap || !data.NgayNhap || !data.NguoiNhap) {
        throw new Error("Thiếu thông tin cập nhật phiếu nhập");
      }
      const response = await axiosInstance.put(
        `/phieunhapsach/${maPhieuNhap}/`,
        {
          MaPhieuNhap: maPhieuNhap,
          NgayNhap: data.NgayNhap,
          NguoiNhap: data.NguoiNhap,
          MaSach: data.MaSach,
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi cập nhật phiếu nhập:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  updateCTNhapSach: async (id, maPhieuNhap, maSach, soLuong, giaNhap) => {
    try {
      if (!id || !maPhieuNhap || !maSach || !soLuong || !giaNhap) {
        throw new Error("Thiếu thông tin cập nhật chi tiết nhập sách");
      }
      if (soLuong <= 0 || giaNhap <= 0) {
        throw new Error("Số lượng và giá nhập phải lớn hơn 0");
      }

      console.log("API Call - Update CTNhapSach:", {
        url: `/ctnhapsach/${id}/`,
        payload: {
          MaPhieuNhap_input: maPhieuNhap,
          MaSach_input: maSach,
          SLNhap: parseInt(soLuong),
          GiaNhap: parseFloat(giaNhap),
        },
      });

      const response = await axiosInstance.put(`/ctnhapsach/${id}/`, {
        MaPhieuNhap_input: maPhieuNhap,
        MaSach_input: maSach,
        SLNhap: parseInt(soLuong),
        GiaNhap: parseFloat(giaNhap),
      });
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi cập nhật chi tiết nhập sách:",
        error.response?.data || error.message,
        "Status:",
        error.response?.status,
        "Request Data:",
        error.response?.config?.data
      );
      throw error;
    }
  },
  getCTNhapSach: async () => {
    try {
      const response = await axiosInstance.get("/ctnhapsach/");
      if (!Array.isArray(response.data)) {
        throw new Error("Dữ liệu chi tiết nhập sách không hợp lệ");
      }
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi lấy danh sách chi tiết nhập sách:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
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
  getNextMaPhieuNhap: async () => {
    try {
      const response = await axiosInstance.get("/phieunhapsach/next-id/");
      if (!response.data || !response.data.MaPhieuNhap_input) {
        throw new Error("Không nhận được mã phiếu nhập tiếp theo từ server");
      }
      return response.data.MaPhieuNhap_input;
    } catch (error) {
      console.error("Lỗi khi lấy mã phiếu nhập tiếp theo:", error);
      throw error;
    }
  },
};

export default phieuNhapSachApi;
