import React, { useState, useEffect } from "react";

const ModalEditChiTietNhapSach = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    soLuong: "",
    giaNhap: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        soLuong: initialData.soLuong || "",
        giaNhap: initialData.giaNhap || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-ctns">
      <div className="modal-content-ctns">
        <h2>Sửa chi tiết nhập sách</h2>

        {/* Readonly Fields */}
        <div className="form-group-ctns">
          <label>Mã phiếu nhập:</label>
          <input
            type="text"
            value={initialData?.maPhieuNhap || ""}
            disabled
            className="form-input-ctns readonly-ctns"
          />
        </div>
        <div className="form-group-ctns">
          <label>Mã sách:</label>
          <input
            type="text"
            value={initialData?.maSach || ""}
            disabled
            className="form-input readonly-ctns"
          />
        </div>
        <div className="form-group-ctns">
          <label>Tên sách:</label>
          <input
            type="text"
            value={initialData?.tenSach || ""}
            disabled
            className="form-input readonly-ctns"
          />
        </div>

        {/* Editable Fields */}
        <div className="form-group-ctns">
          <label>Số lượng:</label>
          <input
            type="number"
            name="soLuong"
            value={formData.soLuong}
            onChange={handleChange}
            min="1"
            className="form-input"
          />
        </div>
        <div className="form-group-ctns">
          <label>Giá nhập:</label>
          <input
            type="number"
            name="giaNhap"
            value={formData.giaNhap}
            onChange={handleChange}
            min="1"
            className="form-input-ctns"
          />
        </div>

        <div className="modal-actions-ctns">
          <button onClick={handleSubmit}>Lưu thay đổi</button>
          <button onClick={onClose}>Hủy</button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditChiTietNhapSach;
