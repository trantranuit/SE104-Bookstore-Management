import axiosInstance from "./AxiosConfig";

const themSachApi = {
    // Lấy tất cả sách
    getAllBooks: async (params = {}) => {
        const response = await axiosInstance.get("/sach/", { params });
        return response.data.map(s => ({
            MaSach: s.MaSach,
            TenDauSach: s.TenDauSach,
            NXB: s.NXB,
            NamXB: s.NamXB,
            SLTon: s.SLTon,
            MaDauSach: s.MaDauSach
        }));
    },

    // Lấy tất cả đầu sách
    getAllDauSach: async (params = {}) => {
        const response = await axiosInstance.get("/dausach/", { params });
        return response.data.map(ds => ({
            MaDauSach: ds.MaDauSach,
            TenSach: ds.TenSach,
            TenTacGia: Array.isArray(ds.TenTacGia) ? ds.TenTacGia : [ds.TenTacGia],
            TheLoai: ds.TenTheLoai // Đổi tên trường cho đúng
        }));
    },

    // Thêm đầu sách mới
    addDauSach: async (data) => {
        // Lấy danh sách đầu sách để tìm mã lớn nhất
        const response = await axiosInstance.get("/dausach/");
        let maxMaDauSach = 0;
        response.data.forEach(ds => {
            const num = parseInt(ds.MaDauSach.replace('DS', ''), 10);
            if (!isNaN(num) && num > maxMaDauSach) maxMaDauSach = num;
        });
        const newMaDauSach = 'DS' + (maxMaDauSach + 1).toString().padStart(3, '0');

        const payload = {
            MaDauSach: newMaDauSach,
            TenSach: data.TenSach,
            TenTheLoai: data.TheLoai[0].TenTheLoai, // Lấy tên thể loại từ object thể loại
            TenTacGia: data.TenTacGia.map(tg => tg.TenTG) // Chuyển đổi mảng object tác giả thành mảng tên tác giả
        };

        const addResponse = await axiosInstance.post("/dausach/", payload);
        return addResponse.data;
    },

    // Thêm sách mới
    addBook: async (data) => {
        // data cần có TenDauSach (tên đầu sách) và MaDauSach
        const payload = {
            ...data,
            TenDauSach: data.TenDauSach,
            MaDauSach: data.MaDauSach,
            NXB: data.NhaXuatBan || data.NXB,
            NamXB: data.NamXuatBan || data.NamXB,
            SLTon: data.SoLuongTon !== undefined ? data.SoLuongTon : 0
        };
        // Đảm bảo các trường đúng tên
        delete payload.NhaXuatBan;
        delete payload.NamXuatBan;
        delete payload.SoLuongTon;
        const response = await axiosInstance.post("/sach/", payload);
        return response.data;
    },

    // Thêm tác giả mới
    addAuthor: async (authorName) => {
        // Lấy MaTG lớn nhất để sinh MaTG mới
        const response = await axiosInstance.get("/tacgia/");
        let maxMaTG = 0;
        response.data.forEach(tg => {
            const num = parseInt(tg.MaTG.replace('TG', ''), 10);
            if (!isNaN(num) && num > maxMaTG) maxMaTG = num;
        });
        const newMaTG = 'TG' + (maxMaTG + 1).toString().padStart(3, '0');

        const payload = {
            MaTG: newMaTG,
            TenTG: authorName
        };
        const addResponse = await axiosInstance.post("/tacgia/", payload);
        return addResponse.data;
    },

    // Lấy tất cả tác giả
    getAllAuthors: async () => {
        const response = await axiosInstance.get("/tacgia/");
        return response.data;
    },

    // Lấy tất cả thể loại
    getAllGenres: async () => {
        const response = await axiosInstance.get("/theloai/");
        return response.data;
    },

    // Thêm thể loại mới
    addGenre: async (genreName) => {
        const response = await axiosInstance.get("/theloai/");
        let maxMaTL = 0;
        response.data.forEach(tl => {
            const num = parseInt(tl.MaTheLoai.replace('TL', ''), 10);
            if (!isNaN(num) && num > maxMaTL) maxMaTL = num;
        });
        const newMaTL = 'TL' + (maxMaTL + 1).toString().padStart(3, '0');

        const payload = {
            MaTheLoai: newMaTL,
            TenTheLoai: genreName
        };
        const addResponse = await axiosInstance.post("/theloai/", payload);
        return addResponse.data;
    }
};

export default themSachApi;