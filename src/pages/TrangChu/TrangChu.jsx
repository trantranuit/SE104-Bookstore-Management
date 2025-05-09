import React, { useState } from "react";
import "./TrangChu.css";

function TrangChu() {
  const [month, setMonth] = useState("3"); // Tháng hiện tại
  const [year, setYear] = useState("2025"); // Năm hiện tại
  const [totalBooks, setTotalBooks] = useState(1000); // Tổng số sách hiện có
  const [totalSold, setTotalSold] = useState(258); // Tổng số sách đã bán

  const handleMonthChange = (e) => setMonth(e.target.value);
  const handleYearChange = (e) => setYear(e.target.value);
  // Giả lập nhập sách
  const handleAddBooks = () => {
    const newBooks = 50; // Số lượng sách nhập mới
    setTotalBooks((prev) => prev + newBooks);
  };

  // Giả lập bán sách
  const handleSellBooks = () => {
    const soldBooks = 20; // Số lượng sách bán ra
    if (totalBooks >= soldBooks) {
      setTotalBooks((prev) => prev - soldBooks);
      setTotalSold((prev) => prev + soldBooks);
    } else {
      alert("Không đủ sách trong kho để bán!");
    }
  };
  return (
    <div className="trang-chu-content">
      {/* Phần Tổng quan */}
      <div className="overview">
        <div className="overview-header">
          <h2 className="overview-title">Tổng quan tháng</h2>
          <select value={month} onChange={handleMonthChange}>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Tháng {i + 1}
              </option>
            ))}
          </select>
          <select value={year} onChange={handleYearChange}>
            {Array.from({ length: 5 }, (_, i) => (
              <option key={2020 + i} value={2020 + i}>
                Năm {2020 + i}
              </option>
            ))}
          </select>
        </div>
        <div className="overview-stats">
          <div className="stat-item">
            <span className="stat-label">Tổng số sách hiện có:</span>
            <span className="stat-value">{totalBooks}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Tổng số sách đã bán:</span>
            <span className="stat-value">{totalSold}</span>
          </div>
        </div>
        <div className="overview-actions">
          <button onClick={handleAddBooks} className="action-button">
            Nhập sách
          </button>
          <button onClick={handleSellBooks} className="action-button">
            Bán sách
          </button>
        </div>
      </div>

      {/* Phần Biểu đồ */}
      <div className="chart">
        <h3 className="chart-title">Biểu đồ doanh thu theo ngày</h3>
        <div className="chart-container">
          <div className="chart-placeholder">[Biểu đồ]</div>
        </div>
      </div>
    </div>
  );
}

export default TrangChu;
