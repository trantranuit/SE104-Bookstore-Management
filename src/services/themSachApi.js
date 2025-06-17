import axiosInstance from "./AxiosConfig";

// Add or modify the method to get next book ID
const getNextBookId = async () => {
    const response = await axiosInstance.get("/sach/");
    const books = response.data;
    let maxId = 0;

    books.forEach(book => {
        const numId = parseInt(book.MaSach.replace(/^S/, ''));
        if (!isNaN(numId) && numId > maxId) {
            maxId = numId;
        }
    });

    return `S${(maxId + 1).toString().padStart(3, '0')}`;
};

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
            "TenSach": data.TenSach,
            "TenTheLoai_input": data.TheLoai[0].TenTheLoai, // Lấy tên thể loại từ object thể loại
            "TenTacGia_input": data.TenTacGia.map(tg => tg.TenTG) // Chuyển đổi mảng object tác giả thành mảng tên tác giả
        };

        const addResponse = await axiosInstance.post("/dausach/", payload);
        return addResponse.data;
    },

    // Thêm sách mới
    addBook: async (data) => {
        // data cần có TenDauSach (tên đầu sách) và MaDauSach
        const payload = {
            ...data,
            "TenDauSach_input": data.TenSach,
            "TenNXB_input": data.NhaXuatBan || data.NXB,
            "NamXB": data.NamXuatBan || data.NamXB,
        };
        // Đảm bảo các trường đúng tên
        delete payload.NhaXuatBan;
        delete payload.NamXuatBan;
        delete payload.SoLuongTon;
        const response = await axiosInstance.post("/sach/", payload);
        return response.data;
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
    },

    // Lấy tất cả nhà xuất bản
    getAllPublishers: async () => {
        const response = await axiosInstance.get("/nxb/");
        return response.data;
    },

    // Thêm nhà xuất bản mới
    addPublisher: async (publisherName) => {
        const response = await axiosInstance.get("/nxb/");
        let maxMaNXB = 0;
        response.data.forEach(nxb => {
            const num = parseInt(nxb.MaNXB.replace('NXB', ''), 10);
            if (!isNaN(num) && num > maxMaNXB) maxMaNXB = num;
        });
        const newMaNXB = 'NXB' + (maxMaNXB + 1).toString().padStart(3, '0');

        const payload = {
            MaNXB: newMaNXB,
            TenNXB: publisherName
        };
        const addResponse = await axiosInstance.post("/nxb/", payload);
        return addResponse.data;
    },

    // Thêm tác giả mới
    addAuthor: async (authorName) => {
        try {
            const response = await axiosInstance.get("/tacgia/");
            let maxMaTG = 0;
            response.data.forEach(tg => {
                const num = parseInt(tg.MaTG.replace('TG', ''), 10);
                if (!isNaN(num) && num > maxMaTG) maxMaTG = num;
            });
            const newMaTG = 'TG' + (maxMaTG + 1).toString().padStart(3, '0');

            const payload = {
                "TenTG": authorName,
            };

            const addResponse = await axiosInstance.post("/tacgia/", payload);
            return addResponse.data;
        } catch (error) {
            console.error("Error adding author:", error);
            throw error;
        }
    },

    getNextBookId,
};

export default themSachApi;