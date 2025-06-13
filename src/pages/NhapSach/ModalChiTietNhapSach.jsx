import React, { useState } from "react";
import phieuNhapSachApi from "../../services/phieuNhapSachApi";
import "./ModalChiTietNhapSach.css";

const ModalChiTietNhapSach = ({ isOpen, onClose, onSave }) => {
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

  const handleSubmit = (action) => {
    if (!formData.maSach || !formData.soLuong || !formData.giaNhap) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    onSave(formData, action, () => {
      setFormData((prev) => ({
        ...prev,
        maSach: "",
        soLuong: "",
        giaNhap: "",
        tenSach: "",
        theLoai: "",
        tacGia: "",
        nhaXuatBan: "",
        namXuatBan: "",
      }));
      setError(null);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-ctns">
      <div className="modal-content-ctns">
        <h2>Chi tiết nhập sách</h2>
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
      </div>
    </div>
  );
};

export default ModalChiTietNhapSach;
