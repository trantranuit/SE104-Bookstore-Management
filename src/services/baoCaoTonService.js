import axiosInstance from "./AxiosConfig";

const BASE_URL = "http://localhost:8000/api";

const baoCaoTonService = {
  getBaoCaoTon: async (month, year) => {
    try {
      console.log(`Fetching report for month ${month}, year ${year}`);

      // Gọi API baocaoton
      const reportResponse = await axiosInstance.get(`${BASE_URL}/baocaoton/`);
      console.log("API Response (baocaoton):", reportResponse.data);

      if (!reportResponse.data || !Array.isArray(reportResponse.data)) {
        console.log("No reports found");
        return [];
      }

      // Lọc báo cáo theo tháng và năm
      const formattedMonthYear = `${month}/${year}`;
      const filteredReports = reportResponse.data.filter(
        (report) => report.Thang === formattedMonthYear
      );

      if (!filteredReports.length) {
        console.log("No reports found for specified month/year");
        return [];
      }

      // Gọi API ctbcton để lấy chi tiết báo cáo
      const detailResponse = await axiosInstance.get(`${BASE_URL}/ctbcton`);
      console.log("API Response (ctbcton):", detailResponse.data);

      // Gọi API sach để lấy thông tin NXB và NamXB
      const sachResponse = await axiosInstance.get(`${BASE_URL}/sach/`);
      console.log("API Response (sach):", sachResponse.data);

      // Tạo map từ MaSach đến NXB và NamXB
      const sachMap = {};
      if (sachResponse.data && Array.isArray(sachResponse.data)) {
        sachResponse.data.forEach((sach) => {
          sachMap[sach.MaSach] = {
            NXB: sach.NXB || "Không có",
            NamXB: sach.NamXB || "-",
          };
        });
      }

      // Xử lý dữ liệu chi tiết
      const allDetails = [];
      if (detailResponse.data && Array.isArray(detailResponse.data)) {
        detailResponse.data.forEach((item) => {
          const sachInfo = sachMap[item.MaSach] || {
            NXB: "Không có",
            NamXB: "-",
          };

          allDetails.push({
            MaSach: item.MaSach || "N/A",
            TenSach: item.TenSach || "Không có tên",
            NXB: sachInfo.NXB,
            NamXB: sachInfo.NamXB,
            TonDau: item.TonDau || 0,
            PhatSinh: item.PhatSinh || 0,
            TonCuoi: item.TonCuoi || 0,
          });
        });
      }

      console.log("Processed inventory report details:", allDetails);
      return allDetails;
    } catch (error) {
      console.error("Error fetching inventory report:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      } else if (error.request) {
        console.error("No response received. Backend may be down.");
      } else {
        console.error("Error setting up request:", error.message);
      }
      throw error;
    }
  },

  getBookDetails: async (bookId, bookData = null) => {
    if (bookData) {
      return {
        MaSach: bookData.MaSach || bookId,
        TenSach: bookData.TenSach || `Sách ${bookId}`,
        TheLoai: bookData.TheLoai || "Không có thể loại",
        TenTacGia: bookData.TenTacGia || "Tác giả không xác định",
      };
    }

    try {
      const response = await axiosInstance.get(`${BASE_URL}/sach/${bookId}/`);
      if (response.data && response.data.MaDauSach) {
        const dauSachResponse = await axiosInstance.get(
          `${BASE_URL}/dausach/${response.data.MaDauSach}/`
        );
        let authorName = "Tác giả không xác định";
        if (dauSachResponse.data.MaTG?.length > 0) {
          const authorResponse = await axiosInstance.get(
            `${BASE_URL}/tacgia/${dauSachResponse.data.MaTG[0]}/`
          );
          authorName = authorResponse.data.TenTG || authorName;
        }
        return {
          MaSach: bookId,
          TenSach: dauSachResponse.data.TenSach || `Sách ${bookId}`,
          TheLoai:
            dauSachResponse.data.MaTheLoai?.TenTheLoai || "Không có thể loại",
          TenTacGia: authorName,
        };
      }
      return {
        MaSach: bookId,
        TenSach: response.data.TenSach || `Sách ${bookId}`,
        TheLoai: "Không có thể loại",
        TenTacGia: "Tác giả không xác định",
      };
    } catch (error) {
      console.error(`Error fetching book details for ID ${bookId}:`, error);
      return {
        MaSach: bookId,
        TenSach: `Sách ${bookId}`,
        TheLoai: "Không có thể loại",
        TenTacGia: "Tác giả không xác định",
      };
    }
  },
};

export default baoCaoTonService;
