import axiosInstance from "./AxiosConfig";

// API cho ThanhToanCu.jsx
const phieuThuTienApi = {
    // Lấy tất cả khách hàng
    getAllCustomers: async (params = {}) => {
        const response = await axiosInstance.get("/khachhang/", { params });
        const KhachHang = response.data.map(c => ({
            MaKhachHang: c.MaKhachHang,
            HoTen: c.HoTen,
            DiaChi: c.DiaChi,
            DienThoai: c.DienThoai,
            Email: c.Email,
            SoTienNo: c.SoTienNo
        }));
        return KhachHang;
    },

    // Lấy khách hàng theo mã
    getCustomerById: async (id) => {
        const response = await axiosInstance.get(`/khachhang/${id}/`);
        const c = response.data;
        const KhachHang = {
            MaKhachHang: c.MaKhachHang,
            HoTen: c.HoTen,
            DiaChi: c.DiaChi,
            DienThoai: c.DienThoai,
            Email: c.Email,
            SoTienNo: c.SoTienNo
        };
        return KhachHang;
    },

    // Lấy tất cả nhân viên (user)
    getAllUsers: async (params = {}) => {
        const response = await axiosInstance.get("/user/", { params });
        const User = response.data.map(u => ({
            id: u.id,
            username: u.username,
            email: u.email,
            first_name: u.first_name,
            last_name: u.last_name,
            gioiTinh: u.gioiTinh
        }));
        return User;
    },

    // Lấy nhân viên theo mã
    getUserById: async (id) => {
        const response = await axiosInstance.get(`/user/${id}/`);
        const u = response.data;
        const User = {
            id: u.id,
            username: u.username,
            email: u.email,
            first_name: u.first_name,
            last_name: u.last_name,
            gioiTinh: u.gioiTinh
        };
        return User;
    },

    // Tạo phiếu thu mới
    createReceipt: async (receiptData) => {
        const response = await axiosInstance.post("/phieuthutien/", receiptData);
        return response.data;
    },

    // Cập nhật phiếu thu
    updateReceipt: async (id, receiptData) => {
        const response = await axiosInstance.put(`/phieuthutien/${id}/`, receiptData);
        return response.data;
    },

    // Cập nhật số tiền nợ của khách hàng
    updateCustomerDebt: async (id, debtData) => {
        const response = await axiosInstance.patch(`/khachhang/${id}/`, debtData);
        return response.data;
    },

    // Lấy tất cả phiếu thu tiền
    getAllReceipts: async (params = {}) => {
        const response = await axiosInstance.get("/phieuthutien/", { params });
        const PhieuThuTien = response.data.map(p => ({
            MaPhieuThu: p.MaPhieuThu,
            MaKH: p.MaKH,
            TenKH: p.TenKH,
            SoTienThu: p.SoTienThu,
            NguoiThu: p.NguoiThu,
            NgayThu: p.NgayThu
        }));
        return PhieuThuTien;
    },

    // Lấy phiếu thu tiền theo mã
    getReceiptById: async (id) => {
        const response = await axiosInstance.get(`/phieuthutien/${id}/`);
        const p = response.data;
        const PhieuThuTien = {
            MaPhieuThu: p.MaPhieuThu,
            MaKH: p.MaKH,
            TenKH: p.TenKH,
            SoTienThu: p.SoTienThu,
            NguoiThu: p.NguoiThu,
            NgayThu: p.NgayThu
        };
        return PhieuThuTien;
    },
};

export default phieuThuTienApi;