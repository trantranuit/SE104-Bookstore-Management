import React, { useState, useEffect } from "react";
import "./ModalNhapSach.css";

const ModalNhapSach = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    maNhap: "",
    maSach: "",
    ngayNhap: "",
    tenSach: "",
    tacGia: "",
    theLoai: "",
    nhaXuatBan: "",
    namXuatBan: "",
    soLuong: "",
    giaNhap: "",
    donGia: "",
  });

  useEffect(() => {
    if (initialData) {
      console.log("Initial data received:", initialData);
      setFormData({
        maNhap: initialData.maNhap || "",
        maSach: initialData.maSach || "",
        ngayNhap: initialData.ngayNhap || "",
        tenSach: initialData.tenSach || "",
        tacGia: initialData.tacGia || "",
        theLoai: initialData.theLoai || "",
        nhaXuatBan: initialData.nhaXuatBan || "",
        namXuatBan: initialData.namXuatBan || "",
        soLuong: initialData.soLuong || "",
        giaNhap: initialData.giaNhap || "",
        donGia: initialData.donGia || "",
      });
    }
  }, [initialData]);

  // In ModalNhapSach.jsx
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log("Form data updated:", name, value); // Debug log
  };

  const handleSaveClick = () => {
    console.log("Form data before save:", formData);

    // Validate dữ liệu
    if (!formData.maNhap || !formData.ngayNhap) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // Gọi hàm onSave trực tiếp với formData
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Phiếu nhập sách</h2>
        <form className="modal-form">
          <div className="form-group">
            <label>Mã Nhập Sách</label>
            <input
              type="text"
              name="maNhap"
              value={formData.maNhap}
              onChange={handleInputChange}
              placeholder="Nhập Mã Nhập Sách"
            />
          </div>

          <div className="form-group">
            <label>Ngày Nhập</label>
            <input
              type="text"
              name="ngayNhap"
              value={formData.ngayNhap}
              onChange={handleInputChange}
              placeholder="Nhập Ngày Nhập (dd/mm/yyyy)"
            />
          </div>
          <div className="form-group">
            <label>Mã Sách</label>
            <input
              type="text"
              name="maSach"
              value={formData.maSach}
              onChange={handleInputChange}
              placeholder="Nhập Mã Sách"
            />
          </div>
          <div className="form-group">
            <label>Tên Sách</label>
            <input
              type="text"
              name="tenSach"
              value={formData.tenSach}
              onChange={handleInputChange}
              placeholder="Nhập Tên Sách"
            />
          </div>

          <div className="form-group">
            <label>Tác Giả</label>
            <input
              type="text"
              name="tacGia"
              value={formData.tacGia}
              onChange={handleInputChange}
              placeholder="Nhập Tác Giả"
            />
          </div>

          <div className="form-group">
            <label>Thể Loại</label>
            <input
              type="text"
              name="theLoai"
              value={formData.theLoai}
              onChange={handleInputChange}
              placeholder="Nhập Thể Loại"
            />
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label>Nhà Xuất Bản</label>
              <input
                type="text"
                name="nhaXuatBan"
                value={formData.nhaXuatBan}
                onChange={handleInputChange}
                placeholder="Nhập Nhà Xuất Bản"
              />
            </div>
            <div className="form-group">
              <label>Năm Xuất Bản</label>
              <input
                type="number"
                name="namXuatBan"
                value={formData.namXuatBan}
                onChange={handleInputChange}
                placeholder="Nhập Năm Xuất Bản"
              />
            </div>
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label>Số Lượng</label>
              <input
                type="number"
                name="soLuong"
                value={formData.soLuong}
                onChange={handleInputChange}
                placeholder="Nhập Số Lượng"
              />
            </div>
            <div className="form-group">
              <label>Giá Nhập</label>
              <input
                type="number"
                name="giaNhap"
                value={formData.giaNhap}
                onChange={handleInputChange}
                placeholder="Nhập Giá Nhập"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Đơn Giá</label>
            <input
              type="number"
              name="donGia"
              value={formData.donGia}
              onChange={handleInputChange}
              placeholder="Nhập Đơn Giá"
            />
          </div>
          <div className="button-group">
            <button
              type="button"
              className="modal-cancel-btn"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="button"
              className="modal-submit-btn"
              onClick={handleSaveClick}
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalNhapSach;
