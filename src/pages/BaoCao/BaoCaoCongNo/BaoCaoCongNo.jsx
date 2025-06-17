import React, { useState, useRef, useEffect } from "react";
import TableCongNo from "./TableCongNo";
import baoCaoCongNoService from "../../../services/baoCaoCongNoService";
import "../../../styles/PathStyles.css";
import "./BaoCaoCongNo.css";

function BaoCaoCongNo() {
  const [selectedMonth, setSelectedMonth] = useState("6");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [reportId, setReportId] = useState(null);
  const [isReportGenerated, setIsReportGenerated] = useState(false);
  const tableRef = useRef();

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = [2024, 2025];

  // Chỉ load data ban đầu mà không tự động fetch khi thay đổi tháng hoặc năm
  useEffect(() => {
  }, []); // Empty dependency array for initial load only

  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    setSelectedMonth(newMonth);
    // Reset trạng thái khi thay đổi tháng
    setIsReportGenerated(false);
    setReportId(null);
  };

  const handleYearChange = (e) => {
    const newYear = e.target.value;
    setSelectedYear(newYear);
    // Reset trạng thái khi thay đổi năm
    setIsReportGenerated(false);
    setReportId(null);
  };

  const handleManualUpdate = async () => {
    try {
      setIsUpdating(true);
      
      // Cập nhật báo cáo công nợ từ backend
      await baoCaoCongNoService.updateBaoCaoCongNo(parseInt(selectedMonth, 10), parseInt(selectedYear, 10));
      
      // Sau khi cập nhật backend, tải dữ liệu mới và lấy report ID
      if (tableRef.current) {
        const newReportId = await tableRef.current.refreshData();
        if (newReportId) {
          setReportId(newReportId);
          setIsReportGenerated(true); // Đánh dấu báo cáo đã được xuất
        }
      }
      
      
    } catch (error) {
      console.error("Error updating báo cáo công nợ:", error);
      alert("Có lỗi xảy ra khi cập nhật báo cáo công nợ!");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExportExcel = async () => {
    // Kiểm tra xem báo cáo đã được xuất chưa
    if (!isReportGenerated || !reportId) {
      alert("Vui lòng xuất báo cáo trước khi xuất Excel!");
      return;
    }

    try {
      setIsExporting(true);

      // Use service method to export Excel with authentication
      await baoCaoCongNoService.exportExcel(
        reportId,
        parseInt(selectedMonth, 10),
        parseInt(selectedYear, 10)
      );
      
    } catch (error) {
      console.error("Error exporting Excel:", error);
      alert("Có lỗi xảy ra khi xuất Excel!");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Báo Cáo Công Nợ</h1>
      <div className="content-wrapper">
        <div className="content-day">
          <div className="date-group">
            <h2>Tháng:</h2>
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              disabled={isUpdating}
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div className="date-group">
            <h2>Năm:</h2>
            <select
              value={selectedYear}
              onChange={handleYearChange}
              disabled={isUpdating}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="update-button-group">
            <button 
              className="update-button"
              onClick={handleManualUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? "Đang xuất báo cáo..." : "Xuất báo cáo"}
            </button>
            <button 
              className={`update-button excel-button ${!isReportGenerated ? 'disabled' : ''}`}
              onClick={handleExportExcel}
              disabled={isExporting || !isReportGenerated}
              title={!isReportGenerated ? "Vui lòng xuất báo cáo trước" : "Xuất file Excel"}
            >
              {isExporting ? "Đang xuất Excel..." : "Xuất Excel"}
            </button>
          </div>
        </div>
        <TableCongNo
          ref={tableRef}
          month={parseInt(selectedMonth)} 
          year={parseInt(selectedYear)} 
        />
      </div>
    </div>
  );
}

export default BaoCaoCongNo;