import React, { useState, useRef, useEffect } from "react";
import "../../../styles/PathStyles.css";
import "./BaoCaoTon.css";
import TableTon from "./TableTon";
import baoCaoTonService from "../../../services/baoCaoTonService";

function BaoCaoTon() {
  const [selectedMonth, setSelectedMonth] = useState("6");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [isUpdating, setIsUpdating] = useState(false);
  const tableRef = useRef();

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = [2024, 2025]; 

  // Load initial data without auto-update
  useEffect(() => {
  }, []); // Empty dependency array for initial load only

  // Đã loại bỏ function handleAutoUpdate vì không cần thiết nữa

  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    setSelectedMonth(newMonth);
    // Chỉ thay đổi state, không load dữ liệu
  };

  const handleYearChange = (e) => {
    const newYear = e.target.value;
    setSelectedYear(newYear);
    // Chỉ thay đổi state, không load dữ liệu
  };

  const handleManualUpdate = async () => {
    try {
      setIsUpdating(true);
      
      // Cập nhật báo cáo tồn từ backend
      await baoCaoTonService.updateBaoCaoTon(parseInt(selectedMonth, 10), parseInt(selectedYear, 10));
      
      // Sau khi cập nhật backend, tải dữ liệu mới
      if (tableRef.current) {
        await tableRef.current.refreshData();
      }
      
    } catch (error) {
      console.error("Error updating báo cáo tồn:", error);
      alert("Có lỗi xảy ra khi cập nhật báo cáo tồn!");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Báo Cáo Tồn</h1>
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
            {isUpdating && (
              <span className="updating-indicator">Đang xuất báo cáo...</span>
            )}
          </div>
          <div className="update-button-group">
            <button 
              className="update-button"
              onClick={handleManualUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? "Đang xuất báo cáo..." : "Xuất báo cáo"}
            </button>
          </div>
        </div>
        <TableTon 
          ref={tableRef}
          month={parseInt(selectedMonth)} 
          year={parseInt(selectedYear)} 
        />
      </div>
    </div>
  );
}

export default BaoCaoTon;