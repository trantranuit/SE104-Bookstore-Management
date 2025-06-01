import axios from "axios";
import axiosInstance from "./AxiosConfig";

const BASE_URL = "http://localhost:8000/api";

const baoCaoCongNoService = {
  getBaoCaoCongNo: async (month, year) => {
    try {
      // 1. Lấy dữ liệu báo cáo công nợ
      const reportResponse = await axiosInstance.get(
        `${BASE_URL}/baocaocongno/`
      );
      console.log("API Response (baocaocongno):", reportResponse.data);

      // Lọc báo cáo theo tháng và năm
      const filteredReports = reportResponse.data.filter(
        (report) => report.Thang === month && report.Nam === year
      );

      if (!filteredReports.length) {
        console.log("No reports found for specified month/year");
        return [];
      }

      // 2. Lấy dữ liệu chi tiết công nợ
      const detailsResponse = await axiosInstance.get(
        `${BASE_URL}/ctbccongno/`
      );
      console.log("API Response (ctbccongno):", detailsResponse.data);

      // Tạo map để tra cứu thông tin khách hàng nhanh hơn
      const customerMap = new Map();
      detailsResponse.data.forEach((detail) => {
        customerMap.set(detail.MaKH.MaKhachHang, {
          id: detail.MaKH.MaKhachHang,
          name: detail.MaKH.HoTen || "Không xác định",
          phone: detail.MaKH.DienThoai || "N/A",
          email: detail.MaKH.Email || "N/A",
          startDebt: parseFloat(detail.NoDau) || 0,
          change: parseFloat(detail.PhatSinh) || 0,
          endDebt: parseFloat(detail.NoCuoi) || 0,
        });
      });

      // Xử lý dữ liệu chi tiết từ báo cáo
      const allDetails = [];
      for (const report of filteredReports) {
        if (report.chitiet && Array.isArray(report.chitiet)) {
          for (const item of report.chitiet) {
            const customer = customerMap.get(item.MaKH.MaKhachHang);
            if (customer) {
              allDetails.push({
                ...customer,
                month: report.Thang,
                year: report.Nam,
              });
            }
          }
        }
      }

      console.log("Final processed data:", allDetails);
      return allDetails;
    } catch (error) {
      console.error("Error fetching debt report:", error);
      throw error;
    }
  },
};

export default baoCaoCongNoService;
