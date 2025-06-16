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
  const years = [2024, 2025]; // Giới hạn theo dữ liệu mẫu

  // Auto update on initial load
  useEffect(() => {
    handleAutoUpdate(6, 2025); // Use default values for initial load
  }, []); // Empty dependency array for initial load only

  const handleAutoUpdate = async (month, year) => {
    try {
      setIsUpdating(true);
      
      // Tự động cập nhật báo cáo tồn
      await baoCaoTonService.updateBaoCaoTon(month, year);
      
      // Trigger refresh dữ liệu trong TableTon
      if (tableRef.current) {
        tableRef.current.refreshData();
      }
      
    } catch (error) {
      console.error("Error auto updating báo cáo tồn:", error);
      // Không hiển thị alert để không làm phiền user
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMonthChange = async (e) => {
    const newMonth = e.target.value;
    setSelectedMonth(newMonth);
    await handleAutoUpdate(parseInt(newMonth, 10), parseInt(selectedYear, 10));
  };

  const handleYearChange = async (e) => {
    const newYear = e.target.value;
    setSelectedYear(newYear);
    await handleAutoUpdate(parseInt(selectedMonth, 10), parseInt(newYear, 10));
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
              <span className="updating-indicator">Đang cập nhật...</span>
            )}
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