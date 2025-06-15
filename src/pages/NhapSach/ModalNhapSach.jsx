import React, { useState } from "react";
import "./ModalNhapSach.css";

const ModalNhapSach = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    ngayNhap: "",
    MaNguoiNhap: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-mns">
      <div className="modal-content-mns">
        <h2>Phiếu nhập sách</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group-mns">
            <label>Ngày nhập sách:</label>
            <input
              type="date"
              name="ngayNhap"
              value={formData.ngayNhap}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group-mns">
            <label>Mã người nhập sách:</label>
            <input
              type="text"
              name="MaNguoiNhap"
              value={formData.MaNguoiNhap}
              onChange={handleChange}
              required
            />
          </div>
          <div className="modal-actions-mns">
            <button type="button" onClick={onClose}>
              Hủy
            </button>
            <button type="submit">Tiếp theo</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalNhapSach;
