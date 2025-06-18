import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import "./TrangChu.css";
import "../../styles/PathStyles.css";
import trangChuApi from "../../services/trangChuApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function TrangChu() {
  const [selectedMonth, setSelectedMonth] = useState("6");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [applyMonth, setApplyMonth] = useState("6");
  const [applyYear, setApplyYear] = useState("2025");
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalSold, setTotalSold] = useState(0);
  const [dailySales, setDailySales] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]); // Thêm state cho doanh thu theo tháng
  const [topBooks, setTopBooks] = useState([]); // Thêm state cho top sách
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

        // Calculate monthly revenue
        const monthlyRevenueArray = Array(12).fill(0);

        cthoadons.forEach((ct) => {
          const hoadon = hoadons.find((hd) => hd.MaHD === ct.MaHD);
          if (hoadon) {
            const date = parseDate(hoadon.NgayLap);
            if (
              !isNaN(date.getTime()) &&
              date.getFullYear() === parseInt(applyYear)
            ) {
              // Sử dụng SoTienTra từ hóa đơn để tính doanh thu
              const revenue = parseFloat(hoadon.SoTienTra) || 0;
              monthlyRevenueArray[date.getMonth()] += revenue;
            }
          }
        });

        console.log(`Monthly Revenue for ${applyYear}:`, monthlyRevenueArray);
        setMonthlyRevenue(monthlyRevenueArray);

        // Tính toán top sách bán chạy theo tháng
        const bookSales = {}; // Object để tổng hợp dữ liệu bán theo mã sách

        cthoadons.forEach((ct) => {
          const hoadon = hoadons.find((hd) => hd.MaHD === ct.MaHD);
          if (hoadon) {
            const date = parseDate(hoadon.NgayLap);
            if (
              !isNaN(date.getTime()) &&
              date.getMonth() + 1 === parseInt(applyMonth) &&
              date.getFullYear() === parseInt(applyYear)
            ) {
              const maSach = ct.MaSach;
              const slBan = parseInt(ct.SLBan) || 0;

              // Tìm sách tương ứng để lấy tên
              const book = books.find((b) => b.MaSach === maSach);
              const bookName = book ? book.TenDauSach : `Sách #${maSach}`;

              if (!bookSales[maSach]) {
                bookSales[maSach] = {
                  id: maSach,
                  name: bookName,
                  quantity: 0,
                };
              }

              bookSales[maSach].quantity += slBan;
            }
          }
        });

        // Chuyển đổi object thành mảng và sắp xếp theo số lượng bán giảm dần
        const sortedBooks = Object.values(bookSales)
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 10); // Lấy top 10

        console.log(`Top Books for ${applyMonth}/${applyYear}:`, sortedBooks);
        setTopBooks(sortedBooks);

        if (Object.keys(salesByDate).length === 0) {
          setNoDataMessage(
            `Không có dữ liệu bán hàng vào tháng ${applyMonth} năm ${applyYear}`
          );
          setDailySales(Array(daysInMonth).fill(0));
          setMonthlySales(Array(12).fill(0));
          setMonthlyRevenue(Array(12).fill(0));
          setTopBooks([]);
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

  // Chart data cho biểu đồ bán hàng theo ngày
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
        grid: {
          display: false, // Bỏ đường kẻ lưới trục Y
        },
      },
      x: { 
        title: { display: true, text: "Ngày" },
        grid: {
          display: false, // Bỏ đường kẻ lưới trục X
        },
      },
    },
  };

  // Chart data cho biểu đồ bán hàng theo tháng
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
        grid: {
          display: false, // Bỏ đường kẻ lưới trục Y
        },
      },
      x: { 
        title: { display: true, text: "Tháng" },
        grid: {
          display: false, // Bỏ đường kẻ lưới trục X
        },
      },
    },
  };

  // Data cho biểu đồ top sách bán chạy
  const topBooksChartData = {
    labels: topBooks.map((book) => book.name), // Hiển thị đầy đủ tên sách
    datasets: [
      {
        label: "Số lượng bán",
        data: topBooks.map((book) => book.quantity),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgb(54, 162, 235)",
        borderWidth: 1,
      },
    ],
  };

  const topBooksChartOptions = {
    indexAxis: "y", // Hiển thị biểu đồ ngang
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `Top sách bán chạy tháng ${applyMonth} năm ${applyYear}`,
        font: {
          size: 20,
          weight: "bold",
        },
        padding: 20,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Đã bán: ${context.raw} quyển`;
          },
          title: function (context) {
            // Hiển thị đầy đủ tên sách trong tooltip
            return context[0].label;
          },
        },
      },
    },
    scales: {
      y: {
        title: { display: true, text: "Tên sách" },
        grid: {
          display: false, // Bỏ đường kẻ lưới trục Y
        },
        ticks: {
          // Cấu hình để hiển thị đầy đủ text
          maxRotation: 0,
          minRotation: 0,
          font: {
            size: 12,
          },
          // Tự động wrap text nếu quá dài
          callback: function(value, index) {
            const label = this.getLabelForValue(value);
            if (label.length > 40) {
              // Chia thành nhiều dòng nếu quá dài
              const words = label.split(' ');
              const lines = [];
              let currentLine = '';
              
              words.forEach(word => {
                if ((currentLine + word).length > 40) {
                  if (currentLine) lines.push(currentLine.trim());
                  currentLine = word + ' ';
                } else {
                  currentLine += word + ' ';
                }
              });
              
              if (currentLine) lines.push(currentLine.trim());
              return lines;
            }
            return label;
          },
        },
      },
      x: {
        beginAtZero: true,
        title: { display: true, text: "Số lượng bán" },
        ticks: {
          stepSize: 1,
          precision: 0,
        },
        grid: {
          display: false, // Bỏ đường kẻ lưới trục X
        },
      },
    },
  };

  // Data cho biểu đồ doanh thu theo tháng
  const monthlyRevenueChartData = {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    datasets: [
      {
        label: "Doanh thu theo tháng (VND)",
        data: monthlyRevenue,
        fill: true,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.1,
      },
    ],
  };

  const monthlyRevenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `Biểu đồ doanh thu theo tháng năm ${applyYear}`,
        font: {
          size: 20,
          weight: "bold",
        },
        padding: 20,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Doanh thu: ${context.raw.toLocaleString('vi-VN')} VND`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Doanh thu (VND)" },
        ticks: {
          callback: function(value) {
            return value.toLocaleString('vi-VN') + ' VND';
          },
        },
        grid: {
          display: false,
        },
      },
      x: { 
        title: { display: true, text: "Tháng" },
        grid: {
          display: false,
        },
      },
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
      <h1 className="page-title">Tiệm sách Trân Trân</h1>
      <div className="content-wrapper">
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

        <div className="overview-header">
          <h2 className="overview-title">Tổng Quan</h2>
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
              {Array.from({ length: 2 }, (_, i) => (
                <option key={2 + i} value={(2024 + i).toString()}>
                  Năm {2024 + i}
                </option>
              ))}
            </select>
            <button onClick={handleApplyDate} className="ap-dung-trang-chu">
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

        <div className="chart-container">
          <div className="chart-item">
            <div style={{ height: "400px", padding: "20px" }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          <div className="chart-item">
            <div style={{ height: "400px", padding: "20px" }}>
              <Line data={monthlyChartData} options={monthlyChartOptions} />
            </div>
          </div>

          {/* Biểu đồ top sách bán chạy */}
          <div className="chart-item">
            <div style={{ height: "500px", padding: "20px" }}>
              {topBooks.length > 0 ? (
                <Bar data={topBooksChartData} options={topBooksChartOptions} />
              ) : (
                <div className="no-data-message">
                  <p>
                    Không có dữ liệu sách bán ra trong tháng{" "}
                    {applyMonth}/{applyYear}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Biểu đồ doanh thu theo tháng */}
          <div className="chart-item">
            <div style={{ height: "400px", padding: "20px" }}>
              <Line
                data={monthlyRevenueChartData}
                options={monthlyRevenueChartOptions}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrangChu;
