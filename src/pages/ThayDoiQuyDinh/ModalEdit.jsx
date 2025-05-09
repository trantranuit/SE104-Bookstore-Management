import React, { useState, useEffect } from "react";

const ModalEdit = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    tenQuyDinh: "",
    moTa: "",
    tinhTrang: true, // Mặc định là "Đang áp dụng"
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "tinhTrang" ? value === "true" : value, // Chuyển đổi giá trị "true"/"false" thành boolean
    }));
  };

  const handleSaveClick = () => {
    if (!formData.tenQuyDinh || !formData.moTa) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>{initialData ? "Chỉnh sửa quy định" : "Thêm quy định"}</h2>
        <form className="modal-form">
          <div className="form-group">
            <label>Tên quy định</label>
            <input
              type="text"
              name="tenQuyDinh"
              value={formData.tenQuyDinh}
              onChange={handleInputChange}
              placeholder="Nhập tên quy định"
            />
          </div>
          <div className="form-group">
            <label>Mô tả</label>
            <input
              type="text"
              name="moTa"
              value={formData.moTa}
              onChange={handleInputChange}
              placeholder="Nhập mô tả"
            />
          </div>
          <div className="form-group">
            <label>Tình trạng sử dụng</label>
            <select
              name="tinhTrang"
              value={formData.tinhTrang}
              onChange={handleInputChange}
            >
              <option value={true}>Đang áp dụng</option>
              <option value={false}>Không áp dụng</option>
            </select>
          </div>
          <div className="button-group">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Hủy
            </button>
            <button
              type="button"
              className="save-btn"
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

export default ModalEdit;
