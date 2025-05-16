import React, { useState, useEffect } from "react";
import "./ModalEdit.css";

const ModalEdit = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState(
    initialData || {
      id: "",
      name: "",
      description: "",
      isActive: true,
    }
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "isActive" ? value === "true" : value,
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Sửa quy định</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Mã quy định</label>
            <input
              type="text"
              value={formData.id}
              disabled
              className="disabled-input"
            />
          </div>
          <div className="form-group">
            <label>Tên quy định</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="edit-input"
            />
          </div>
          <div className="form-group">
            <label>Tham số</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="edit-input"
            />
          </div>
          <div className="form-group">
            <label>Tình trạng sử dụng</label>
            <select
              name="isActive"
              value={formData.isActive}
              onChange={handleInputChange}
              className="edit-select"
            >
              <option value={true}>Đang áp dụng</option>
              <option value={false}>Không áp dụng</option>
            </select>
          </div>
          <div className="button-group">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Hủy
            </button>
            <button type="button" className="save-btn" onClick={handleSubmit}>
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEdit;
