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
  const [selectedMonth, setSelectedMonth] = useState("12");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [applyMonth, setApplyMonth] = useState("12");
  const [applyYear, setApplyYear] = useState("2024");
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalSold, setTotalSold] = useState(0);
  const [dailySales, setDailySales] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noDataMessage, setNoDataMessage] = useState(null);

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
      setNoDataMessage(null);
      try {
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

        // Calculate total sold across all time
        const totalSoldValue = cthoadons.reduce(
          (sum, ct) => sum + (parseInt(ct.SLBan) || 0),
          0
        );
        setTotalSold(totalSoldValue);

        // Calculate daily sales for selected month/year
        const daysInMonth = new Date(
          parseInt(applyYear),
          parseInt(applyMonth),
          0
        ).getDate();
        const dailySalesArray = Array(daysInMonth).fill(0);

        // Group CTHoaDon by date
        const salesByDate = {};

        cthoadons.forEach((ct) => {
          const hoadon = hoadons.find((hd) => hd.MaHD === ct.MaHD);
          if (hoadon) {
            const date = parseDate(hoadon.NgayLap);
            if (
              !isNaN(date.getTime()) &&
              date.getMonth() + 1 === parseInt(applyMonth) &&
              date.getFullYear() === parseInt(applyYear)
            ) {
              const day = date.getDate();
              salesByDate[day] = (salesByDate[day] || 0) + parseInt(ct.SLBan);
            }
          }
        });

        // Fill the dailySalesArray with aggregated values
        Object.entries(salesByDate).forEach(([day, total]) => {
          dailySalesArray[parseInt(day) - 1] = total;
        });

        console.log(
          `Daily Sales for ${applyMonth}/${applyYear}:`,
          dailySalesArray
        );
        setDailySales(dailySalesArray);

        // Calculate monthly sales
        const monthlySalesArray = Array(12).fill(0);

        cthoadons.forEach((ct) => {
          const hoadon = hoadons.find((hd) => hd.MaHD === ct.MaHD);
          if (hoadon) {
            const date = parseDate(hoadon.NgayLap);
            if (
              !isNaN(date.getTime()) &&
              date.getFullYear() === parseInt(applyYear)
            ) {
              monthlySalesArray[date.getMonth()] += parseInt(ct.SLBan);
            }
          }
        });

        console.log(`Monthly Sales for ${applyYear}:`, monthlySalesArray);
        setMonthlySales(monthlySalesArray);

        if (Object.keys(salesByDate).length === 0) {
          setNoDataMessage(
            `Không có dữ liệu bán hàng vào tháng ${applyMonth} năm ${applyYear}`
          );
          setDailySales(Array(daysInMonth).fill(0));
          setMonthlySales(Array(12).fill(0));
        }
      } catch (err) {
        setError(`Lỗi: ${err.message}. Vui lòng kiểm tra console.`);
        console.error("Lỗi API:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [applyMonth, applyYear]);

  const handleApplyDate = () => {
    setApplyMonth(selectedMonth);
    setApplyYear(selectedYear);
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
        tension: 0.1, // Giảm tension để đường cong ít mượt hơn
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
        font: {
          size: 20,
          weight: "bold",
        },
        padding: 20,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Số lượng sách" },
        ticks: {
          stepSize: 1, // Chỉ hiển thị số nguyên
          precision: 0, // Không hiển thị thập phân
        },
      },
      x: { title: { display: true, text: "Ngày" } },
    },
  };

  const monthlyChartData = {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    datasets: [
      {
        label: "Số sách bán ra theo tháng",
        data: monthlySales,
        fill: true,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.1, // Giảm tension
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
        font: {
          size: 20,
          weight: "bold",
        },
        padding: 20,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Số lượng sách" },
        ticks: {
          stepSize: 1, // Chỉ hiển thị số nguyên
          precision: 0, // Không hiển thị thập phân
        },
      },
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
            <button onClick={handleApplyDate} style={{ padding: "8px 16px" }}>
              Áp dụng
            </button>
          </div>
        </div>

        {noDataMessage && (
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              color: "#666",
              backgroundColor: "#f8f9fa",
              borderRadius: "4px",
              margin: "20px 0",
            }}
          >
            {noDataMessage}
          </div>
        )}

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
