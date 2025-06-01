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
import trangChuApi from "../../services/trangChuApi";

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
  // State tạm thời khi chọn
  const [selectedMonth, setSelectedMonth] = useState("12"); // Mặc định tháng 12
  const [selectedYear, setSelectedYear] = useState("2024"); // Mặc định năm 2024
  // State đã áp dụng
  const [applyMonth, setApplyMonth] = useState("12");
  const [applyYear, setApplyYear] = useState("2024");
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalSold, setTotalSold] = useState(0);
  const [dailySales, setDailySales] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const parseDate = (dateString) => {
    if (dateString && dateString.includes("/")) {
      const [day, month, year] = dateString.split("/");
      return new Date(`${year}-${month}-${day}`);
    }
    return new Date(dateString);
  };

  useEffect(() => {
    if (!applyMonth || !applyYear) {
      setError("Vui lòng chọn tháng và năm hợp lệ");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError(
            "Không tìm thấy token! Vui lòng lưu token vào localStorage với key 'authToken'."
          );
          console.warn("Token not found, skipping API calls.");
          setLoading(false);
          return;
        }

        const books = await trangChuApi.getAllBooks();
        console.log("Books data:", books);
        if (!books || books.length === 0)
          throw new Error("Không có dữ liệu sách.");
        const totalBooksValue = books.reduce(
          (sum, book) => sum + (book.SLTon || 0),
          0
        );
        setTotalBooks(totalBooksValue);

        const cthoadons = await trangChuApi.getAllCTHoaDon();
        const hoadons = await trangChuApi.getAllHoaDon();
        console.log("CTHoaDon data:", cthoadons);
        console.log("HoaDon data:", hoadons);

        if (!cthoadons.length || !hoadons.length) {
          setError("Không có dữ liệu hóa đơn hoặc chi tiết hóa đơn.");
          setLoading(false);
          return;
        }

        const totalSoldValue = cthoadons.reduce(
          (sum, ct) => sum + (ct.SLBan || 0),
          0
        );
        setTotalSold(totalSoldValue);

        const daysInMonth = new Date(
          parseInt(applyYear),
          parseInt(applyMonth) - 1,
          0
        ).getDate();
        const dailySalesArray = Array(daysInMonth).fill(0);

        let hasData = false;
        cthoadons.forEach((ct) => {
          const hoadon = hoadons.find((hd) => hd.MaHD === ct.MaHD);
          if (hoadon) {
            console.log(
              "Processing MaHD:",
              ct.MaHD,
              "NgayLap:",
              hoadon.NgayLap
            );
            const date = parseDate(hoadon.NgayLap);
            if (
              !isNaN(date.getTime()) &&
              date.getMonth() + 1 === parseInt(applyMonth) &&
              date.getFullYear() === parseInt(applyYear)
            ) {
              const day = date.getDate() - 1;
              dailySalesArray[day] += ct.SLBan || 0;
              hasData = true;
            }
          }
        });
        console.log(
          `Daily Sales for ${applyMonth}/${applyYear}:`,
          dailySalesArray
        );
        setDailySales(dailySalesArray);

        const monthlySalesArray = Array(12).fill(0);
        cthoadons.forEach((ct) => {
          const hoadon = hoadons.find((hd) => hd.MaHD === ct.MaHD);
          if (hoadon) {
            const date = parseDate(hoadon.NgayLap);
            if (
              !isNaN(date.getTime()) &&
              date.getFullYear() === parseInt(applyYear)
            ) {
              monthlySalesArray[date.getMonth()] += ct.SLBan || 0;
            }
          }
        });
        console.log(`Monthly Sales for ${applyYear}:`, monthlySalesArray);
        setMonthlySales(monthlySalesArray);

        if (!hasData) {
          setError(
            `Không có dữ liệu bán hàng cho tháng ${applyMonth} năm ${applyYear}. Vui lòng chọn tháng 12/2024.`
          );
        }
      } catch (err) {
        setError(`Lỗi: ${err.message}. Vui lòng kiểm tra console.`);
        console.error("Lỗi API:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [applyMonth, applyYear]); // Chỉ chạy khi applyMonth hoặc applyYear thay đổi

  const handleApplyDate = () => {
    setApplyMonth(selectedMonth); // Áp dụng giá trị đã chọn
    setApplyYear(selectedYear); // Áp dụng giá trị đã chọn
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
      legend: { position: "top" },
      title: {
        display: true,
        text: `Biểu đồ số sách bán ra tháng ${applyMonth} năm ${applyYear}`,
      },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Số lượng sách" } },
      x: { title: { display: true, text: "Ngày" } },
    },
  };

  const monthlyChartData = {
    labels: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    datasets: [
      {
        label: "Số sách bán ra theo tháng",
        data: monthlySales,
        fill: true,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const monthlyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `Biểu đồ số sách bán ra năm ${applyYear}`,
      },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Số lượng sách" } },
      x: { title: { display: true, text: "Tháng" } },
    },
  };

  if (loading) return <div className="page-container">Đang tải dữ liệu...</div>;
  if (error)
    return (
      <div className="page-container" style={{ color: "red" }}>
        Lỗi: {error}
      </div>
    );

  return (
    <div className="page-container">
      <h1 className="page-title">Trang chủ</h1>
      <div className="content-wrapper">
        <div className="overview-header">
          <h2 className="overview-title">Tổng quan</h2>
          <div className="date-selectors">
            {/* Dropdown cho tháng */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ padding: "8px", marginRight: "10px" }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={(i + 1).toString()}>
                  Tháng {i + 1}
                </option>
              ))}
            </select>
            {/* Dropdown cho năm */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              style={{ padding: "8px", marginRight: "10px" }}
            >
              {Array.from({ length: 6 }, (_, i) => (
                <option key={2020 + i} value={(2020 + i).toString()}>
                  Năm {2020 + i}
                </option>
              ))}
            </select>
            {/* Nút Áp dụng */}
            <button onClick={handleApplyDate} style={{ padding: "8px 16px" }}>
              Áp dụng
            </button>
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
        <div className="stat-item">
          <div style={{ height: "400px", padding: "20px" }}>
            <Line data={monthlyChartData} options={monthlyChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrangChu;
