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
      const formattedMonthYear = `${String(month).padStart(2, "0")}/${year}`;
      const filteredReports = reportResponse.data.filter(
        (report) => report.Thang === formattedMonthYear
      );

      if (!filteredReports.length) {
        console.log(`No reports found for ${formattedMonthYear}`);
        return [];
      }

      // Lấy danh sách MaBCTon
      const maBCTon = filteredReports.map((report) => report.MaBCTon);

      // Gọi API ctbcton
      const detailResponse = await axiosInstance.get(`${BASE_URL}/ctbcton/`);
      console.log("API Response (ctbcton):", detailResponse.data);

      // Lọc chi tiết báo cáo theo MaBCTon
      const filteredDetails = detailResponse.data.filter((detail) =>
        maBCTon.includes(detail.MaBCTon)
      );

      // Gọi API sach để lấy thông tin TenNXB và NamXB
      const sachResponse = await axiosInstance.get(`${BASE_URL}/sach/`);
      console.log("API Response (sach):", sachResponse.data);

      // Tạo map từ MaSach đến TenNXB và NamXB
      const sachMap = {};
      if (sachResponse.data && Array.isArray(sachResponse.data)) {
        sachResponse.data.forEach((sach) => {
          sachMap[sach.MaSach] = {
            TenNXB: sach.TenNXB || "Không có",
            NamXB: sach.NamXB || "-",
          };
        });
      }

      // Xử lý dữ liệu chi tiết
      const allDetails = filteredDetails.map((item) => ({
        MaSach: item.MaSach || "N/A",
        TenSach: item.TenSach || "Không có tên",
        NXB: sachMap[item.MaSach]?.TenNXB || "Không có",
        NamXB: sachMap[item.MaSach]?.NamXB || "-",
        TonDau: item.TonDau || 0,
        PhatSinh: item.PhatSinh || 0,
        TonCuoi: item.TonCuoi || 0,
      }));

      console.log("Processed inventory report details:", allDetails);
      return allDetails;
    } catch (error) {
      console.error("Error fetching inventory report:", error);
      throw error;
    }
  },

  updateBaoCaoTon: async (month, year) => {
    try {
      console.log(`Updating inventory report for month ${month}, year ${year}`);

      // Format month and year to match the API's expected format
      const formattedMonthYear = `${String(month).padStart(2, "0")}/${year}`;

      // Make a POST request to the baocaoton API to trigger the update
      const response = await axiosInstance.post(`${BASE_URL}/baocaoton/`, {
        Thang_input: month,
        Nam_input: year,
      });

      console.log("Inventory report update triggered:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating inventory report:", error);
      throw error;
    }
  },

  getReportId: async (month, year) => {
    try {
      const formattedMonthYear = `${String(month).padStart(2, "0")}/${year}`;
      const response = await axiosInstance.get(`${BASE_URL}/baocaoton/`);

      if (response.data && Array.isArray(response.data)) {
        const report = response.data.find(
          (r) => r.Thang === formattedMonthYear
        );
        return report ? report.MaBCTon : null;
      }
      return null;
    } catch (error) {
      console.error("Error getting report ID:", error);
      return null;
    }
  },

  exportExcel: async (bctonId) => {
    try {
      console.log(`Exporting inventory report to Excel for ID: ${bctonId}`);

      // Remove "BCT" from the bctonId
      const bctonIdInt = parseInt(bctonId.replace(/\D/g, ""), 10);

      const response = await axiosInstance.get(
        `${BASE_URL}/baocaoton/${bctonIdInt}/excel/`,
        {
          responseType: "blob",
        }
      );

      // Tạo URL cho file blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Tạo tên file với timestamp
      const now = new Date();
      const timestamp = now.toISOString().slice(0, 19).replace(/:/g, "-");
      link.setAttribute("download", `BaoCaoTon_${timestamp}.xlsx`);

      // Thêm link vào DOM và click để download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);

      console.log("Excel export completed successfully");
      return true;
    } catch (error) {
      console.error("Error exporting Excel:", error);
      throw error;
    }
  },
};

export default baoCaoTonService;
