import axiosInstance from "./AxiosConfig";

// API cho ThanhToanCu.jsx
const thanhToanCuApi = {
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
        // Ensure all required fields are properly formatted
        const formattedData = {
            SoTienThu: receiptData.SoTienThu.toString(),
            NgayThu: receiptData.NgayThu,
            MaKH_input: receiptData.MaKH_input,
            NguoiThu_input: receiptData.NguoiThu_input
        };

        console.log('Sending receipt data:', formattedData);
        const response = await axiosInstance.post("/phieuthutien/", formattedData);
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
    getAllReceipts: async () => {
        const response = await axiosInstance.get("/phieuthutien/");
        return response.data.map(pt => ({
            MaPhieuThu: pt.MaPhieuThu,
            MaKH: pt.MaKH,
            TenKH: pt.TenKH,
            SoTienThu: pt.SoTienThu,
            NguoiThu: pt.NguoiThu,
            NgayThu: pt.NgayThu
        }));
    },

    getNextReceiptId: async () => {
        try {
            const receipts = await thanhToanCuApi.getAllReceipts();
            let maxId = 0;

            receipts.forEach(receipt => {
                // Extract numeric part from PT001 format
                const numericId = parseInt(receipt.MaPhieuThu.replace(/^PT/, ''));
                if (!isNaN(numericId) && numericId > maxId) {
                    maxId = numericId;
                }
            });

            const nextId = maxId + 1;
            return `PT${nextId.toString().padStart(3, '0')}`;
        } catch (error) {
            console.error('Error getting next receipt ID:', error);
            return 'PT001'; // Default value if error occurs
        }
    },
};

export default thanhToanCuApi;