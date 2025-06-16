import React, { useState } from "react";
import "../../../styles/PathStyles.css";
import "./BaoCaoTon.css";
import TableTon from "./TableTon";
import baoCaoTonService from "../../../services/baoCaoTonService";

function BaoCaoTon() {
  const [selectedMonth, setSelectedMonth] = useState("6");
  const [selectedYear, setSelectedYear] = useState("2025");

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = [2024, 2025]; // Giới hạn theo dữ liệu mẫu

  const handleUpdateBaoCaoTon = async () => {
    try {
      const month = parseInt(selectedMonth, 10);
      const year = parseInt(selectedYear, 10);

      if (isNaN(month) || isNaN(year)) {
        console.error("Invalid month or year selected.");
        return;
      }

      await baoCaoTonService.updateBaoCaoTon(month, year);
      alert(`Báo cáo tồn cho tháng ${month}/${year} đã được cập nhật.`);
    } catch (error) {
      console.error("Error updating báo cáo tồn:", error);
      alert(`Có lỗi xảy ra khi cập nhật báo cáo tồn: ${error.message}`);
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
              onChange={(e) => setSelectedMonth(e.target.value)}
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
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <button className="update-button" onClick={handleUpdateBaoCaoTon}>
              Cập nhật
            </button>
          </div>
        </div>
        <TableTon month={parseInt(selectedMonth)} year={parseInt(selectedYear)} />
      </div>
    </div>
  );
}

export default BaoCaoTon;