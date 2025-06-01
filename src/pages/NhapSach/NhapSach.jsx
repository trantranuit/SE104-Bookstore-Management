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
    NguoiNhap: "", // Thay maNguoiNhap thành NguoiNhap
    maPhieuNhap: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ctNhapSach, phieuNhap, sachData, dauSachData, theLoaiData] =
        await Promise.all([
          phieuNhapSachApi.getCTNhapSach(),
          phieuNhapSachApi.getPhieuNhapSach(),
          phieuNhapSachApi.getSach(),
          phieuNhapSachApi.getDauSach(),
          phieuNhapSachApi.getTheLoai(),
        ]);

      const formattedData = ctNhapSach
        .map((item) => {
          const pn = phieuNhap.find((p) => p.MaPhieuNhap === item.MaPhieuNhap);
          if (!pn) return null;

          const sach = sachData.find((s) => s.MaSach === item.MaSach);
          if (!sach) return null;

          const dauSach = dauSachData.find(
            (ds) => ds.TenSach === sach.TenDauSach
          );
          if (!dauSach) return null;

          const theLoai = theLoaiData.find(
            (tl) => tl.TenTheLoai === dauSach.TenTheLoai
          );

          return {
            maPhieuNhap: item.MaPhieuNhap,
            ngayNhap: pn.NgayNhap,
            NguoiNhap: pn.NguoiNhap || "Không xác định", // Thay maNguoiNhap thành NguoiNhap
            maSach: item.MaSach,
            tenSach: dauSach.TenSach,
            theLoai: theLoai ? theLoai.TenTheLoai : "Không xác định",
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
        item.maSach.toString().includes(query) ||
        item.maPhieuNhap.toString().includes(query)
    );
    setFilteredData(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    applyFilters({ ...filters, [name]: value });
  };

  const applyFilters = (currentFilters) => {
    let filtered = [...data];

    if (currentFilters.ngayNhap) {
      filtered = filtered.filter((item) => {
        const dateParts = item.ngayNhap.split("/");
        const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        return formattedDate === currentFilters.ngayNhap;
      });
    }
    if (currentFilters.NguoiNhap) {
      // Thay maNguoiNhap thành NguoiNhap
      filtered = filtered.filter(
        (item) =>
          item.NguoiNhap.toString() === currentFilters.NguoiNhap.toString()
      );
    }
    if (currentFilters.maPhieuNhap) {
      filtered = filtered.filter(
        (item) =>
          item.maPhieuNhap.toString() === currentFilters.maPhieuNhap.toString()
      );
    }

    setFilteredData(filtered);
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
  };

  const handleSavePhieuNhap = async (formData) => {
    console.log("FormData:", formData);
    try {
      if (!formData.ngayNhap || formData.ngayNhap.trim() === "") {
        throw new Error("Vui lòng chọn ngày nhập!");
      }

      const dateParts = formData.ngayNhap.split("-");
      if (dateParts.length !== 3) {
        throw new Error("Ngày nhập không hợp lệ!");
      }
      const formattedNgayNhap = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`; // "12/06/2025"

      const nguoiNhap = formData.NguoiNhap;
      if (!nguoiNhap || nguoiNhap.trim() === "") {
        throw new Error("Người nhập không được để trống!");
      }

      const payload = {
        MaPhieuNhap: null, // Thay "" bằng null, vì server có thể tự tạo
        NgayNhap: formattedNgayNhap,
        NguoiNhap: nguoiNhap,
        username: "admin", // Thêm username tạm thời, thay bằng giá trị hợp lệ
      };

      console.log("Data gửi lên:", payload);

      const phieuResponse = await phieuNhapSachApi.addPhieuNhapSach(
        null,
        payload
      );

      setCurrentPhieuNhap({
        maPhieuNhap: phieuResponse.MaPhieuNhap,
        ngayNhap: formattedNgayNhap,
        NguoiNhap: nguoiNhap,
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
          currentItem.ctNhapId,
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

        await phieuNhapSachApi.addCTNhapSach(
          currentPhieuNhap.maPhieuNhap,
          formData.maSach,
          soLuong,
          giaNhap
        );

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
        <div className="search-filter-bar">
          <input
            type="text"
            placeholder="Tìm kiếm theo Mã sách hoặc Mã phiếu nhập..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
          <div className="filter-group">
            <input
              type="date"
              name="ngayNhap"
              value={filters.ngayNhap}
              onChange={handleFilterChange}
              placeholder="Lọc theo Ngày nhập"
              className="filter-input"
            />
            <input
              type="text" // Thay type="number" bằng text
              name="NguoiNhap" // Thay maNguoiNhap thành NguoiNhap
              value={filters.NguoiNhap}
              onChange={handleFilterChange}
              placeholder="Lọc theo Người nhập"
              className="filter-input"
            />
            <input
              type="text"
              name="maPhieuNhap"
              value={filters.maPhieuNhap}
              onChange={handleFilterChange}
              placeholder="Lọc theo Mã phiếu nhập"
              className="filter-input"
            />
          </div>
        </div>
        <button className="add-button" onClick={handleOpenModalPhieuNhap}>
          + Thêm phiếu nhập
        </button>
        <TableNhapSach data={filteredData} onEdit={handleEdit} />
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