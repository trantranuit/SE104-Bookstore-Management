import axiosInstance from "./AxiosConfig";

const thanhToanMoiApi = {
    // Sách
    getAllBooks: async (params = {}) => {
        const response = await axiosInstance.get("/sach/", { params });
        return response.data.map(s => ({
            MaSach: s.MaSach,
            MaDauSach: s.MaDauSach,
            TenDauSach: s.TenDauSach,
            TenNXB: s.TenNXB,
            NamXB: s.NamXB,
            SLTon: s.SLTon
        }));
    },
    getBookById: async (id) => {
        const numericId = id.replace(/^S/, '');
        console.log(`Gửi yêu cầu lấy sách với ID: ${numericId}`);
        const s = (await axiosInstance.get(`/sach/${numericId}/`)).data;
        return {
            MaSach: `S${s.MaSach.toString().padStart(3, '0')}`,
            MaDauSach: s.MaDauSach,
            TenSach: s.TenDauSach,
            NXB: s.TenNXB,
            NamXB: s.NamXB,
            SLTon: s.SLTon
        };
    },
    updateBookStock: async (maSach, slTon) => {
        const numericId = maSach.replace(/^S/, '');
        console.log(`Cập nhật tồn kho cho sách ID: ${numericId}, SLTon: ${slTon}`);
        await axiosInstance.patch(`/sach/${numericId}/`, { SLTon: slTon });
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
        const numericId = id.replace(/^KH/, '');
        const c = (await axiosInstance.get(`/khachhang/${numericId}/`)).data;
        return {
            MaKhachHang: c.MaKhachHang,
            HoTen: c.HoTen,
            DiaChi: c.DiaChi,
            DienThoai: c.DienThoai,
            Email: c.Email,
            SoTienNo: c.SoTienNo
        };
    },
    updateCustomerDebt: async (maKhachHang, soTienNo) => {
        const numericId = maKhachHang.replace(/^KH/, '');
        const response = await axiosInstance.patch(`/khachhang/${numericId}/`, { SoTienNo: soTienNo });
        return response.data;
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
        const numericId = id.replace(/^NV/, '');
        const u = (await axiosInstance.get(`/user/${numericId}/`)).data;
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
        return response.data.map(ds => ({
            MaDauSach: ds.MaDauSach,
            TenSach: ds.TenSach,
            TenTacGia: Array.isArray(ds.TenTacGia) ? ds.TenTacGia : [ds.TenTacGia],
            TheLoai: ds.TenTheLoai
        }));
    },
    getDauSachById: async (id) => {
        const d = (await axiosInstance.get(`/dausach/${id}/`)).data;
        return {
            MaDauSach: d.MaDauSach,
            TenSach: d.TenSach,
            TenTheLoai: d.TenTheLoai,
            TenTacGia: d.TenTacGia
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
    getAllHoaDon: async () => {
        const response = await axiosInstance.get("/hoadon/");
        return {
            data: response.data,
            count: response.data.length
        };
    },
    getHoaDonById: async (id) => {
        const numericId = id.replace(/^HD/, '');
        const hd = (await axiosInstance.get(`/hoadon/${numericId}/`)).data;
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
    createInvoice: async (invoiceData) => {
        const invoiceHeader = {
            MaKH_input: invoiceData.MaKH_input.replace(/^KH/, ''),
            NgayLap: invoiceData.NgayLap,
            NguoiLapHD_input: invoiceData.NguoiLapHD_input.replace(/^NV/, ''),
            SoTienTra: invoiceData.SoTienTra.toString(),
            TongTien: invoiceData.TongTien.toString(),
            ConLai: invoiceData.ConLai.toString()
        };
        console.log('Sending invoice header to API:', invoiceHeader);
        const response = await axiosInstance.post("/hoadon/", invoiceHeader);
        return response.data;
    },
    deleteInvoice: async (maHoaDon) => {
        const numericId = maHoaDon.replace(/^HD/, '');
        const response = await axiosInstance.delete(`/hoadon/${numericId}/`);
        return response.data;
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
    },
    createCTHoaDon: async (ctHoaDon) => {
        const data = {
            MaHD_input: ctHoaDon.MaHD_input.replace(/^HD/, ''),
            MaSach_input: ctHoaDon.MaSach_input.replace(/^S/, ''),

            SLBan: ctHoaDon.SLBan,
            GiaBan: parseFloat(ctHoaDon.GiaBan),
            ThanhTien: parseFloat(ctHoaDon.ThanhTien)
        };
        console.log('Gửi chi tiết hóa đơn:', data);
        try {
            const response = await axiosInstance.post("/cthoadon/", data);
            console.log('Phản hồi từ /cthoadon/:', response.data);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi gửi POST /cthoadon/:', {
                error: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw error;
        }
    },

    // Chi tiết nhập sách
    getAllCTNhapSach: async (params = {}) => {
        const response = await axiosInstance.get("/ctnhapsach/", { params });
        return response.data.map(ct => ({
            id: ct.id,
            SLNhap: ct.SLNhap,
            GiaNhap: parseFloat(ct.GiaNhap),
            MaPhieuNhap: ct.MaPhieuNhap,
            MaSach: ct.MaSach
        }));
    },
    getCTNhapSachById: async (id) => {
        const ct = (await axiosInstance.get(`/ctnhapsach/${id}/`)).data;
        return {
            id: ct.id,
            SLNhap: ct.SLNhap,
            GiaNhap: parseFloat(ct.GiaNhap),
            MaPhieuNhap: ct.MaPhieuNhap,
            MaSach: ct.MaSach
        };
    },

    // Phiếu nhập sách
    getAllPhieuNhapSach: async (params = {}) => {
        const response = await axiosInstance.get("/phieunhapsach/", { params });
        return response.data.map(pn => ({
            id: pn.id,
            SLNhap: pn.SLNhap,
            GiaNhap: parseFloat(pn.GiaNhap),
            MaPhieuNhap: pn.MaPhieuNhap,
            MaSach: pn.MaSach
        }));
    },
    getPhieuNhapSachById: async (id) => {
        const pn = (await axiosInstance.get(`/phieunhapsach/${id}/`)).data;
        return {
            id: pn.id,
            SLNhap: pn.SLNhap,
            GiaNhap: parseFloat(pn.GiaNhap),
            MaPhieuNhap: pn.MaPhieuNhap,
            MaSach: pn.MaSach
        };
    },

    // Tham số
    getAllThamSo: async (params = {}) => {
        const response = await axiosInstance.get("/thamso/", { params });
        return response.data.map(ts => ({
            id: ts.id,
            SLNhapTT: ts.SLNhapTT,
            TonTD: ts.TonTD,
            NoTD: parseFloat(ts.NoTD),
            TonTT: ts.TonTT,
            TiLe: parseFloat(ts.TiLe),
            SDQD4: ts.SDQD4
        }));
    },
    getThamSoById: async (id) => {
        const ts = (await axiosInstance.get(`/thamso/${id}/`)).data;
        return {
            id: ts.id,
            SLNhapTT: ts.SLNhapTT,
            TonTD: ts.TonTD,
            NoTD: parseFloat(ts.NoTD),
            TonTT: ts.TonTT,
            TiLe: parseFloat(ts.TiLe),
            SDQD4: ts.SDQD4
        };
    },

    // Thêm method export PDF
    exportInvoicePDF: async (invoiceId) => {
        try {
            const numericId = invoiceId.replace(/^HD/, '');
            const response = await axiosInstance.get(`/hoadon/${numericId}/export-pdf/`, {
                responseType: 'blob',
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
                    'Content-Type': 'application/pdf',
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error exporting PDF:', error);
            throw error;
        }
    }
};

export default thanhToanMoiApi;