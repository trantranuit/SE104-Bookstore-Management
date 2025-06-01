import React, { useState } from "react";
import "./ModalNhapSach.css";

const ModalNhapSach = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    ngayNhap: "",
    NguoiNhap: "",
  });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSaveClick = () => {
    if (!formData.ngayNhap || !formData.NguoiNhap) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-ns">
      <div className="modal-container-ns">
        <button className="modal-close-btn-ns" onClick={onClose}>
          &times;
        </button>
        <h2>Phiếu nhập sách</h2>
        <form className="modal-form-ns">
          <div className="form-group-ns">
            <label>Mã Nhập Sách</label>
            <input
              type="text"
              name="maNhap"
              value={formData.maNhap}
              onChange={handleInputChange}
              placeholder="Nhập Mã Nhập Sách"
            />
          </div>

          <div className="form-group-ns">
            <label>Ngày Nhập</label>
            <input
              type="date"
              name="ngayNhap"
              value={formData.ngayNhap}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group-ns">
            <label>Mã Sách</label>
            <input
              type="text" // Sử dụng type="text" để chấp nhận chuỗi
              name="NguoiNhap"
              value={formData.NguoiNhap}
              onChange={handleInputChange}
              placeholder="Nhập Mã Sách"
            />
          </div>
          <div className="form-group-ns">
            <label>Tên Sách</label>
            <input
              type="text"
              name="tenSach"
              value={formData.tenSach}
              onChange={handleInputChange}
              placeholder="Nhập Tên Sách"
            />
          </div>

          <div className="form-group-ns">
            <label>Tác Giả</label>
            <input
              type="text"
              name="tacGia"
              value={formData.tacGia}
              onChange={handleInputChange}
              placeholder="Nhập Tác Giả"
            />
          </div>

          <div className="form-group-ns">
            <label>Thể Loại</label>
            <input
              type="text"
              name="theLoai"
              value={formData.theLoai}
              onChange={handleInputChange}
              placeholder="Nhập Thể Loại"
            />
          </div>

          <div className="form-group-row-ns">
            <div className="form-group-ns">
              <label>Nhà Xuất Bản</label>
              <input
                type="text"
                name="nhaXuatBan"
                value={formData.nhaXuatBan}
                onChange={handleInputChange}
                placeholder="Nhập Nhà Xuất Bản"
              />
            </div>
            <div className="form-group-ns">
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

          <div className="form-group-row-ns">
            <div className="form-group-ns">
              <label>Số Lượng</label>
              <input
                type="number"
                name="soLuong"
                value={formData.soLuong}
                onChange={handleInputChange}
                placeholder="Nhập Số Lượng"
              />
            </div>
            <div className="form-group-ns">
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

          <div className="form-group-ns">
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
