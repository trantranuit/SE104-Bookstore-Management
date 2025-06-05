import React, { useState, useEffect } from "react";
import "./ModalEdit.css";

const ModalEdit = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    id: "",
    SLNhapTT: 0,
    TonTD: 0,
    NoTD: "",
    TonTT: 0,
    TiLe: "",
    SDQD4: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || "",
        SLNhapTT: initialData.SLNhapTT || 0,
        TonTD: initialData.TonTD || 0,
        NoTD: initialData.NoTD || "",
        TonTT: initialData.TonTT || 0,
        TiLe: initialData.TiLe || "",
        SDQD4: initialData.SDQD4 !== undefined ? initialData.SDQD4 : true,
      });
    }
  }, [initialData]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};

    if (initialData.tenQuyDinh.includes("Số lượng nhập")) {
      const value = parseInt(formData.SLNhapTT, 10);
      if (isNaN(value) || value <= 0) {
        newErrors.SLNhapTT = "Số lượng nhập tối thiểu phải là số nguyên dương.";
      }
    }

    if (initialData.tenQuyDinh.includes("Số lượng tồn tối đa")) {
      const value = parseInt(formData.TonTD, 10);
      if (isNaN(value) || value <= 0) {
        newErrors.TonTD = "Số lượng tồn tối đa phải là số nguyên dương.";
      }
    }

    if (initialData.tenQuyDinh.includes("Nợ tối đa")) {
      const value = formData.NoTD;
      if (!/^\d+$/.test(value)) {
        newErrors.NoTD = "Nợ tối đa phải là chuỗi số.";
      }
    }

    if (initialData.tenQuyDinh.includes("Số lượng tồn tối thiểu")) {
      const value = parseInt(formData.TonTT, 10);
      if (isNaN(value) || value <= 0) {
        newErrors.TonTT = "Số lượng tồn tối thiểu phải là số nguyên dương.";
      }
    }

    if (initialData.tenQuyDinh.includes("Tỷ lệ")) {
      const value = formData.TiLe;
      if (
        !/^\d*\.?\d+$/.test(value) ||
        parseFloat(value) <= 0 ||
        parseFloat(value) > 2.0
      ) {
        newErrors.TiLe =
          "Tỷ lệ phải là số thực dương từ 0.1 đến 2.0 (ví dụ: 1.05).";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const formattedData = {
      id: formData.id,
      SLNhapTT: parseInt(formData.SLNhapTT, 10) || 0,
      TonTD: parseInt(formData.TonTD, 10) || 0,
      NoTD: formData.NoTD ? formData.NoTD.toString() : "",
      TonTT: parseInt(formData.TonTT, 10) || 0,
      TiLe: formData.TiLe ? formData.TiLe.toString() : "",
      SDQD4: formData.SDQD4,
    };
    console.log("Formatted Data to Send:", formattedData); // Log để debug
    onSave(formattedData);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          ×
        </button>
        <h2>Sửa quy định</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          {initialData.tenQuyDinh.includes("Số lượng nhập") && (
            <div className="form-group">
              <label>Số lượng nhập tối thiểu</label>
              <input
                type="number"
                name="SLNhapTT"
                value={formData.SLNhapTT}
                onChange={handleInputChange}
                className="edit-input"
              />
              {errors.SLNhapTT && <p className="error">{errors.SLNhapTT}</p>}
            </div>
          )}
          {initialData.tenQuyDinh.includes("Số lượng tồn tối đa") && (
            <div className="form-group">
              <label>Số lượng tồn tối đa</label>
              <input
                type="number"
                name="TonTD"
                value={formData.TonTD}
                onChange={handleInputChange}
                className="edit-input"
              />
              {errors.TonTD && <p className="error">{errors.TonTD}</p>}
            </div>
          )}
          {initialData.tenQuyDinh.includes("Nợ tối đa") && (
            <div className="form-group">
              <label>Nợ tối đa (VND)</label>
              <input
                type="text"
                name="NoTD"
                value={formData.NoTD}
                onChange={handleInputChange}
                className="edit-input"
              />
              {errors.NoTD && <p className="error">{errors.NoTD}</p>}
            </div>
          )}
          {initialData.tenQuyDinh.includes("Số lượng tồn tối thiểu") && (
            <div className="form-group">
              <label>Số lượng tồn tối thiểu</label>
              <input
                type="number"
                name="TonTT"
                value={formData.TonTT}
                onChange={handleInputChange}
                className="edit-input"
              />
              {errors.TonTT && <p className="error">{errors.TonTT}</p>}
            </div>
          )}
          {initialData.tenQuyDinh.includes("Tỷ lệ") && (
            <div className="form-group">
              <label>Tỷ lệ đơn giá bán</label>
              <input
                type="number"
                name="TiLe"
                step="0.01"
                min="0.1"
                max="2.0"
                value={formData.TiLe}
                onChange={handleInputChange}
                className="edit-input"
              />
              {errors.TiLe && <p className="error">{errors.TiLe}</p>}
            </div>
          )}
          {initialData.tenQuyDinh.includes("Số tiền thu") && (
            <div className="form-group">
              <label>Áp dụng điều kiện</label>
              <input
                type="checkbox"
                name="SDQD4"
                checked={formData.SDQD4}
                onChange={handleInputChange}
                className="edit-checkbox"
              />
            </div>
          )}
          <div className="button-group">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="save-btn">
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEdit;
