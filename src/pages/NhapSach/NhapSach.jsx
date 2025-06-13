import React, { useState, useEffect } from "react";
import "./NhapSach.css";
import TableNhapSach from "./TableNhapSach";
import ModalNhapSach from "./ModalNhapSach";
import ModalChiTietNhapSach from "./ModalChiTietNhapSach";
import ModalEditChiTietNhapSach from "./ModalEditChiTietNhapSach";
import Notification from "./Notification";
import phieuNhapSachApi from "../../services/phieuNhapSachApi";

const normalizeDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== "string") return "";
  if (dateStr.includes("/")) {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  const [year, month, day] = dateStr.split("-");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

const NhapSach = () => {
  const [isModalPhieuNhapOpen, setIsModalPhieuNhapOpen] = useState(false);
  const [isModalChiTietOpen, setIsModalChiTietOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [notification, setNotification] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    ngayNhap: "",
    MaNguoiNhap: [],
    maPhieuNhap: [],
  });
  const [nguoiNhapOptions, setNguoiNhapOptions] = useState([]);
  const [phieuNhapOptions, setPhieuNhapOptions] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedFilterType, setSelectedFilterType] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    MaNguoiNhap: [],
    maPhieuNhap: [],
  });
  const [pendingPhieuNhap, setPendingPhieuNhap] = useState(null); // Lưu thông tin phiếu nhập chờ
  const [pendingChiTiet, setPendingChiTiet] = useState([]); // Lưu danh sách chi tiết chờ
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ctNhapSach, phieuNhap, sachData, dauSachData] = await Promise.all([
        phieuNhapSachApi.getCTNhapSach(),
        phieuNhapSachApi.getPhieuNhapSach(),
        phieuNhapSachApi.getSach(),
        phieuNhapSachApi.getDauSach(),
      ]);

      const uniqueNguoiNhap = [
        ...new Set(phieuNhap.map((p) => p.NguoiNhap_input)),
      ].filter(Boolean);
      const uniquePhieuNhap = [
        ...new Set(phieuNhap.map((p) => p.MaPhieuNhap)),
      ].filter(Boolean);

      setNguoiNhapOptions(uniqueNguoiNhap);
      setPhieuNhapOptions(uniquePhieuNhap);

      const formattedData = ctNhapSach
        .map((item) => {
          const pn = phieuNhap.find((p) => p.MaPhieuNhap === item.MaPhieuNhap);
          if (!pn) return null;
          const sach = sachData.find((s) => s.MaSach === item.MaSach);
          if (!sach) return null;
          const dauSach = dauSachData.find(
            (ds) => ds.MaDauSach === sach.MaDauSach
          );
          if (!dauSach) return null;
          const tacGia = dauSach.TenTacGia
            ? dauSach.TenTacGia.join(", ")
            : "Không xác định";
          const numericId = item.MaCT_NhapSach.match(/\d+/)?.[0] || "0";
          return {
            maPhieuNhap: item.MaPhieuNhap,
            ngayNhap: pn.NgayNhap || "01/01/1900",
            MaNguoiNhap: pn.NguoiNhap_input || pn.NguoiNhap || "Không xác định",
            TenNguoiNhap: pn.NguoiNhap || "Không xác định",
            maSach: item.MaSach,
            tenSach: sach.TenDauSach || dauSach.TenSach,
            theLoai: dauSach.TenTheLoai || "Không xác định",
            tacGia: tacGia,
            nhaXuatBan: sach.TenNXB || "Không xác định",
            namXuatBan: sach.NamXB,
            giaNhap: item.GiaNhap,
            soLuong: item.SLNhap,
            maCTNhapSach: numericId,
          };
        })
        .filter((item) => item !== null);

      setData(formattedData);
      setFilteredData(formattedData);
      if (formattedData.length === 0) {
        setNotification({
          message: "Không có dữ liệu để hiển thị!",
          type: "info",
        });
      }
    } catch (err) {
      setNotification({
        message: "Lỗi khi tải dữ liệu: " + err.message,
        type: "error",
      });
      console.error("Lỗi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = data.filter(
      (item) =>
        item.maSach.toString().toLowerCase().includes(query) ||
        item.tenSach.toLowerCase().includes(query) ||
        item.maPhieuNhap.toString().toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, checked, value } = e.target;
    setSelectedFilters((prev) => {
      const newValues = checked
        ? [...prev[name], value]
        : prev[name].filter((v) => v !== value);
      return { ...prev, [name]: newValues };
    });
  };

  const applyFilters = () => {
    let filtered = [...data];
    if (filters.ngayNhap) {
      const filterDate = normalizeDate(filters.ngayNhap);
      filtered = filtered.filter(
        (item) => normalizeDate(item.ngayNhap) === filterDate
      );
    }
    if (filters.MaNguoiNhap.length > 0) {
      filtered = filtered.filter((item) =>
        filters.MaNguoiNhap.includes(item.MaNguoiNhap)
      );
    }
    if (filters.maPhieuNhap.length > 0) {
      filtered = filtered.filter((item) =>
        filters.maPhieuNhap.includes(item.maPhieuNhap)
      );
    }
    setFilteredData(filtered);
    setFilters((prev) => ({
      ...prev,
      MaNguoiNhap: selectedFilters.MaNguoiNhap,
      maPhieuNhap: selectedFilters.maPhieuNhap,
    }));
    setIsFilterModalOpen(false);
  };

  const resetFilters = () => {
    setSelectedFilters({ MaNguoiNhap: [], maPhieuNhap: [] });
    setFilters({ ngayNhap: "", MaNguoiNhap: [], maPhieuNhap: [] });
    setFilteredData(data);
    setIsFilterModalOpen(false);
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setIsEditModalOpen(true);
  };

  const handleOpenModalPhieuNhap = () => {
    setIsModalPhieuNhapOpen(true);
  };

  const handleCloseModalPhieuNhap = () => {
    setIsModalPhieuNhapOpen(false);
  };

  const handleCloseModalChiTiet = () => {
    setIsModalChiTietOpen(false);
    setPendingPhieuNhap(null); // Xóa phiếu chờ
    setPendingChiTiet([]); // Xóa chi tiết chờ
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentItem(null);
  };

  const handleSavePhieuNhap = async (formData) => {
    try {
      if (!formData.ngayNhap || !formData.MaNguoiNhap) {
        throw new Error("Vui lòng điền đầy đủ thông tin!");
      }

      const dateParts = formData.ngayNhap.split("-");
      const formattedNgayNhap = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

      setPendingPhieuNhap({
        NgayNhap: formattedNgayNhap,
        NguoiNhap_input: parseInt(formData.MaNguoiNhap),
      });

      setIsModalPhieuNhapOpen(false);
      setIsModalChiTietOpen(true);
    } catch (err) {
      setNotification({ message: `Lỗi: ${err.message}`, type: "error" });
    }
  };

  const handleAddChiTiet = async (formData, action, resetForm) => {
    try {
      const soLuong = parseInt(formData.soLuong);
      const giaNhap = parseInt(formData.giaNhap);

      if (
        !formData.maSach ||
        !soLuong ||
        !giaNhap ||
        soLuong <= 0 ||
        giaNhap <= 0
      ) {
        throw new Error("Vui lòng nhập đầy đủ thông tin hợp lệ!");
      }

      const newChiTiet = {
        maSach: formData.maSach,
        soLuong: parseInt(formData.soLuong),
        giaNhap: parseInt(formData.giaNhap),
      };

      if (action === "finish") {
        // Add current chi tiet to list first
        const allChiTiet = [...pendingChiTiet];
        if (formData.maSach) {
          allChiTiet.push(newChiTiet);
        }

        if (allChiTiet.length === 0) {
          throw new Error("Vui lòng nhập ít nhất một chi tiết!");
        }

        try {
          // Create phieu nhap first
          const phieuNhapResponse = await phieuNhapSachApi.addPhieuNhapSach(
            null,
            pendingPhieuNhap
          );
          const maPhieuNhap = phieuNhapResponse.MaPhieuNhap;

          // Add chi tiet sequentially
          let successCount = 0;
          let errorMessages = [];

          // Process each chi tiet one at a time
          for (let i = 0; i < allChiTiet.length; i++) {
            const chiTiet = allChiTiet[i];
            try {
              await phieuNhapSachApi.addCTNhapSach(
                maPhieuNhap,
                chiTiet.maSach,
                chiTiet.soLuong,
                chiTiet.giaNhap
              );
              successCount++;
            } catch (error) {
              errorMessages.push(
                `Sách ${chiTiet.maSach}: ${
                  error.response?.data?.message || error.message
                }`
              );
            }
            // Add small delay between requests
            if (i < allChiTiet.length - 1) {
              await new Promise((resolve) => setTimeout(resolve, 500));
            }
          }

          // Show final result
          if (errorMessages.length > 0) {
            throw new Error(
              `Thêm ${successCount}/${
                allChiTiet.length
              } chi tiết thành công.\nLỗi:\n${errorMessages.join("\n")}`
            );
          }

          setNotification({
            message: `Đã lưu phiếu nhập ${maPhieuNhap} với ${successCount} chi tiết`,
            type: "success",
          });

          // Reset states
          setPendingPhieuNhap(null);
          setPendingChiTiet([]);
          setIsModalChiTietOpen(false);
          await fetchData();
        } catch (error) {
          throw error;
        }
      } else {
        // Just add to pending list and continue
        setPendingChiTiet((prev) => [...prev, newChiTiet]);
        resetForm();
        setNotification({
          message: "Đã thêm chi tiết, tiếp tục nhập chi tiết khác",
          type: "success",
        });
      }
    } catch (err) {
      setNotification({
        message: `Lỗi: ${err.message}`,
        type: "error",
      });
    }
  };

  const handleEditChiTiet = async (formData) => {
    try {
      const soLuong = parseInt(formData.soLuong);
      const giaNhap = parseInt(formData.giaNhap);

      if (!soLuong || !giaNhap || soLuong <= 0 || giaNhap <= 0) {
        throw new Error("Vui lòng nhập số lượng và giá nhập hợp lệ!");
      }

      const maCTNhapSach = parseInt(currentItem.maCTNhapSach);
      if (isNaN(maCTNhapSach)) {
        throw new Error("Mã chi tiết nhập sách không hợp lệ!");
      }

      await phieuNhapSachApi.updateCTNhapSach(
        maCTNhapSach,
        currentItem.maPhieuNhap,
        currentItem.maSach,
        soLuong,
        giaNhap
      );

      setNotification({
        message: "Cập nhật chi tiết nhập sách thành công!",
        type: "success",
      });
      setIsEditModalOpen(false);
      setCurrentItem(null);
      await fetchData();
    } catch (err) {
      console.error("Lỗi khi sửa:", err);
      setNotification({
        message: `Lỗi khi cập nhật chi tiết nhập sách: ${err.message}`,
        type: "error",
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  if (loading) return <div className="page-container">Đang tải dữ liệu...</div>;

  return (
    <div className="page-container">
      <h1>Nhập sách</h1>
      <div className="content-wrapper">
        <div className="search-bar-ns">
          <input
            type="text"
            placeholder="Tìm kiếm Phiếu nhập theo Mã sách, Tên sách hoặc Mã phiếu nhập..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input-ns"
          />
        </div>
        <div className="filter-bar-ns">
          <button
            className="filter-button-ns"
            onClick={() => {
              setIsFilterModalOpen(true);
              setSelectedFilterType("maPhieuNhap");
            }}
          >
            Lọc theo Mã phiếu nhập
          </button>
          <div className="filter-group-ns">
            <label>Lọc theo Ngày nhập:</label>
            <input
              type="date"
              name="ngayNhap"
              value={filters.ngayNhap}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, ngayNhap: e.target.value }));
                applyFilters();
              }}
              className="filter-input-ns"
            />
          </div>
          <button
            className="filter-button-ns"
            onClick={() => {
              setIsFilterModalOpen(true);
              setSelectedFilterType("MaNguoiNhap");
            }}
          >
            Lọc theo Người nhập
          </button>
        </div>
        <button className="add-button-ns" onClick={handleOpenModalPhieuNhap}>
          + Thêm phiếu nhập
        </button>
        <TableNhapSach data={filteredData} onEdit={handleEdit} />
        {isFilterModalOpen && (
          <div className="modal-overlay-ns">
            <div className="filter-modal-content-ns">
              <h2>
                {selectedFilterType === "maPhieuNhap"
                  ? "Lọc theo Mã phiếu nhập"
                  : "Lọc theo Người nhập"}
              </h2>
              {selectedFilterType === "maPhieuNhap" && (
                <div className="filter-options-ns">
                  {phieuNhapOptions.map((option) => (
                    <label key={option}>
                      <input
                        type="checkbox"
                        name="maPhieuNhap"
                        value={option}
                        checked={selectedFilters.maPhieuNhap.includes(option)}
                        onChange={handleFilterChange}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              )}
              {selectedFilterType === "MaNguoiNhap" && (
                <div className="filter-options-ns">
                  {nguoiNhapOptions.map((option) => (
                    <label key={option}>
                      <input
                        type="checkbox"
                        name="MaNguoiNhap"
                        value={option}
                        checked={selectedFilters.MaNguoiNhap.includes(option)}
                        onChange={handleFilterChange}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              )}
              <div className="modal-actions-ns">
                <button onClick={applyFilters}>Áp dụng</button>
                <button onClick={resetFilters}>Hủy áp dụng</button>
                <button onClick={() => setIsFilterModalOpen(false)}>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {isModalPhieuNhapOpen && (
        <ModalNhapSach
          isOpen={isModalPhieuNhapOpen}
          onClose={handleCloseModalPhieuNhap}
          onSave={handleSavePhieuNhap}
        />
      )}
      {isModalChiTietOpen && (
        <ModalChiTietNhapSach
          isOpen={isModalChiTietOpen}
          onClose={handleCloseModalChiTiet}
          onSave={handleAddChiTiet}
        />
      )}
      {isEditModalOpen && (
        <ModalEditChiTietNhapSach
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleEditChiTiet}
          initialData={currentItem}
        />
      )}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleCloseNotification}
        />
      )}
    </div>
  );
};

export default NhapSach;
