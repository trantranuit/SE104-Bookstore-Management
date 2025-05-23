import axiosInstance from "./AxiosConfig";

const thanhToanMoiApi = {
    // Sách
    getAllBooks: async (params = {}) => {
        const response = await axiosInstance.get("/sach/", { params });
        return response.data.map(s => ({
            MaSach: s.MaSach,
            NXB: s.NXB,
            NamXB: s.NamXB,
            SLTon: s.SLTon,
            MaDauSach: s.MaDauSach
        }));
    },
    getBookById: async (id) => {
        const s = (await axiosInstance.get(`/sach/${id}/`)).data;
        return {
            MaSach: s.MaSach,
            NXB: s.NXB,
            NamXB: s.NamXB,
            SLTon: s.SLTon,
            MaDauSach: s.MaDauSach
        };
    },

    // Khách hàng
    getAllCustomers: async (params = {}) => {
        const response = await axiosInstance.get("/khachhang/", { params });
        return response.data.map(c => ({
            MaKhachHang: c.MaKhachHang,
            HoTen: c.HoTen,
            DiaChi: c.DiaChi,
            DienThoai: c.DienThoai,
            Email: c.Email,
            SoTienNo: c.SoTienNo
        }));
    },
    getCustomerById: async (id) => {
        const c = (await axiosInstance.get(`/khachhang/${id}/`)).data;
        return {
            MaKhachHang: c.MaKhachHang,
            HoTen: c.HoTen,
            DiaChi: c.DiaChi,
            DienThoai: c.DienThoai,
            Email: c.Email,
            SoTienNo: c.SoTienNo
        };
    },

    // Nhân viên (user)
    getAllUsers: async (params = {}) => {
        const response = await axiosInstance.get("/user/", { params });
        return response.data.map(u => ({
            id: u.id,
            username: u.username,
            email: u.email,
            first_name: u.first_name,
            last_name: u.last_name,
            gioiTinh: u.gioiTinh
        }));
    },
    getUserById: async (id) => {
        const u = (await axiosInstance.get(`/user/${id}/`)).data;
        return {
            id: u.id,
            username: u.username,
            email: u.email,
            first_name: u.first_name,
            last_name: u.last_name,
            gioiTinh: u.gioiTinh
        };
    },

    // Đầu sách
    getAllDauSach: async (params = {}) => {
        const response = await axiosInstance.get("/dausach/", { params });
        return response.data.map(d => ({
            MaDauSach: d.MaDauSach,
            TenSach: d.TenSach,
            MaTheLoai: d.MaTheLoai,
            MaTG: d.MaTG
        }));
    },
    getDauSachById: async (id) => {
        const d = (await axiosInstance.get(`/dausach/${id}/`)).data;
        return {
            MaDauSach: d.MaDauSach,
            TenSach: d.TenSach,
            MaTheLoai: d.MaTheLoai,
            MaTG: d.MaTG
        };
    },

    // Tác giả
    getAllTacGia: async (params = {}) => {
        const response = await axiosInstance.get("/tacgia/", { params });
        return response.data.map(tg => ({
            MaTG: tg.MaTG,
            TenTG: tg.TenTG
        }));
    },
    getTacGiaById: async (id) => {
        const tg = (await axiosInstance.get(`/tacgia/${id}/`)).data;
        return {
            MaTG: tg.MaTG,
            TenTG: tg.TenTG
        };
    },

    // Thể loại
    getAllTheLoai: async (params = {}) => {
        const response = await axiosInstance.get("/theloai/", { params });
        return response.data.map(tl => ({
            MaTheLoai: tl.MaTheLoai,
            TenTheLoai: tl.TenTheLoai
        }));
    },
    getTheLoaiById: async (id) => {
        const tl = (await axiosInstance.get(`/theloai/${id}/`)).data;
        return {
            MaTheLoai: tl.MaTheLoai,
            TenTheLoai: tl.TenTheLoai
        };
    },

    // Hóa đơn
    getAllHoaDon: async (params = {}) => {
        const response = await axiosInstance.get("/hoadon/", { params });
        return response.data.map(hd => ({
            MaHD: hd.MaHD,
            NgayLap: hd.NgayLap,
            TongTien: hd.TongTien,
            SoTienTra: hd.SoTienTra,
            ConLai: hd.ConLai,
            MaKH: hd.MaKH,
            NguoiLapHD: hd.NguoiLapHD,
            MaSach: hd.MaSach
        }));
    },
    getHoaDonById: async (id) => {
        const hd = (await axiosInstance.get(`/hoadon/${id}/`)).data;
        return {
            MaHD: hd.MaHD,
            NgayLap: hd.NgayLap,
            TongTien: hd.TongTien,
            SoTienTra: hd.SoTienTra,
            ConLai: hd.ConLai,
            MaKH: hd.MaKH,
            NguoiLapHD: hd.NguoiLapHD,
            MaSach: hd.MaSach
        };
    },

    // Chi tiết hóa đơn
    getAllCTHoaDon: async (params = {}) => {
        const response = await axiosInstance.get("/cthoadon/", { params });
        return response.data.map(ct => ({
            id: ct.id,
            SLBan: ct.SLBan,
            GiaBan: ct.GiaBan,
            ThanhTien: ct.ThanhTien,
            MaHD: ct.MaHD,
            MaSach: ct.MaSach
        }));
    },
    getCTHoaDonById: async (id) => {
        const ct = (await axiosInstance.get(`/cthoadon/${id}/`)).data;
        return {
            id: ct.id,
            SLBan: ct.SLBan,
            GiaBan: ct.GiaBan,
            ThanhTien: ct.ThanhTien,
            MaHD: ct.MaHD,
            MaSach: ct.MaSach
        };
    }
};

export default thanhToanMoiApi;
