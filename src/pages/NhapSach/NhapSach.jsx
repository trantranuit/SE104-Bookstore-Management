import React, { useState, useEffect } from "react";
import "./NhapSach.css";
import TableNhapSach from "./TableNhapSach";
import ModalNhapSach from "./ModalNhapSach";
import ModalChiTietNhapSach from "./ModalChiTietNhapSach";
import Notification from "./Notification";
import phieuNhapSachApi from "../../services/phieuNhapSachApi";

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
      const [
        ctNhapSach,
        phieuNhap,
        sachData,
        dauSachData,
        theLoaiData,
        tacGiaData,
      ] = await Promise.all([
        phieuNhapSachApi.getCTNhapSach(),
        phieuNhapSachApi.getPhieuNhapSach(),
        phieuNhapSachApi.getSach(),
        phieuNhapSachApi.getDauSach(),
        phieuNhapSachApi.getTheLoai(),
        phieuNhapSachApi.getTacGia(),
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

          const theLoai = theLoaiData.find(
            (tl) => tl.MaTheLoai === dauSach.MaTheLoai
          );
          const tacGia = tacGiaData.find((tg) =>
            dauSach.MaTG.includes(tg.MaTG)
          );

          const tenNguoiNhap = pn.NguoiNhap || "Không xác định";

          return {
            maPhieuNhap: item.MaPhieuNhap,
            ngayNhap: pn.NgayNhap,
            MaNguoiNhap: pn.NguoiNhap_input || pn.NguoiNhap || "Không xác định",
            TenNguoiNhap: tenNguoiNhap,
            maSach: item.MaSach,
            tenSach: dauSach.TenSach,
            theLoai: theLoai ? theLoai.TenTheLoai : "Không xác định",
            tacGia: tacGia ? tacGia.TenTG : "Không xác định",
            nhaXuatBan: sach.NXB,
            namXuatBan: sach.NamXB,
            giaNhap: item.GiaNhap,
            soLuong: item.SLNhap,
            ctNhapId: item.MaCT_NhapSach,
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
      const dateParts = filters.ngayNhap.split("-");
      const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
      filtered = filtered.filter((item) => item.ngayNhap === formattedDate);
    }
    if (selectedFilters.MaNguoiNhap.length > 0) {
      filtered = filtered.filter((item) =>
        selectedFilters.MaNguoiNhap.includes(item.MaNguoiNhap)
      );
    }
    if (selectedFilters.maPhieuNhap.length > 0) {
      filtered = filtered.filter((item) =>
        selectedFilters.maPhieuNhap.includes(item.maPhieuNhap)
      );
    }

    setFilters((prev) => ({ ...prev, ...selectedFilters }));
    setFilteredData(filtered);
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

  const handleEdit = (item) => {
    setCurrentItem(item);
    setIsModalChiTietOpen(true);
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
  };

  const handleSavePhieuNhap = async (formData) => {
    try {
      if (!formData.ngayNhap || formData.ngayNhap.trim() === "") {
        throw new Error("Vui lòng chọn ngày nhập!");
      }

      const dateParts = formData.ngayNhap.split("-");
      const formattedNgayNhap = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`; // dd/mm/yyyy

      const maNguoiNhap = formData.MaNguoiNhap;
      if (!maNguoiNhap || maNguoiNhap.trim() === "") {
        throw new Error("Mã người nhập không được để trống!");
      }

      const payload = {
        NgayNhap: formattedNgayNhap,
        NguoiNhap_input: maNguoiNhap,
      };

      console.log("Payload gửi đi:", payload);
      const phieuResponse = await phieuNhapSachApi.addPhieuNhapSach(
        null,
        payload
      );
      console.log("Phản hồi từ server:", phieuResponse);

      setCurrentPhieuNhap({
        maPhieuNhap: phieuResponse.MaPhieuNhap,
        ngayNhap: formattedNgayNhap,
        MaNguoiNhap: maNguoiNhap,
        TenNguoiNhap: phieuResponse.NguoiNhap || "Không xác định",
      });

      setIsModalPhieuNhapOpen(false);
      setIsModalChiTietOpen(true);
    } catch (err) {
      console.error("Phản hồi lỗi từ server:", err.response?.data);
      setNotification({
        message: `Lỗi khi tạo phiếu nhập: ${err.message}`,
        type: "error",
      });
    }
  };

  const handleSaveChiTiet = async (formData, action, resetForm) => {
    try {
      const soLuong = parseInt(formData.soLuong);
      const giaNhap = parseFloat(formData.giaNhap);

      if (currentItem) {
        await phieuNhapSachApi.updateCTNhapSach(
          formData.maCTNhapSach,
          currentItem.maPhieuNhap,
          parseInt(formData.maSach),
          soLuong,
          giaNhap
        );
        setNotification({
          message: "Cập nhật chi tiết nhập sách thành công!",
          type: "success",
        });
        setIsModalChiTietOpen(false);
        setCurrentItem(null);
      } else {
        let maTheLoai;
        const theLoaiList = await phieuNhapSachApi.getTheLoai();
        const existingTheLoai = theLoaiList.find(
          (tl) => tl.TenTheLoai === formData.theLoai
        );
        if (!existingTheLoai && formData.theLoai) {
          const newTheLoai = await phieuNhapSachApi.addTheLoai(
            formData.theLoai
          );
          maTheLoai = newTheLoai.MaTheLoai;
        } else {
          maTheLoai =
            existingTheLoai?.MaTheLoai || theLoaiList[0]?.MaTheLoai || 1;
        }

        let maTacGia;
        const tacGiaList = await phieuNhapSachApi.getTacGia();
        const existingTacGia = tacGiaList.find(
          (tg) => tg.TenTG === formData.tacGia
        );
        if (!existingTacGia && formData.tacGia) {
          const newTacGia = await phieuNhapSachApi.addTacGia(formData.tacGia);
          maTacGia = newTacGia.MaTG;
        } else {
          maTacGia = existingTacGia?.MaTG || tacGiaList[0]?.MaTG || 1;
        }

        let maDauSach;
        const dauSachList = await phieuNhapSachApi.getDauSach();
        const existingDauSach = dauSachList.find(
          (ds) => ds.TenSach === formData.tenSach
        );
        if (!existingDauSach && formData.tenSach) {
          const newDauSach = await phieuNhapSachApi.addDauSach(
            formData.tenSach,
            maTheLoai,
            maTacGia
          );
          maDauSach = newDauSach.MaDauSach;
        } else {
          maDauSach =
            existingDauSach?.MaDauSach || dauSachList[0]?.MaDauSach || 1;
        }

        const sachList = await phieuNhapSachApi.getSach();
        const existingSach = sachList.find((s) => s.MaSach === formData.maSach);
        if (!existingSach) {
          await phieuNhapSachApi.addSach(
            formData.maSach,
            formData.nhaXuatBan,
            parseInt(formData.namXuatBan),
            maDauSach
          );
        }

        const ctResponse = await phieuNhapSachApi.addCTNhapSach(
          currentPhieuNhap.maPhieuNhap,
          formData.maSach,
          soLuong,
          giaNhap
        );
        setCurrentItem({
          ...currentItem,
          ctNhapId: ctResponse.MaCT_NhapSach || "",
          maSach: formData.maSach,
          soLuong: soLuong,
          giaNhap: giaNhap,
        });

        setNotification({
          message: "Thêm chi tiết nhập sách thành công!",
          type: "success",
        });

        if (action === "continue") {
          resetForm();
        } else {
          setIsModalChiTietOpen(false);
          setCurrentPhieuNhap(null);
        }
      }

      await fetchData();
    } catch (err) {
      setNotification({
        message: `Lỗi khi lưu chi tiết nhập sách: ${err.message}`,
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
          onSave={handleSaveChiTiet}
          initialData={currentItem}
          maPhieuNhap={currentPhieuNhap?.maPhieuNhap}
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
