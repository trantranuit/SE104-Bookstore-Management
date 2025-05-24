import React, { useState, useEffect } from "react";
import TableCongNo from "./TableCongNo";
import baoCaoCongNoService from "../../../services/baoCaoCongNoService";
import "./BaoCaoCongNo.css";

function BaoCaoCongNo() {
  const [selectedMonth, setSelectedMonth] = useState("5"); 
  const [selectedYear, setSelectedYear] = useState("2025");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 2 }, (_, i) => 2025 - i);

  const fetchData = async (month, year) => {
    try {
      setLoading(true);
      setError(null);
      const data = await baoCaoCongNoService.getBaoCaoCongNo(parseInt(month), parseInt(year));
      setFilteredData(data);
    } catch (err) {
      setError("Không thể tải dữ liệu báo cáo. Vui lòng thử lại.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]); // Tự động cập nhật khi thay đổi tháng/năm

  const handleSubmit = () => {
    fetchData(selectedMonth, selectedYear);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Báo Cáo Công Nợ</h1>
      <div className="content-wrapper-bccn">
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
          </div>
          <button className="submit-button" onClick={handleSubmit}>
            Hiển Thị
          </button>
        </div>

        {loading && <div className="loading">Đang tải dữ liệu...</div>}
        {error && <div className="error">{error}</div>}
        {!loading && !error && <TableCongNo data={filteredData} />}
      </div>
    </div>
  );
}

export default BaoCaoCongNo;