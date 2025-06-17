import axiosInstance from "./AxiosConfig";

const BASE_URL = "http://localhost:8000/api";

const baoCaoCongNoService = {
  getBaoCaoCongNo: async (month, year) => {
    try {
      console.log(`Fetching debt report for month ${month}, year ${year}`);

      // Format month to match API (e.g., "01/2024")
      const formattedMonth = month.toString().padStart(2, "0");
      const formattedMonthYear = `${formattedMonth}/${year}`;

      // Fetch reports from baocaocongno
      const reportResponse = await axiosInstance.get(
        `${BASE_URL}/baocaocongno/`
      );
      console.log("API Response (baocaocongno):", reportResponse.data);

      if (!reportResponse.data || !Array.isArray(reportResponse.data)) {
        console.log("No reports found");
        return [];
      }

      // Find report matching the selected month and year
      const report = reportResponse.data.find(
        (r) => r.Thang === formattedMonthYear
      );

      if (!report) {
        console.log(`No report found for ${formattedMonthYear}`);
        return [];
      }

      // Fetch details from ctbccongno
      const detailsResponse = await axiosInstance.get(
        `${BASE_URL}/ctbccongno/`
      );
      console.log("API Response (ctbccongno):", detailsResponse.data);

      if (!detailsResponse.data || !Array.isArray(detailsResponse.data)) {
        console.log("No details found");
        return [];
      }

      // Fetch customer data from khachhang
      const khachHangResponse = await axiosInstance.get(
        `${BASE_URL}/khachhang/`
      );
      console.log("API Response (khachhang):", khachHangResponse.data);

      // Create a map of MaKhachHang to DienThoai and Email
      const khachHangMap = {};
      if (khachHangResponse.data && Array.isArray(khachHangResponse.data)) {
        khachHangResponse.data.forEach((kh) => {
          khachHangMap[kh.MaKhachHang] = {
            DienThoai: kh.DienThoai || "N/A",
            Email: kh.Email || "N/A",
          };
        });
      }

      // Filter details by MaBCCN and ensure month/year match, then map with customer data
      const filteredDetails = detailsResponse.data
        .filter(
          (detail) =>
            detail.MaBCCN === report.MaBCCN &&
            parseInt(detail.Thang) === month &&
            parseInt(detail.Nam) === year
        )
        .map((detail) => ({
          id: detail.id,
          MaKH: detail.MaKH,
          TenKH: detail.TenKH,
          DienThoai: khachHangMap[detail.MaKH]?.DienThoai || "N/A",
          Email: khachHangMap[detail.MaKH]?.Email || "N/A",
          NoDau: parseFloat(detail.NoDau) || 0,
          PhatSinh: parseFloat(detail.PhatSinh) || 0,
          NoCuoi: parseFloat(detail.NoCuoi) || 0,
        }));

      console.log("Final processed data:", filteredDetails);
      return filteredDetails;
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

  getReportId: async (month, year) => {
    try {
      console.log(`Getting report ID for month ${month}, year ${year}`);

      // Format month to match API (e.g., "01/2024")
      const formattedMonth = month.toString().padStart(2, "0");
      const formattedMonthYear = `${formattedMonth}/${year}`;

      // Fetch reports from baocaocongno
      const reportResponse = await axiosInstance.get(
        `${BASE_URL}/baocaocongno/`
      );

      if (!reportResponse.data || !Array.isArray(reportResponse.data)) {
        return null;
      }

      // Find report matching the selected month and year
      const report = reportResponse.data.find(
        (r) => r.Thang === formattedMonthYear
      );

      return report ? report.MaBCCN : null;
    } catch (error) {
      console.error("Error getting report ID:", error);
      return null;
    }
  },

  updateBaoCaoCongNo: async (month, year) => {
    try {
      console.log(`Updating debt report for month ${month}, year ${year}`);

      // Make a POST request to trigger the update
      const response = await axiosInstance.post(`${BASE_URL}/baocaocongno/`, {
        Thang_input: month,
        Nam_input: year,
      });

      console.log("Debt report update triggered:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating debt report:", error);
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

  exportExcel: async (reportId, month, year) => {
    try {
      console.log(`Exporting debt report to Excel for ID: ${reportId}`);

      const reportIdNumber = reportId.replace(/\D/g, "");

      const response = await axiosInstance.get(
        `${BASE_URL}/baocaocongno/${reportIdNumber}/excel/`,
        {
          responseType: "blob",
        }
      );

      // Tạo URL cho file blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Tạo tên file với month/year
      const formattedMonth = month.toString().padStart(2, "0");
      link.setAttribute(
        "download",
        `BaoCaoCongNo_${formattedMonth}_${year}.xlsx`
      );

      // Download file
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error("Error exporting Excel:", error);
      throw error;
    }
  },
};

export default baoCaoCongNoService;
