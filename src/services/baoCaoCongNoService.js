import axiosInstance from "./AxiosConfig";

const BASE_URL = "http://localhost:8000/api";

const baoCaoCongNoService = {
  getBaoCaoCongNo: async (month, year) => {
    try {
      console.log(`Fetching debt report for month ${month}, year ${year}`);

      // Gọi API baocaocongno
      const reportResponse = await axiosInstance.get(
        `${BASE_URL}/baocaocongno/`
      );
      console.log("API Response (baocaocongno):", reportResponse.data);

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

      // Gọi API ctbccongno để lấy chi tiết công nợ
      const detailsResponse = await axiosInstance.get(
        `${BASE_URL}/ctbccongno/`
      );
      console.log("API Response (ctbccongno):", detailsResponse.data);

      // Gọi API khachhang để lấy thông tin DienThoai và Email
      const khachHangResponse = await axiosInstance.get(
        `${BASE_URL}/khachhang/`
      );
      console.log("API Response (khachhang):", khachHangResponse.data);

      // Tạo map từ MaKhachHang đến DienThoai và Email
      const khachHangMap = {};
      if (khachHangResponse.data && Array.isArray(khachHangResponse.data)) {
        khachHangResponse.data.forEach((kh) => {
          khachHangMap[kh.MaKhachHang] = {
            DienThoai: kh.DienThoai || "N/A",
            Email: kh.Email || "N/A",
          };
        });
      }

      // Xử lý dữ liệu chi tiết
      const allDetails = [];
      if (detailsResponse.data && Array.isArray(detailsResponse.data)) {
        detailsResponse.data.forEach((detail) => {
          const khachHangInfo = khachHangMap[detail.MaKH] || {
            DienThoai: "N/A",
            Email: "N/A",
          };

          allDetails.push({
            id: detail.MaKH || "N/A",
            name: detail.TenKH || "Không xác định",
            phone: khachHangInfo.DienThoai,
            email: khachHangInfo.Email,
            startDebt: parseFloat(detail.NoDau) || 0,
            change: parseFloat(detail.PhatSinh) || 0,
            endDebt: parseFloat(detail.NoCuoi) || 0,
            month: formattedMonthYear,
            year: year,
          });
        });
      }

      console.log("Final processed data:", allDetails);
      return allDetails;
    } catch (error) {
      console.error("Error fetching debt report:", error);
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
};

export default baoCaoCongNoService;
