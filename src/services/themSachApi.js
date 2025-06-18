import axiosInstance from "./AxiosConfig";

// Helper function to extract numeric ID
const extractNumericId = (id, prefix) => {
  if (!id) throw new Error("Invalid ID");
  return id.replace(new RegExp(`^${prefix}0*`), "");
};

// Helper function to format ID with prefix
const formatId = (numericId, prefix) => {
  return `${prefix}${numericId.toString().padStart(3, "0")}`;
};

const themSachApi = {
  // Get the next available book ID
  getNextBookId: async () => {
    const response = await axiosInstance.get("/sach/");
    const books = response.data;
    let maxId = 0;

    books.forEach((book) => {
      const numId = parseInt(extractNumericId(book.MaSach, "S"));
      if (!isNaN(numId) && numId > maxId) maxId = numId;
    });

    return `S${(maxId + 1).toString().padStart(3, "0")}`;
  },

  // Lấy tất cả sách
  getAllBooks: async (params = {}) => {
    const response = await axiosInstance.get("/sach/", { params });
    return response.data.map((s) => ({
      MaSach: s.MaSach,
      TenDauSach: s.TenDauSach,
      NXB: s.NXB,
      NamXB: s.NamXB,
      SLTon: s.SLTon,
      MaDauSach: s.MaDauSach,
    }));
  },

  // Lấy tất cả đầu sách
  getAllDauSach: async (params = {}) => {
    const response = await axiosInstance.get("/dausach/", { params });
    return response.data.map((ds) => ({
      MaDauSach: ds.MaDauSach,
      TenSach: ds.TenSach,
      TenTacGia: Array.isArray(ds.TenTacGia) ? ds.TenTacGia : [ds.TenTacGia],
      TheLoai: ds.TenTheLoai,
    }));
  },

  // Thêm đầu sách mới
  addDauSach: async (data) => {
    const response = await axiosInstance.get("/dausach/");
    const maxId = Math.max(
      ...response.data.map(
        (ds) => parseInt(extractNumericId(ds.MaDauSach, "DS")) || 0
      )
    );

    const payload = {
      TenSach: data.TenSach,
      TenTheLoai_input: data.TheLoai[0].TenTheLoai,
      TenTacGia_input: data.TenTacGia.map((tg) => tg.TenTG),
    };

    const addResponse = await axiosInstance.post("/dausach/", payload);
    return { ...addResponse.data, MaDauSach: formatId(maxId + 1, "DS") };
  },

  // Cập nhật đầu sách
  updateDauSach: async (data) => {
    const numericId = extractNumericId(data.MaDauSach, "DS");
    const payload = {
      TenSach: data.TenSach,
      TenTheLoai_input: data.TheLoai,
      TenTacGia_input: data.TenTacGia,
    };
    await axiosInstance.put(`/dausach/${numericId}/`, payload);
  },

  // Thêm sách mới
  addBook: async (data) => {
    const payload = {
      TenDauSach_input: data.TenSach,
      TenNXB_input: data.NXB,
      NamXB: data.NamXB,
      SLTon: data.SLTon,
    };
    await axiosInstance.post("/sach/", payload);
  },

  // Cập nhật thông tin sách
  updateBook: async (data) => {
    const numericId = extractNumericId(data.MaSach, "S");
    const payload = {
      NXB: data.NXB,
      NamXB: data.NamXB,
    };
    await axiosInstance.patch(`/sach/${numericId}/`, payload);
  },

  // Lấy thông tin sách theo ID
  getBookById: async (maSach) => {
    try {
      const numericId = extractNumericId(maSach, "S");
      const response = await axiosInstance.get(`/sach/${numericId}/`);
      if (!response.data) throw new Error("Không tìm thấy sách");
      const book = response.data;
      return {
        MaSach: book.MaSach || maSach,
        MaDauSach: book.MaDauSach || "",
        TenDauSach: book.TenDauSach || "",
        NXB: book.TenNXB || book.NXB || "",
        NamXB: book.NamXB || "",
        SLTon: book.SLTon || 0,
      };
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error("Không tìm thấy sách với mã đã nhập");
      }
      console.error("Error fetching book:", error);
      throw error;
    }
  },

  // Lấy thông tin đầu sách theo ID
  getDauSachById: async (maDauSach) => {
    try {
      const numericId = extractNumericId(maDauSach, "DS");
      const response = await axiosInstance.get(`/dausach/${numericId}/`);
      if (!response.data) throw new Error("Không tìm thấy đầu sách");
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error("Không tìm thấy đầu sách với mã đã nhập");
      }
      console.error("Error fetching dau sach:", error);
      throw error;
    }
  },

  // Author APIs
  getAllAuthors: async () => {
    const response = await axiosInstance.get("/tacgia/");
    return response.data.map((author) => ({
      ...author,
      MaTG: formatId(extractNumericId(author.MaTG, "TG"), "TG"),
    }));
  },

  addAuthor: async (authorName) => {
    try {
      const response = await axiosInstance.get("/tacgia/");
      const maxId = Math.max(
        ...response.data.map(
          (tg) => parseInt(extractNumericId(tg.MaTG, "TG")) || 0
        )
      );

      const payload = {
        TenTG: authorName,
      };

      const addResponse = await axiosInstance.post("/tacgia/", payload);
      return {
        ...addResponse.data,
        MaTG: formatId(maxId + 1, "TG"),
      };
    } catch (error) {
      console.error("Error adding author:", error);
      throw error;
    }
  },

  updateAuthor: async (authorId, newName) => {
    try {
      const numericIt = extractNumericId(authorId, "TG");
      const numericId = extractNumericId(numericIt, "TL");
      const response = await axiosInstance.put(`/tacgia/${numericId}/`, {
        TenTG: newName,
      });
      return {
        ...response.data,
        MaTG: authorId, // Keep the original formatted ID
      };
    } catch (error) {
      console.error("Error updating author:", error);
      throw error;
    }
  },

  deleteAuthor: async (authorId) => {
    try {
      const numericIt = extractNumericId(authorId, "TG");
      const numericId = extractNumericId(numericIt, "TL");
      console.log("Deleting author with numeric ID:", numericId); // Debug
      await axiosInstance.delete(`/tacgia/${numericId}/`);
      return true;
    } catch (error) {
      console.error("Error deleting author:", error);
      throw error;
    }
  },

  // Genre APIs
  getAllGenres: async () => {
    const response = await axiosInstance.get("/theloai/");
    return response.data.map((genre) => ({
      ...genre,
      MaTheLoai: formatId(extractNumericId(genre.MaTheLoai, "TL"), "TL"),
    }));
  },

  addGenre: async (genreName) => {
    const response = await axiosInstance.get("/theloai/");
    const maxId = Math.max(
      ...response.data.map(
        (tl) => parseInt(extractNumericId(tl.MaTheLoai, "TL")) || 0
      )
    );

    const payload = {
      TenTheLoai: genreName,
    };
    const addResponse = await axiosInstance.post("/theloai/", payload);
    return { ...addResponse.data, MaTheLoai: formatId(maxId + 1, "TL") };
  },

  updateGenre: async (genreId, newName) => {
    try {
      const numericId = extractNumericId(genreId, "TL");
      const response = await axiosInstance.put(`/theloai/${numericId}/`, {
        TenTheLoai: newName,
      });
      return { ...response.data, MaTheLoai: genreId };
    } catch (error) {
      console.error("Error updating genre:", error);
      throw error;
    }
  },

  deleteGenre: async (genreId) => {
    try {
      const numericId = extractNumericId(genreId, "TL");
      await axiosInstance.delete(`/theloai/${numericId}/`);
      return true;
    } catch (error) {
      console.error("Error deleting genre:", error);
      throw error;
    }
  },

  // Publisher APIs
  getAllPublishers: async () => {
    const response = await axiosInstance.get("/nxb/");
    return response.data.map((publisher) => ({
      ...publisher,
      MaNXB: formatId(extractNumericId(publisher.MaNXB, "NXB"), "NXB"),
    }));
  },

  addPublisher: async (publisherName) => {
    const response = await axiosInstance.get("/nxb/");
    const maxId = Math.max(
      ...response.data.map(
        (nxb) => parseInt(extractNumericId(nxb.MaNXB, "NXB")) || 0
      )
    );

    const payload = {
      TenNXB: publisherName,
    };
    const addResponse = await axiosInstance.post("/nxb/", payload);
    return { ...addResponse.data, MaNXB: formatId(maxId + 1, "NXB") };
  },

  updatePublisher: async (publisherId, newName) => {
    try {
      const numericId = extractNumericId(publisherId, "NXB");
      const response = await axiosInstance.put(`/nxb/${numericId}/`, {
        TenNXB: newName,
      });
      return {
        ...response.data,
        MaNXB: publisherId, // Keep the original formatted ID
      };
    } catch (error) {
      console.error("Error updating publisher:", error);
      throw error;
    }
  },

  deletePublisher: async (publisherId) => {
    try {
      const numericId = extractNumericId(publisherId, "NXB");
      await axiosInstance.delete(`/nxb/${numericId}/`);
      return true;
    } catch (error) {
      console.error("Error deleting publisher:", error);
      throw error;
    }
  },
};

export default themSachApi;
