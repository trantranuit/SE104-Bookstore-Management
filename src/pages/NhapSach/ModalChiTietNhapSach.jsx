import React, { useState, useEffect } from "react";
import phieuNhapSachApi from "../../services/phieuNhapSachApi";
import "./ModalChiTietNhapSach.css";
import Notification from "./Notification"; // Import Notification component

const ModalChiTietNhapSach = ({
  isOpen,
  onClose,
  onSave,
  pendingChiTiet,
  onDeletePending,
  onEditPending,
  setPendingChiTiet,
}) => {
  const [formData, setFormData] = useState({
    maSach: "",
    soLuong: "",
    giaNhap: "",
    tenSach: "",
    theLoai: "",
    tacGia: "",
    nhaXuatBan: "",
    namXuatBan: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [currentItem, setCurrentItem] = useState(null); // Track current editing item
  const [editingIndex, setEditingIndex] = useState(null); // Track index being edited
  const [notification, setNotification] = useState(null);

  const fetchSachInfo = async (maSach) => {
    try {
      setError(null);
      setLoading(true);
      const sachData = await phieuNhapSachApi.getSach();
      const dauSachData = await phieuNhapSachApi.getDauSach();

      const sach = sachData.find((s) => s.MaSach === maSach);
      if (!sach) {
        throw new Error("Không tìm thấy sách với mã này!");
      }

      const dauSach = dauSachData.find((ds) => ds.MaDauSach === sach.MaDauSach);
      if (!dauSach) {
        throw new Error("Không tìm thấy đầu sách tương ứng!");
      }

      const tacGia = dauSach.TenTacGia
        ? dauSach.TenTacGia.join(", ")
        : "Không xác định";

      setFormData((prev) => ({
        ...prev,
        tenSach: sach.TenDauSach || dauSach.TenSach || "Không xác định",
        theLoai: dauSach.TenTheLoai || "Không xác định",
        tacGia: tacGia,
        nhaXuatBan: sach.TenNXB || "Không xác định",
        namXuatBan: sach.NamXB || "Không xác định",
      }));
    } catch (err) {
      console.error("Lỗi fetchSachInfo:", err);
      setError(err.message);
      setFormData((prev) => ({
        ...prev,
        tenSach: "",
        theLoai: "",
        tacGia: "",
        nhaXuatBan: "",
        namXuatBan: "",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "maSach") {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }

      // Check for duplicate mã sách, excluding the current editing item
      if (
        pendingChiTiet.some(
          (item, idx) => idx !== editingIndex && item.maSach === value
        )
      ) {
        setError("Mã sách trùng. Vui lòng nhập mã sách khác");
        setFormData((prev) => ({
          ...prev,
          tenSach: "",
          theLoai: "",
          tacGia: "",
          nhaXuatBan: "",
          namXuatBan: "",
        }));
        return;
      }

      if (value.trim() !== "") {
        const timeout = setTimeout(() => {
          fetchSachInfo(value);
        }, 500);
        setDebounceTimeout(timeout);
      } else {
        setFormData((prev) => ({
          ...prev,
          tenSach: "",
          theLoai: "",
          tacGia: "",
          nhaXuatBan: "",
          namXuatBan: "",
        }));
        setError(null);
      }
    }
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    const itemToEdit = pendingChiTiet[index];
    setFormData((prev) => ({
      ...prev,
      maSach: itemToEdit.maSach,
      soLuong: itemToEdit.soLuong.toString(),
      giaNhap: itemToEdit.giaNhap.toString(),
    }));
    fetchSachInfo(itemToEdit.maSach);
  };

  const handleSaveEdit = async () => {
    try {
      // Basic validation
      if (!formData.maSach || !formData.soLuong || !formData.giaNhap) {
        throw new Error("Vui lòng nhập đầy đủ thông tin!");
      }

      const soLuong = parseInt(formData.soLuong);
      const giaNhap = parseInt(formData.giaNhap);

      if (soLuong <= 0 || giaNhap <= 0) {
        throw new Error("Số lượng và giá nhập phải lớn hơn 0!");
      }

      // Validate duplicate excluding current editing item
      const isDuplicate = pendingChiTiet.some(
        (item, idx) => idx !== editingIndex && item.maSach === formData.maSach
      );
      if (isDuplicate) {
        throw new Error("Mã sách đã tồn tại trong danh sách!");
      }

      // Create new list with updated item at the editing index
      const updatedList = [...pendingChiTiet];
      updatedList[editingIndex] = {
        maSach: formData.maSach,
        soLuong: soLuong,
        giaNhap: giaNhap,
      };

      // Notify parent to update the list
      onEditPending(updatedList);

      // Reset form and edit state
      setEditingIndex(null);
      setFormData({
        maSach: "",
        soLuong: "",
        giaNhap: "",
        tenSach: "",
        theLoai: "",
        tacGia: "",
        nhaXuatBan: "",
        namXuatBan: "",
      });

      setNotification({
        message: "Cập nhật chi tiết thành công",
        type: "success",
      });
    } catch (err) {
      setNotification({
        message: err.message,
        type: "error",
      });
    }
  };

  const handleSubmit = async (action) => {
    try {
      if (action === "continue") {
        // Basic validation
        if (!formData.maSach || !formData.soLuong || !formData.giaNhap) {
          throw new Error("Vui lòng nhập đầy đủ thông tin!");
        }

        // Get tham số and sách info to validate tồn
        const [thamSo, sachList] = await Promise.all([
          phieuNhapSachApi.getThamSo(),
          phieuNhapSachApi.getSach(),
        ]);

        const sach = sachList.find((s) => s.MaSach === formData.maSach);
        if (!sach) {
          throw new Error("Không tìm thấy thông tin sách!");
        }

        const soLuongNhap = parseInt(formData.soLuong);

        // Check ONLY if the current inventory itself is already at or exceeding the limit
        // We don't consider the new quantity being added when checking the limit
        if (sach.SLTon >= thamSo[0].TonTD) {
          throw new Error(
            `Sách ${formData.maSach}: ${sach.TenDauSach} đã đạt tồn tối đa (hiện tại: ${sach.SLTon}, giới hạn: ${thamSo[0].TonTD}).`
          );
        }

        // Check minimum SLNhapTT
        if (soLuongNhap < thamSo[0].SLNhapTT) {
          throw new Error(`Số lượng nhập phải ≥ ${thamSo[0].SLNhapTT}.`);
        }
      }

      onSave(formData, action, () => {
        setFormData({
          maSach: "",
          soLuong: "",
          giaNhap: "",
          tenSach: "",
          theLoai: "",
          tacGia: "",
          nhaXuatBan: "",
          namXuatBan: "",
        });
      });
    } catch (err) {
      setNotification({
        message: err.message,
        type: "error",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-ctns">
      <div className="modal-content-ctns">
        <h2>Chi tiết nhập sách</h2>

        {/* Hiển thị danh sách chi tiết đang chờ */}
        {pendingChiTiet.length > 0 && (
          <div className="pending-list-ctns">
            <h3>Danh sách chi tiết đã nhập:</h3>
            {pendingChiTiet.map((chiTiet, index) => (
              <div key={index} className="pending-item-ctns">
                <div className="pending-info-ctns">
                  Mã sách: {chiTiet.maSach} - SL: {chiTiet.soLuong} - Giá:{" "}
                  {chiTiet.giaNhap}
                </div>
                <div className="pending-actions-ctns">
                  {editingIndex === index ? (
                    <>
                      <button onClick={handleSaveEdit}>Lưu</button>
                      <button onClick={() => setEditingIndex(null)}>Hủy</button>
                    </>
                  ) : (
                    <button onClick={() => handleEditClick(index)}>Sửa</button>
                  )}
                  <button onClick={() => onDeletePending(index)}>×</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Form nhập chi tiết */}
        {loading && (
          <p style={{ color: "blue", fontSize: "0.9em" }}>
            Đang tải thông tin sách...
          </p>
        )}
        {error && <p style={{ color: "red", fontSize: "0.9em" }}>{error}</p>}
        <div className="form-group-ctns">
          <label>Mã sách:</label>
          <input
            type="text"
            name="maSach"
            value={formData.maSach}
            onChange={handleChange}
            className="form-input-ctns"
          />
        </div>
        <div className="form-group-ctns">
          <label>Tên sách:</label>
          <input
            type="text"
            name="tenSach"
            value={formData.tenSach}
            onChange={handleChange}
            className="form-input-ctns"
            readOnly
          />
        </div>
        <div className="form-group-ctns">
          <label>Thể loại:</label>
          <input
            type="text"
            name="theLoai"
            value={formData.theLoai}
            onChange={handleChange}
            className="form-input-ctns"
            readOnly
          />
        </div>
        <div className="form-group-ctns">
          <label>Tác giả:</label>
          <input
            type="text"
            name="tacGia"
            value={formData.tacGia}
            onChange={handleChange}
            className="form-input-ctns"
            readOnly
          />
        </div>
        <div className="form-group-ctns">
          <label>Nhà xuất bản:</label>
          <input
            type="text"
            name="nhaXuatBan"
            value={formData.nhaXuatBan}
            onChange={handleChange}
            className="form-input-ctns"
            readOnly
          />
        </div>
        <div className="form-group-ctns">
          <label>Năm xuất bản:</label>
          <input
            type="text"
            name="namXuatBan"
            value={formData.namXuatBan}
            onChange={handleChange}
            className="form-input-ctns"
            readOnly
          />
        </div>
        <div className="form-group-ctns">
          <label>Số lượng:</label>
          <input
            type="number"
            name="soLuong"
            value={formData.soLuong}
            onChange={handleChange}
            className="form-input-ctns"
          />
        </div>
        <div className="form-group-ctns">
          <label>Giá nhập:</label>
          <input
            type="number"
            name="giaNhap"
            value={formData.giaNhap}
            onChange={handleChange}
            className="form-input-ctns"
          />
        </div>
        <div className="modal-actions-ctns">
          <button onClick={() => handleSubmit("continue")}>Tiếp tục</button>
          <button onClick={() => handleSubmit("finish")}>Hoàn tất</button>
          <button onClick={onClose}>Đóng</button>
        </div>

        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </div>
  );
};

export default ModalChiTietNhapSach;
