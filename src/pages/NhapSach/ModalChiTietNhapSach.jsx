import React, { useState, useEffect } from "react";
import "./ModalNhapSach.css";
import phieuNhapSachApi from "../../services/phieuNhapSachApi";

const ModalChiTietNhapSach = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  maPhieuNhap,
}) => {
  const [formData, setFormData] = useState({
    maNhap: maPhieuNhap || "",
    maSach: "",
    tenSach: "",
    tacGia: "",
    theLoai: "",
    nhaXuatBan: "",
    namXuatBan: "",
    soLuong: "",
    giaNhap: "",
    donGia: "",
  });

  const [error, setError] = useState(null); // Hiển thị lỗi
  const [loading, setLoading] = useState(false); // Thêm loading state

  useEffect(() => {
    if (initialData) {
      setFormData({
        maNhap: initialData.maPhieuNhap || "",
        maSach: initialData.maSach || "",
        tenSach: initialData.tenSach || "",
        tacGia: initialData.tacGia || "",
        theLoai: initialData.theLoai || "",
        nhaXuatBan: initialData.nhaXuatBan || "",
        namXuatBan: initialData.namXuatBan || "",
        soLuong: initialData.soLuong || "",
        giaNhap: initialData.giaNhap || "",
        donGia: initialData.donGia || "",
      });
    } else {
      setFormData((prev) => ({ ...prev, maNhap: maPhieuNhap || "" }));
    }
    setError(null); // Xóa lỗi khi mở modal
  }, [initialData, maPhieuNhap]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };

    if (name === "giaNhap" && value) {
      updatedData.donGia = (parseFloat(value) * 1.05).toFixed(2);
    }

    setFormData(updatedData);
    setError(null); // Xóa lỗi khi nhập lại
  };

  const handleMaSachChange = async (e) => {
    const maSach = e.target.value;
    setFormData((prev) => ({ ...prev, maSach }));
    setError(null);
    setLoading(true);

    if (!initialData && maSach) {
      try {
        const [sachList, dauSachList, tacGiaList, theLoaiList] =
          await Promise.all([
            phieuNhapSachApi.getSach(),
            phieuNhapSachApi.getDauSach(),
            phieuNhapSachApi.getTacGia(),
            phieuNhapSachApi.getTheLoai(),
          ]);

        const sach = sachList.find((s) => s.MaSach === maSach);
        if (sach) {
          const dauSach = dauSachList.find(
            (ds) => ds.TenSach === sach.TenDauSach
          );
          if (dauSach) {
            const tacGia = tacGiaList.find(
              (tg) =>
                Array.isArray(dauSach.TenTacGia) &&
                dauSach.TenTacGia.includes(tg.TenTG)
            );
            const theLoai = theLoaiList.find(
              (tl) => tl.TenTheLoai === dauSach.TenTheLoai
            );

            setFormData((prev) => ({
              ...prev,
              tenSach: dauSach.TenSach || "",
              tacGia: tacGia?.TenTG || "",
              theLoai: theLoai?.TenTheLoai || "",
              nhaXuatBan: sach.NXB || "",
              namXuatBan: sach.NamXB || "",
            }));
          } else {
            setError("Không tìm thấy đầu sách tương ứng.");
          }
        } else {
          setFormData((prev) => ({
            ...prev,
            tenSach: "",
            tacGia: "",
            theLoai: "",
            nhaXuatBan: "",
            namXuatBan: "",
          }));
          setError("Không tìm thấy sách với mã này.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sách:", error);
        setError("Lỗi khi tải thông tin sách. Vui lòng thử lại.");
      }
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      maNhap: maPhieuNhap || "",
      maSach: "",
      tenSach: "",
      tacGia: "",
      theLoai: "",
      nhaXuatBan: "",
      namXuatBan: "",
      soLuong: "",
      giaNhap: "",
      donGia: "",
    });
    setError(null);
    setLoading(false);
  };

  const handleSaveClick = (action) => {
    if (
      !formData.maSach ||
      !formData.soLuong ||
      !formData.giaNhap ||
      parseInt(formData.soLuong) <= 0 ||
      parseFloat(formData.giaNhap) <= 0
    ) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc và hợp lệ!");
      return;
    }
    if (
      !initialData &&
      (!formData.tenSach ||
        !formData.tacGia ||
        !formData.theLoai ||
        !formData.nhaXuatBan ||
        !formData.namXuatBan)
    ) {
      setError("Vui lòng điền đầy đủ thông tin sách khi thêm mới!");
      return;
    }
    onSave(formData, action, resetForm);
  };

  if (!isOpen) return null;

  const isEditing = !!initialData;

  return (
    <div className="modal-overlay-ns">
      <div className="modal-container-ns">
        <button className="modal-close-btn-ns" onClick={onClose}>
          ×
        </button>
        <h2>Chi tiết nhập sách</h2>
        {loading && <div className="loading-message">Đang tải...</div>}
        {error && <div className="error-message">{error}</div>}
        <form className="modal-form-ns">
          <div className="form-group-ns">
            <label>Mã Nhập Sách</label>
            <input type="text" name="maNhap" value={formData.maNhap} readOnly />
          </div>
          <div className="form-group-ns">
            <label>Mã Sách</label>
            <input
              type="text"
              name="maSach"
              value={formData.maSach}
              onChange={handleMaSachChange}
              placeholder="Nhập Mã Sách"
              disabled={isEditing}
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
              readOnly={isEditing}
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
              readOnly={isEditing}
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
              readOnly={isEditing}
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
                readOnly={isEditing}
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
                min="1900"
                max={new Date().getFullYear()}
                readOnly={isEditing}
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
                min="1"
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
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="button-group-ns">
            <button
              type="button"
              className="modal-cancel-btn-ns"
              onClick={() => handleSaveClick("continue")}
            >
              Tiếp tục nhập sách
            </button>
            <button
              type="button"
              className="modal-submit-btn-ns"
              onClick={() => handleSaveClick("complete")}
            >
              Hoàn tất
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalChiTietNhapSach;