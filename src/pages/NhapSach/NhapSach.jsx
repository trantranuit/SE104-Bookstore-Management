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
  const [currentPhieuNhap, setCurrentPhieuNhap] = useState(null);
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

          const numericId = item.MaCT_NhapSach.match(/\d+/)?.[0] || "0"; // Chỉ trích số, không padding

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
            maCTNhapSach: numericId, // Sử dụng số trích xuất
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
      filtered = filtered.filter((item) => {
        const itemDate = normalizeDate(item.ngayNhap);
        return itemDate === filterDate;
      });
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
    setSelectedFilters({
      MaNguoiNhap: [],
      maPhieuNhap: [],
    });
    setFilters({
      ngayNhap: "",
      MaNguoiNhap: [],
      maPhieuNhap: [],
    });
    setFilteredData(data);
    setIsFilterModalOpen(false);
  };
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
    setCurrentPhieuNhap(null);
    setCurrentItem(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentItem(null);
  };
  const handleSavePhieuNhap = async (formData) => {
    try {
      if (!formData.ngayNhap || formData.ngayNhap.trim() === "") {
        throw new Error("Vui lòng chọn ngày nhập!");
      }
      const dateParts = formData.ngayNhap.split("-");
      const formattedNgayNhap = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
      const maNguoiNhap = formData.MaNguoiNhap;
      if (!maNguoiNhap || maNguoiNhap.trim() === "") {
        throw new Error("Mã người nhập không được để trống!");
      }
      const payload = {
        NgayNhap: formattedNgayNhap,
        NguoiNhap_input: maNguoiNhap,
      };
      const phieuResponse = await phieuNhapSachApi.addPhieuNhapSach(
        null,
        payload
      );
      console.log("PhieuResponse:", phieuResponse);
      setCurrentPhieuNhap({
        maPhieuNhap: phieuResponse.MaPhieuNhap,
        ngayNhap: formattedNgayNhap,
        MaNguoiNhap: maNguoiNhap,
        TenNguoiNhap: phieuResponse.NguoiNhap || "Không xác định",
      });
      setCurrentItem(null);
      setIsModalPhieuNhapOpen(false);
      setIsModalChiTietOpen(true);
    } catch (err) {
      setNotification({
        message: `Lỗi khi tạo phiếu nhập: ${err.message}`,
        type: "error",
      });
    }
  };

  const handleAddChiTiet = async (formData, action, resetForm) => {
    try {
      const soLuong = formData.soLuong ? parseInt(formData.soLuong) : null;
      const giaNhap = formData.giaNhap ? parseInt(formData.giaNhap) : null;
      const maPhieuNhap = formData.maPhieuNhap || currentPhieuNhap?.maPhieuNhap;

      // Validation
      if (
        !formData.maSach ||
        !soLuong ||
        !giaNhap ||
        soLuong <= 0 ||
        giaNhap <= 0
      ) {
        throw new Error(
          "Vui lòng nhập đầy đủ mã sách, số lượng và giá nhập hợp lệ!"
        );
      }
      if (!maPhieuNhap) {
        throw new Error("Mã phiếu nhập không được để trống!");
      }

      // Thêm mới chi tiết
      const ctResponse = await phieuNhapSachApi.addCTNhapSach(
        maPhieuNhap,
        formData.maSach,
        soLuong,
        giaNhap
      );

      setNotification({
        message: `Thêm chi tiết nhập sách thành công! Mã chi tiết: ${
          ctResponse.MaCT_NhapSach || "Tự động tạo"
        }`,
        type: "success",
      });

      if (action === "continue") {
        resetForm();
      } else {
        setIsModalChiTietOpen(false);
        setCurrentPhieuNhap(null);
      }

      await fetchData();
    } catch (err) {
      console.error("Lỗi khi thêm:", err);
      setNotification({
        message: `Lỗi khi thêm chi tiết nhập sách: ${err.message}`,
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

      // Đảm bảo currentItem.maCTNhapSach là số
      const maCTNhapSach = parseInt(currentItem.maCTNhapSach);
      if (isNaN(maCTNhapSach)) {
        throw new Error("Mã chi tiết nhập sách không hợp lệ!");
      }

      // Kiểm tra dữ liệu trước khi gửi
      if (!currentItem.maPhieuNhap || !currentItem.maSach) {
        throw new Error("Thông tin phiếu nhập hoặc mã sách không hợp lệ!");
      }

      console.log("Debug - Update CTNhapSach:", {
        id: maCTNhapSach,
        maPhieuNhap: currentItem.maPhieuNhap,
        maSach: currentItem.maSach,
        soLuong: soLuong,
        giaNhap: giaNhap,
      });

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
        <div className="search-bar">
          <input
            type="text"
            placeholder="Tìm kiếm Phiếu nhập theo Mã sách, Tên sách hoặc Mã phiếu nhập..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <div className="filter-bar">
          <button
            className="filter-button"
            onClick={() => {
              setIsFilterModalOpen(true);
              setSelectedFilterType("maPhieuNhap");
            }}
          >
            Lọc theo Mã phiếu nhập
          </button>
          <div className="filter-group">
            <label>Lọc theo Ngày nhập:</label>
            <input
              type="date"
              name="ngayNhap"
              value={filters.ngayNhap}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, ngayNhap: e.target.value }));
                applyFilters();
              }}
              className="filter-input"
            />
          </div>
          <button
            className="filter-button"
            onClick={() => {
              setIsFilterModalOpen(true);
              setSelectedFilterType("MaNguoiNhap");
            }}
          >
            Lọc theo Người nhập
          </button>
        </div>
        <button className="add-button" onClick={handleOpenModalPhieuNhap}>
          + Thêm phiếu nhập
        </button>
        <TableNhapSach data={filteredData} onEdit={handleEdit} />
        {isFilterModalOpen && (
          <div className="modal-overlay">
            <div className="filter-modal-content">
              <h2>
                {selectedFilterType === "maPhieuNhap"
                  ? "Lọc theo Mã phiếu nhập"
                  : "Lọc theo Người nhập"}
              </h2>
              {selectedFilterType === "maPhieuNhap" && (
                <div className="filter-options">
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
                <div className="filter-options">
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
              <div className="modal-actions">
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
          maPhieuNhap={currentPhieuNhap?.maPhieuNhap}
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
