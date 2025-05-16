import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../../styles/PathStyles.css';
import './MoiHoaDon.css';

function MoiHoaDon() {
    const location = useLocation();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState(location.state?.invoice || {});

    const handleInputChange = (field, value) => {
        setInvoice((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        const storedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
        const updatedInvoices = storedInvoices.map((inv) =>
            inv.maHoaDon === invoice.maHoaDon ? invoice : inv
        );

        localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
        navigate('/thanhToan/hoaDon'); // Navigate back to the invoice list
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Sửa Hóa Đơn</h1>
            <div className="content-container">
                <div className="form-group">
                    <label>Mã Hóa Đơn:</label>
                    <input
                        type="text"
                        value={invoice.maHoaDon || ''}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label>Nhân Viên Lập:</label>
                    <input
                        type="text"
                        value={invoice.nhanVien || ''}
                        onChange={(e) => handleInputChange('nhanVien', e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Mã Khách Hàng:</label>
                    <input
                        type="text"
                        value={invoice.maKhachHang || ''}
                        onChange={(e) => handleInputChange('maKhachHang', e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Ngày Lập:</label>
                    <input
                        type="date"
                        value={invoice.ngayLap || ''}
                        onChange={(e) => handleInputChange('ngayLap', e.target.value)}
                    />
                </div>
                <h3>Danh Sách Sách</h3>
                <table className="modal-table">
                    <thead>
                        <tr>
                            <th>Mã Sách</th>
                            <th>Tên Sách</th>
                            <th>Số Lượng</th>
                            <th>Đơn Giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.danhSachSach?.map((sach, index) => (
                            <tr key={index}>
                                <td>{sach.maSach}</td>
                                <td>{sach.tenSach}</td>
                                <td>
                                    <input
                                        type="number"
                                        value={sach.soLuong}
                                        onChange={(e) => {
                                            const updatedBooks = [...invoice.danhSachSach];
                                            updatedBooks[index].soLuong = parseInt(e.target.value, 10);
                                            handleInputChange('danhSachSach', updatedBooks);
                                        }}
                                    />
                                </td>
                                <td>{sach.donGia.toLocaleString()}đ</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="form-actions">
                    <button className="save-button" onClick={handleSave}>Lưu</button>
                    <button className="cancel-button" onClick={() => navigate('/thanhToan/hoaDon')}>Hủy</button>
                </div>
            </div>
        </div>
    );
}

export default MoiHoaDon;
