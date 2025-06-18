import React, { useState, useEffect } from "react";
import "./ModalNhapSach.css";
import userApi from "../../services/userApi";

const ModalNhapSach = ({ isOpen, onClose, onSave }) => {
  // Tính toán ngày hiện tại theo múi giờ Việt Nam
  const getVNDate = () => {
    const now = new Date();
    now.setHours(now.getHours() + 7); // Convert to Vietnam timezone (UTC+7)
    return now.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  const [formData, setFormData] = useState({
    ngayNhap: getVNDate(), // Set today's date in Vietnam timezone
    MaNguoiNhap: "",
    tenNguoiNhap: "",
  });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await userApi.getAllUsers();
        console.log("Fetched users:", userData); // For debugging
        setUsers(userData.filter((user) => user.role === "NguoiNhap"));
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "MaNguoiNhap") {
      const userId = parseInt(value);
      const user = users.find((u) => u.id === userId);

      if (!value) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          tenNguoiNhap: "",
        }));
        setError("");
      } else {
        if (user) {
          setFormData((prev) => ({
            ...prev,
            [name]: value,
            tenNguoiNhap: `${user.last_name} ${user.first_name}`.trim(),
          }));
          setError("");
        } else {
          setFormData((prev) => ({
            ...prev,
            [name]: value,
            tenNguoiNhap: "",
          }));
          setError("ID không hợp lệ hoặc không phải người nhập sách!");
        }
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.tenNguoiNhap) {
      setError("Vui lòng nhập ID người nhập hợp lệ!");
      return;
    }
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
              readOnly
              className="readonly-date"
            />
          </div>
          <div className="form-group-mns">
            <label>Mã người nhập sách:</label>
            <input
              type="text"
              name="MaNguoiNhap"
              value={formData.MaNguoiNhap}
              onChange={handleChange}
              placeholder="Vui lòng nhập ID (1,2,3...)"
              required
            />
          </div>
          <div className="form-group-mns">
            <label>Tên người nhập:</label>
            <input
              type="text"
              value={formData.tenNguoiNhap}
              readOnly
              placeholder="Tên sẽ tự động điền khi nhập ID hợp lệ"
              className={formData.tenNguoiNhap ? "valid" : ""}
            />
          </div>
          {error && <div className="error-message-mns">{error}</div>}
          <div className="modal-actions-mns">
            <button type="button" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" disabled={!!error}>
              Tiếp theo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalNhapSach;
