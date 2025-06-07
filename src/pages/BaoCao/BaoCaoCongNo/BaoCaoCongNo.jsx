import React, { useState, useEffect } from "react";
import TableCongNo from "./TableCongNo";
import baoCaoCongNoService from "../../../services/baoCaoCongNoService";
import "../../../styles/PathStyles.css";
import "./BaoCaoCongNo.css";

function BaoCaoCongNo() {
  const [selectedMonth, setSelectedMonth] = useState("1");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = [2024, 2025];

  const fetchData = async (month, year) => {
    setLoading(true);
    setError(null);
    try {
      const data = await baoCaoCongNoService.getBaoCaoCongNo(parseInt(month), parseInt(year));
      setFilteredData(data);
      if (!data.length) {
        setError(`Không có dữ liệu báo cáo công nợ cho tháng ${month}/${year}`);
      }
    } catch (err) {
      setError("Không thể tải dữ liệu báo cáo. Vui lòng thử lại.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  return (
    <div className="page-container">
      <h1 className="page-title">Báo Cáo Công Nợ</h1>
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
          </div>
          <button className="submit-button" onClick={() => fetchData(selectedMonth, selectedYear)}>
            Hiển Thị
          </button>
        </div>

        {loading && <div className="loading-container">Đang tải dữ liệu...</div>}
        {error && <div className="error-container">{error}</div>}
        {!loading && !error && filteredData.length > 0 && <TableCongNo data={filteredData} />}
      </div>
    </div>
  );
}

export default BaoCaoCongNo;