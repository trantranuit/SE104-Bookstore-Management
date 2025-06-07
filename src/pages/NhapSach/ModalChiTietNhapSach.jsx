import React, { useState, useEffect } from "react";
import "./ModalChiTietNhapSach.css";

const ModalChiTietNhapSach = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  maPhieuNhap,
}) => {
  const [formData, setFormData] = useState({
    maCTNhapSach: "",
    maSach: "",
    soLuong: "",
    giaNhap: "",
    theLoai: "",
    tacGia: "",
    tenSach: "",
    nhaXuatBan: "",
    namXuatBan: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        maCTNhapSach: initialData.ctNhapId || "", // Lấy từ backend, ví dụ MaCT_NhapSach
        maSach: initialData.maSach || "",
        soLuong: initialData.soLuong || "",
        giaNhap: initialData.giaNhap || "",
        theLoai: initialData.theLoai || "",
        tacGia: initialData.tacGia || "",
        tenSach: initialData.tenSach || "",
        nhaXuatBan: initialData.nhaXuatBan || "",
        namXuatBan: initialData.namXuatBan || "",
      });
    } else {
      setFormData({
        maCTNhapSach: "", // Reset khi tạo mới
        maSach: "",
        soLuong: "",
        giaNhap: "",
        theLoai: "",
        tacGia: "",
        tenSach: "",
        nhaXuatBan: "",
        namXuatBan: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, "save", () =>
      setFormData({ ...formData, soLuong: "", giaNhap: "" })
    ); // Reset soLuong và giaNhap sau khi lưu
  };

  const handleContinue = (e) => {
    e.preventDefault();
    onSave(formData, "continue", () =>
      setFormData({ ...formData, soLuong: "", giaNhap: "" })
    ); // Reset soLuong và giaNhap để tiếp tục
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Chi tiết nhập sách</h2>
        <form>
          <div className="form-group">
            <label>Mã chi tiết nhập sách:</label>
            <input
              type="text"
              name="maCTNhapSach"
              value={formData.maCTNhapSach}
              onChange={handleChange}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Mã sách:</label>
            <input
              type="text"
              name="maSach"
              value={formData.maSach}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Số lượng:</label>
            <input
              type="number"
              name="soLuong"
              value={formData.soLuong}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Giá nhập:</label>
            <input
              type="number"
              name="giaNhap"
              value={formData.giaNhap}
              onChange={handleChange}
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label>Thể loại:</label>
            <input
              type="text"
              name="theLoai"
              value={formData.theLoai}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Tác giả:</label>
            <input
              type="text"
              name="tacGia"
              value={formData.tacGia}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Tên sách:</label>
            <input
              type="text"
              name="tenSach"
              value={formData.tenSach}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Nhà xuất bản:</label>
            <input
              type="text"
              name="nhaXuatBan"
              value={formData.nhaXuatBan}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Năm xuất bản:</label>
            <input
              type="number"
              name="namXuatBan"
              value={formData.namXuatBan}
              onChange={handleChange}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Hủy
            </button>
            <button type="button" onClick={handleContinue}>
              Tiếp tục
            </button>
            <button type="button" onClick={handleSubmit}>
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalChiTietNhapSach;
