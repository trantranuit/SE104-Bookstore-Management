import axiosInstance from "./AxiosConfig";

export const tatCaSachApi = {
    fetchAllBooks: async (params = {}) => {
        const response = await axiosInstance.get("/sach/", { params });
        return response.data.map(s => ({
            MaSach: s.MaSach,
            TenDauSach: s.TenDauSach,
            TenNXB: s.TenNXB,      // Change from nhaXuatBan to TenNXB
            NamXB: s.NamXB,
            SLTon: s.SLTon,
            MaDauSach: s.MaDauSach
        }));
    },

    fetchAllTitles: async (params = {}) => {
        const response = await axiosInstance.get("/dausach/", { params });
        return response.data.map(ds => ({
            MaDauSach: ds.MaDauSach,
            TenSach: ds.TenSach,
            TenTacGia: Array.isArray(ds.TenTacGia) ? ds.TenTacGia : [ds.TenTacGia],
            TenTheLoai: ds.TenTheLoai  // Make sure this matches API response
        }));
    },

    fetchAllCategories: async (params = {}) => {
        const response = await axiosInstance.get("/theloai/", { params });
        return response.data.map(tl => ({
            MaTheLoai: tl.MaTheLoai,
            TenTheLoai: tl.TenTheLoai
        }));
    },

    fetchAllAuthors: async (params = {}) => {
        const response = await axiosInstance.get("/tacgia/", { params });
        return response.data.map(tg => ({
            MaTG: tg.MaTG,
            TenTG: tg.TenTG
        }));
    },

    fetchAllPublishers: async (params = {}) => {
        const response = await axiosInstance.get("/nxb/", { params });
        return response.data.map(nxb => ({
            MaNXB: nxb.MaNXB,
            TenNXB: nxb.TenNXB
        }));
    },

    fetchAllCTNhapSach: async (params = {}) => {
        const response = await axiosInstance.get("/ctnhapsach/", { params });
        return response.data.map(ct => ({
            MaCT_NhapSach: ct.MaCT_NhapSach,
            MaPhieuNhap: ct.MaPhieuNhap,
            MaSach: ct.MaSach,
            TenSach: ct.TenSach,
            SLNhap: ct.SLNhap,
            GiaNhap: ct.GiaNhap
        }));
    },

    fetchThamSo: async (params = {}) => {
        const response = await axiosInstance.get("/thamso/", { params });
        return response.data.map(ts => ({
            id: ts.id,
            TiLe: ts.TiLe
        }));
    },

    getTacGia: async () => {
        try {
            const response = await axiosInstance.get('/tacgia');
            return response.data;
        } catch (error) {
            console.error('Error fetching tacgia:', error);
            throw error;
        }
    }
};