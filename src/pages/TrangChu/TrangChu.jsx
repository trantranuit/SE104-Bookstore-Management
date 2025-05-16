import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "./TrangChu.css";
import "../../styles/PathStyles.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function TrangChu() {
  const [month, setMonth] = useState("3");
  const [year, setYear] = useState("2020");
  const [totalBooks] = useState(1000);
  const [totalSold] = useState(258);
  const [dailySales, setDailySales] = useState([]);

  // Tạo dữ liệu mẫu cho biểu đồ
  useEffect(() => {
    generateDailySalesData(parseInt(month), parseInt(year));
  }, [month, year]);

  const generateDailySalesData = (month, year) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const newData = Array.from({ length: daysInMonth }, () =>
      Math.floor(Math.random() * 20)
    );
    setDailySales(newData);
  };

  const chartData = {
    labels: dailySales.map((_, index) => `${index + 1}`),
    datasets: [
      {
        label: "Số sách bán ra",
        data: dailySales,
        fill: true,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Biểu đồ số sách bán ra tháng ${month} năm ${year}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Số lượng sách",
        },
      },
      x: {
        title: {
          display: true,
          text: "Ngày",
        },
      },
    },
  };

  const handleMonthChange = (e) => {
    const selectedMonth = e.target.value;
    setMonth(selectedMonth);
  };

  const handleYearChange = (e) => {
    const selectedYear = e.target.value;
    setYear(selectedYear);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Trang chủ</h1>
      <div className="content-wrapper">
        <div className="overview-header">
          <h2 className="overview-title">Tổng quan</h2>
          <div className="date-selectors">
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
        <div className="stat-item">
          <div style={{ height: "400px", padding: "20px" }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrangChu;
