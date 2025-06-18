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

    getDauSachById: async (maDauSach) => {
        try {
            if (!maDauSach) {
                throw new Error('Mã đầu sách không hợp lệ');
            }
            
            // Nếu maDauSach bắt đầu bằng 'DS', loại bỏ tiền tố và các số 0 đứng đầu
            const dauSachId = maDauSach.toString().replace(/^DS0*/, '');
            
            // Kiểm tra nếu id rỗng hoặc không phải số
            if (!dauSachId || isNaN(Number(dauSachId))) {
                throw new Error('Mã đầu sách không hợp lệ');
            }
            
            console.log('Fetching DauSach with ID:', dauSachId);
            const response = await axiosInstance.get(`/dausach/${dauSachId}/`);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                throw new Error('Không tìm thấy đầu sách với mã đã nhập');
            }
            console.error('Error fetching DauSach:', error);
            throw error;
        }
    },

    updateDauSach: async (data) => {
        try {
            const payload = {
                TenSach: data.TenSach,
                TenTheLoai_input: data.TheLoai,
                TenTacGia_input: data.TenTacGia
            };
            const response = await axiosInstance.put(`/dausach/${data.MaDauSach}/`, payload);
            return response.data;
        } catch (error) {
            console.error('Error updating DauSach:', error);
            throw error;
        }
    },

    updateBook: async (data) => {
        const numericId = data.MaSach.replace(/^S/, '');
        const response = await axiosInstance.patch(`/sach/${numericId}/`, {
            TenNXB_input: data.NXB,
            NamXB: data.NamXB
        });
        return response.data;
    },

    getBookById: async (maSach) => {
        try {
            // Remove leading 'S' if present and remove leading zeros
            const numericId = maSach.replace(/^S/, '').replace(/^0+/, '');
            if (!numericId || isNaN(Number(numericId))) {
                throw new Error('Mã sách không hợp lệ');
            }
            
            console.log('Fetching book with ID:', numericId);
            const response = await axiosInstance.get(`/sach/${numericId}/`);
            
            if (!response.data) {
                throw new Error('Không tìm thấy sách');
            }
            
            const book = response.data;
            // Đảm bảo trả về một đối tượng với các trường cần thiết, dùng giá trị mặc định nếu không có
            return {
                MaSach: book.MaSach || maSach,
                MaDauSach: book.MaDauSach || '',
                TenDauSach: book.TenDauSach || '', 
                NXB: book.TenNXB || book.NXB || '',
                NamXB: book.NamXB || '',
                SLTon: book.SLTon || 0
            };
        } catch (error) {
            if (error.response && error.response.status === 404) {
                throw new Error('Không tìm thấy sách với mã đã nhập');
            }
            console.error('Error fetching book:', error);
            throw error;
        }
    },

    getNextBookId,
};

export default themSachApi;