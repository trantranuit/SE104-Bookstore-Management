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
          ×
        </button>
        <h2>Phiếu nhập sách</h2>
        {error && <div className="error-message">{error}</div>}
        <form className="modal-form-ns">
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
            <label>Người Nhập</label>
            <input
              type="text" // Sử dụng type="text" để chấp nhận chuỗi
              name="NguoiNhap"
              value={formData.NguoiNhap}
              onChange={handleInputChange}
              placeholder="Nhập Người Nhập"
            />
          </div>
          <div className="button-group-ns">
            <button
              type="button"
              className="modal-cancel-btn-ns"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="button"
              className="modal-submit-btn-ns"
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
